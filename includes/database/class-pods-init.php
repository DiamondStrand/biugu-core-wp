<?php

namespace Biugu_Core\Database;

class Pods_Init
{
    public function __construct()
    {
        // Kör automatisk synk vid admin_init om CPT:n 'event' helt saknas
        add_action('admin_init', [$this, 'sync_schema_if_needed']);
    }

    /**
     * Kollar om bas-CPT:n finns, annars triggas en tyst synk i bakgrunden.
     */
    public function sync_schema_if_needed()
    {
        if (!is_plugin_active('pods/pods.php')) return;

        if (!get_post_type_object('event')) {
            $this->import_pods_schema();
        }
    }

    /**
     * Läser in pods-schema.json och rullar ut hela databasstrukturen.
     * Denna metod anropas direkt av ditt nya React-styrda REST API.
     */
    public function import_pods_schema()
    {
        // Hittar filen i /includes/sync/pods-schema.json
        $schema_path = dirname(plugin_dir_path(__FILE__)) . '/sync/pods-schema.json';

        if (!file_exists($schema_path)) {
            error_log('BIUGU Error: pods-schema.json kunde inte hittas på sökväg: ' . $schema_path);
            return false;
        }

        $json = file_get_contents($schema_path);
        $data = json_decode($json, true);

        // Säkerställ att JSON-filen är intakt och kunde avkodas
        if (!$data || empty($data['pods'])) {
            error_log('BIUGU Error: pods-schema.json är tom eller har felaktigt format.');
            return false;
        }

        // Hämta Pods API-instans
        $pods_api = pods_api();

        try {
            /**
             * import_package() är magin här. 
             * Den analyserar hela din JSON och skapar/uppdaterar:
             * - Alla Custom Post Types (Event, Platser, Arrangörer osv.)
             * - Alla Custom Taxonomies (Åldersgrupper, Områden)
             * - Alla Fältgrupper och tillhörande anpassade fält
             * - Alla inställningar och relationer (Pick-fields)
             */
            $pods_api->import_package($data);

            error_log('BIUGU Success: Databasen har synkroniserats med pods-schema.json.');
            return true;
        } catch (\Exception $e) {
            error_log('BIUGU Error: Misslyckades att importera Pods-schema: ' . $e->getMessage());
            return false;
        }
    }
}
