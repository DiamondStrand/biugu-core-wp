<?php

namespace Biugu_Core;

require_once plugin_dir_path(__FILE__) . 'database/class-pods-init.php';
require_once plugin_dir_path(__FILE__) . 'sync/class-delta-sync.php';
require_once plugin_dir_path(__FILE__) . 'api/class-wp-api.php';

// Detta är för UI-klassen, som hanterar admin-menyn och React-gränssnittet
require_once plugin_dir_path(__FILE__) . '../src/admin/settings/class-admin-menu.php';
require_once plugin_dir_path(__FILE__) . '../src/admin/event/class-event-meta-box.php';

class App
{
    // HÄR: Se till att 'private $pods_init;' är helt borttagen härifrån!
    private static $instance = null;

    public static function get_instance()
    {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->load_dependencies();
        $this->init_hooks();
    }

    private function load_dependencies()
    {
        // Vi bara kickar igång klassen direkt utan att spara den i en variabel.
        // Detta gör att Pods_Init körs, men utan att lämna oanvända spår efter sig.
        new \Biugu_Core\Database\Pods_Init();
        new \Biugu_Core\Sync\Delta_Sync();
        new \Biugu_Core\Api\WP_Api();

        // Starta admin-menyn och React-gränssnittet
        new \Biugu_Core\Admin\Admin_Menu();
        new \Biugu_Core\Admin\Event_Meta_Box();
    }

    private function init_hooks()
    {
        add_action('init', [$this, 'init']);
    }

    public function init()
    {
        // Framtida initialisering för API eller annat
    }
}
