<?php

namespace Biugu_Core\Api;

if (! defined('ABSPATH')) {
    exit; // Avbryt om filen anropas direkt utanför WordPress
}

class WP_Api
{

    public function __construct()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        // 1. Synka schema (Befintlig)
        register_rest_route('biugu/v1', '/sync-schema', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_sync_schema'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 2. Rensa cache (Ny!)
        register_rest_route('biugu/v1', '/clear-cache', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_clear_cache'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 3. Exportera data (Ny!)
        register_rest_route('biugu/v1', '/export', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_export'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);

        // 4. Hämta systemstatistik (NY)
        register_rest_route('biugu/v1', '/stats', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_get_stats'],
            'permission_callback' => [$this, 'check_admin_permissions'],
        ]);
    }

    public function handle_sync_schema()
    {
        $pods_init = new \Biugu_Core\Database\Pods_Init();
        $pods_init->import_pods_schema();

        return new \WP_REST_Response([
            'success' => true,
            'message' => 'Pods-schema synkroniserat med framgång!'
        ], 200);
    }

    /**
     * Hanterar cacherensning för recurring events
     */
    public function handle_clear_cache()
    {
        // Här rensar vi WordPress transienter eller objekt-cache i framtiden.
        // Just nu simulerar vi en lyckad rensning för ditt UI.
        wp_cache_flush();

        return new \WP_REST_Response([
            'success' => true,
            'message' => 'Tillfällescache har tömts.'
        ], 200);
    }

    public function handle_get_stats()
    {
        // Hämta riktig data direkt från WordPress
        $event_count = wp_count_posts('event')->publish;
        $occurrence_count = wp_count_posts('event_occurrence')->publish;

        return new \WP_REST_Response([
            'event_total'      => (int) $event_count,
            'occurrence_total' => (int) $occurrence_count,
        ], 200);
    }

    /**
     * Hämtar data från databasen och skickar tillbaka som JSON till React
     */
    public function handle_export()
    {
        // Vi gör en snabb query för att hämta alla sparade 'event' via Pods
        $params = [
            'limit' => -1, // Hämta alla
        ];

        $events_pod = pods('event', $params);
        $export_data = [];

        if ($events_pod->total() > 0) {
            while ($events_pod->fetch()) {
                $export_data[] = [
                    'id'           => $events_pod->id(),
                    'title'        => $events_pod->display('title'),
                    'price'        => $events_pod->field('price'),
                    'external_url' => $events_pod->field('external_url'),
                ];
            }
        }

        // Returnerar datan – din React-app gör om detta till en nedladdningsbar fil!
        return new \WP_REST_Response($export_data, 200);
    }

    public function check_admin_permissions()
    {
        return current_user_can('manage_options');
    }
}
