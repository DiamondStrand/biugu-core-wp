<?php

namespace Biugu_Core\Sync;

class Delta_Sync
{
    public function __construct()
    {
        // Lyssnar specifikt på när en 'event' CPT sparas eller skapas i WP Admin
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

        // 3. BAIL EARLY: Om det inte finns någon data medskickad från React-appen, avbryt
        if (!isset($_POST['biu_occurrences_transport'])) {
            return;
        }

        // Trigga synkningen med den faktiska datan från formuläret
        $this->sync_occurrences($post_id, $post->post_title, $_POST['biu_occurrences_transport']);
    }

    /**
     * Tar emot JSON-strängen från React, rensar gamla tillfällen och sparar de nya.
     */
    private function sync_occurrences($post_id, $post_title, $raw_json)
    {
        // WordPress kör stripslashes på $_POST automatiskt, så vi måste städa strängen innan json_decode
        $json_data = json_decode(stripslashes($raw_json), true);

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

            // Bygg ihop datum och tid till MySQL-vänliga datetime-strängar (YYYY-MM-DD HH:MM:SS)
            $start_datetime = $item['date'] . ' ' . $item['start_time'] . ':00';
            $end_datetime   = $item['date'] . ' ' . $item['end_time'] . ':00';
            $location_id    = !empty($item['location']) ? (int)$item['location'] : null;

            // Skapa grundposten för tillfället
            $occurrence_data = [
                'post_title'   => $post_title . ' - ' . $item['date'] . ' (' . $item['start_time'] . ')',
                'post_type'    => 'event_occurrence',
                'post_status'  => 'publish',
            ];

            $new_occurrence_id = wp_insert_post($occurrence_data);

            // Om posten skapades utan fel, använd Pods API för att spara relationer och metadata
            if (!is_wp_error($new_occurrence_id) && $new_occurrence_id > 0) {
                $pod = pods('event_occurrence', $new_occurrence_id);

                $pod->save([
                    'event_id'       => $post_id,
                    'start_datetime' => $start_datetime,
                    'end_datetime'   => $end_datetime,
                    'location'       => $location_id
                ]);
            }
        }
    }
}
