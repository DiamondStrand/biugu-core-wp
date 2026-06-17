<?php

/**
 * Plugin Name:       BIUGU Core Engine
 * Description:       Hanterar databasstruktur, delta-synk och React-gränssnitt för BIUGU.
 * Version:           1.0.0
 * Author:            Diamond Strand
 * Text Domain:       biugu-core
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ladda in huvudklassen
require_once plugin_dir_path(__FILE__) . 'includes/app.php';

// Starta motorn
add_action('plugins_loaded', ['Biugu_Core\App', 'get_instance']);
