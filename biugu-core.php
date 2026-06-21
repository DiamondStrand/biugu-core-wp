<?php

/**
 * Plugin Name:       BIUGU Core Engine
 * Description:       Hanterar databasstruktur, delta-synk och React-gränssnitt för BIUGU.
 * Version:           1.0.0
 * Author:            Diamond Strand
 * Text Domain:       biugu-core
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit;
}

// Ladda in huvudklassen
require_once plugin_dir_path(__FILE__) . 'includes/app.php';

// Starta motorn
add_action('plugins_loaded', ['Biugu_Core\App', 'get_instance']);
