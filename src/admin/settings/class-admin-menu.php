<?php

namespace Biugu_Core\Admin;

if (! defined('ABSPATH')) {
    exit; // Avbryt om filen anropas direkt utanför WordPress
}

class Admin_Menu
{

    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_menu_page']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
    }

    /**
     * Registrerar menysidan i WordPress admin
     */
    public function add_menu_page()
    {
        add_menu_page(
            'BIUGU System',      // Sidans titel
            'BIUGU',             // Meny-titel
            'manage_options',    // Capability
            'biugu-settings',    // Slug
            [$this, 'render_page'], // Callback
            'dashicons-calendar-alt', // Ikon
            58                   // Position
        );
    }

    /**
     * Renderar den tomma diven som React tar över
     */
    public function render_page()
    {
        echo '<div class="wrap">';
        echo '<h1>BIUGU System</h1>';
        echo '<div id="biugu-admin-root">Laddar BIUGU Admin...</div>';
        echo '</div>';
    }

    /**
     * Köar upp React-scriptet (build-filen från wp-scripts)
     */
    /**
     * Köar upp React-scriptet och tillhörande CSS (build-filerna från wp-scripts)
     */
    public function enqueue_admin_scripts(string $hook)
    {
        // Kontrollera att vi bara laddar scriptet på vår inställningssida
        if ($hook !== 'toplevel_page_biugu-settings') {
            return;
        }

        // Definiera sökvägen till pluginets rotfil på ett säkert sätt
        $plugin_root_file = dirname(dirname(dirname(__DIR__))) . '/biugu-core.php';

        // Skapa rena, absoluta URL:er till din build-mapp
        $js_url  = plugins_url('build/index.js', $plugin_root_file);
        $css_url = plugins_url('build/index.css', $plugin_root_file);

        // Hämta den automatiskt genererade tillgångsfilen om den finns
        $asset_file = dirname(dirname(dirname(__DIR__))) . '/build/index.asset.php';
        $assets     = file_exists($asset_file)
            ? require $asset_file
            : ['dependencies' => ['wp-element', 'wp-api-fetch'], 'version' => '1.0.0'];

        // Köa upp JavaScript
        wp_enqueue_script(
            'biugu-admin-js',
            $js_url,
            $assets['dependencies'],
            $assets['version'],
            true
        );

        // Köa upp den sammanställda CSS-filen
        wp_enqueue_style(
            'biugu-admin-css',
            $css_url,
            [],
            $assets['version']
        );
    }
}
