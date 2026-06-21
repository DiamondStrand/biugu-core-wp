<?php

namespace Biugu_Core\Sync;

if (! defined('ABSPATH')) {
    exit;
}

class Delta_Sync
{
    public function __construct()
    {
        add_action('save_post_event', [$this, 'handle_event_sync'], 10, 3);
    }

    public function handle_event_sync($post_id, $post, $update)
    {
        // 1. BAIL EARLY: Kör inte vid autosparning
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // 2. BAIL EARLY: Kör inte om det är en revision, i papperskorgen eller ett tomt utkast
        if (wp_is_post_revision($post_id) || !$post || $post->post_status === 'auto-draft' || $post->post_status === 'trash') {
            return;
        }

        // 3. SÄKERHET: Unslasha och sanera nonce-strängen innan kontroll för att tillfredsställa PCP
        $nonce = isset($_POST['_wpnonce']) ? sanitize_text_field(wp_unslash($_POST['_wpnonce'])) : '';
        if (!wp_verify_nonce($nonce, 'update-post_' . $post_id)) {
            return;
        }

        // 4. BAIL EARLY: Om det inte finns någon data medskickad från React-appen, avbryt
        if (!isset($_POST['biu_occurrences_transport'])) {
            return;
        }

        // Datans giltighet saneras och valideras inuti sync_occurrences metoden under array-loopen
        // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
        $raw_json = wp_unslash($_POST['biu_occurrences_transport']);

        // Trigga synkningen med den faktiska datan från formuläret
        $this->sync_occurrences($post_id, $post->post_title, $raw_json);
    }

    /**
     * Tar emot JSON-strängen från React, rensar gamla tillfällen och sparar de nya.
     */
    private function sync_occurrences($post_id, $post_title, $raw_json)
    {
        // Tolka JSON-strängen till en PHP-array
        $json_data = json_decode($raw_json, true);

        // Säkerställ att vi faktiskt fick en giltig array från React
        if (!is_array($json_data)) {
            return;
        }

        // 1. Rensa alla gamla tillfällen kopplade till detta event för att göra en ren "delta-synk"
        $existing = pods('event_occurrence', [
            'where' => 'event_id.id = ' . (int)$post_id,
            'limit' => -1
        ]);

        if ($existing && $existing->total() > 0) {
            while ($existing->fetch()) {
                wp_delete_post($existing->id(), true); // 'true' tvingar borttagning helt (skippar papperskorgen)
            }
        }

        // 2. Loopa igenom de genererade tillfällena från React och spara dem
        foreach ($json_data as $item) {
            if (empty($item['date']) || empty($item['start_time']) || empty($item['end_time'])) {
                continue; // Hoppa över trasig data
            }

            // Sanera nätverksdatan noggrant per fält innan lagring i databasen
            $safe_date       = sanitize_text_field($item['date']);
            $safe_start_time = sanitize_text_field($item['start_time']);
            $safe_end_time   = sanitize_text_field($item['end_time']);
            $location_id     = !empty($item['location']) ? (int)$item['location'] : null;

            // Bygg ihop datum och tid till MySQL-vänliga datetime-strängar (YYYY-MM-DD HH:MM:SS)
            $start_datetime = $safe_date . ' ' . $safe_start_time . ':00';
            $end_datetime   = $safe_date . ' ' . $safe_end_time . ':00';

            // Skapa grundposten för tillfället
            $occurrence_data = [
                'post_title'   => sanitize_text_field($post_title) . ' - ' . $safe_date . ' (' . $safe_start_time . ')',
                'post_type'    => 'event_occurrence',
                'post_status'  => 'publish',
            ];

            $new_occurrence_id = wp_insert_post($occurrence_data);

            // Om posten skapades utan fel, använd Pods API för att spara relationer och metadata
            if (!is_wp_error($new_occurrence_id) && $new_occurrence_id > 0) {
                $pod = pods('event_occurrence', $new_occurrence_id);

                $pod->save([
                    'event_id'       => (int)$post_id,
                    'start_datetime' => $start_datetime,
                    'end_datetime'   => $end_datetime,
                    'location'       => $location_id
                ]);
            }
        }
    }
}
