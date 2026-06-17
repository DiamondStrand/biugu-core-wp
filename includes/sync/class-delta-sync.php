<?php

namespace Biugu_Core\Sync;

class Delta_Sync
{
    public function __construct()
    {
        // Lyssnar specifikt på när vår 'event' CPT sparas eller skapas
        add_action('save_post_event', [$this, 'handle_event_sync'], 10, 3);
    }

    public function handle_event_sync($post_id, $post, $update)
    {
        // 1. BAIL EARLY: Kör inte vid autosparning
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // 2. BAIL EARLY: Kör inte om det är en revision, papperskorg eller ett tomt utkast (auto-draft)
        if (wp_is_post_revision($post_id) || !$post || $post->post_status === 'auto-draft' || $post->post_status === 'trash') {
            return;
        }

        // Rad 20: Tridda synkningen av tillfällen (skickar med ID, titel och en tom array för data)
        $this->sync_occurrences($post_id, $post->post_title, []);
    }

    /**
     * Synkar tillfällen för ett event.
     * Här antar vi att du har fält i din 'event' pod som heter 'start_date' och 'end_date'
     */
    private function sync_occurrences($post_id, $post_title)
    {
        $event = pods('event', $post_id);

        // 1. Hämta inställningar från ditt event
        $start_date = $event->field('start_date');
        $end_date   = $event->field('end_date');

        if (empty($start_date)) return; // Kan inte skapa tillfällen utan datum

        // 2. Rensa befintliga tillfällen för detta event (Starten på en "ren" synk)
        $existing = pods('event_occurrence', [
            'where' => 'event.id = ' . (int)$post_id,
            'limit' => -1
        ]);

        while ($existing->fetch()) {
            wp_delete_post($existing->id(), true); // 'true' tvingar borttagning från papperskorgen
        }

        // 3. Skapa nya tillfällen (Här kan du bygga in logik för veckovis/daglig)
        // För exemplet skapar vi ett tillfälle för startdatumet
        $occurrence_data = [
            'post_title'   => $post_title . ' - Tillfälle',
            'post_type'    => 'event_occurrence',
            'post_status'  => 'publish',
        ];

        $new_occurrence = wp_insert_post($occurrence_data);

        if (!is_wp_error($new_occurrence)) {
            // Koppla tillfället till huvud-eventet via Pods
            $pod = pods('event_occurrence', $new_occurrence);
            $pod->save('event', $post_id);
            $pod->save('occurrence_date', $start_date);
        }
    }
}
