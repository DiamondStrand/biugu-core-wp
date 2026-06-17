<?php

namespace Biugu_Core\Admin;

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
    public function enqueue_admin_scripts($hook)
    {
        // Kontrollera att vi bara laddar scriptet på vår sida
        if ($hook !== 'toplevel_page_biugu-settings') {
            return;
        }

        wp_enqueue_style(
            'biugu-admin-css',
            get_stylesheet_directory_uri() . '/styles/admin.css',
            [],
            '1.0.0'
        );

        // Här pekar vi på filen som wp-scripts genererar i build-mappen
        wp_enqueue_script(
            'biugu-admin-js',
            plugins_url('../../build/index.js', dirname(__DIR__) . '/biugu-core.php'),
            ['wp-element', 'wp-api-fetch'],
            '1.0.0',
            true
        );
    }
}
