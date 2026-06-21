<?php

namespace Biugu_Core\Admin;

if (! defined('ABSPATH')) {
    exit; // Avbryt om filen anropas direkt utanför WordPress
}

class Event_Meta_Box
{
    public function __construct()
    {
        // Vi injicerar via admin_footer
        add_action('admin_footer', [$this, 'inject_react_container']);

        // Köa scriptet specifikt för denna klass
        add_action('admin_enqueue_scripts', [$this, 'enqueue_event_scripts']);

        // NYTT: Ta bort WordPress standard-rutor för taxonomier globalt för alla
        add_action('add_meta_boxes', [$this, 'remove_default_taxonomy_meta_boxes'], 999);
    }

    /**
     * Raderar WordPress standard-vyer för dina tre taxonomier från sidofältet
     */
    public function remove_default_taxonomy_meta_boxes()
    {
        // remove_meta_box( $id, $post_type, $context )
        remove_meta_box('event_categorydiv', 'event', 'side');
        remove_meta_box('tagsdiv-event_tag', 'event', 'side');
        remove_meta_box('tagsdiv-age_group', 'event', 'side');
    }

    public function enqueue_event_scripts($hook)
    {
        // Hämta det aktuella skärmobjektet från WordPress
        $screen = get_current_screen();

        // Garanterar att skriptet laddas på BÅDE post.php (redigera) och post-new.php (skapa nytt)
        if ($screen && $screen->post_type === 'event') {
            global $post;
            $post_id = isset($post->ID) ? $post->ID : 0;

            // Genererar en helt ren absolut URL till din build-mapp baserad på pluginets rotfil
            $js_url = plugins_url('build/index.js', dirname(dirname(dirname(__DIR__))) . '/biugu-core.php');

            wp_enqueue_script(
                'biugu-admin-js',
                $js_url,
                ['wp-element', 'wp-api-fetch', 'wp-components'],
                '1.0.0',
                true
            );

            $css_url = plugins_url('build/index.css', dirname(dirname(dirname(__DIR__))) . '/biugu-core.php');
            wp_enqueue_style(
                'biugu-admin-css',
                $css_url,
                [],
                '1.0.0'
            );

            // 1. Skapa arrayen för platser
            $places = [];
            if (function_exists('pods')) {
                $mypods = pods('place', ['limit' => -1]);

                while ($mypods->fetch()) {
                    $terms = $mypods->field('area'); // Hämtar arrayen från loggen

                    // Vi plockar ut namnet från första termen i arrayen
                    $area_name = 'Inget område';
                    if (is_array($terms) && !empty($terms)) {
                        // Om det är en array av objekt, ta första objektet
                        $first_term = reset($terms);
                        if (is_array($first_term) && isset($first_term['name'])) {
                            $area_name = $first_term['name'];
                        } elseif (is_object($first_term) && isset($first_term->name)) {
                            $area_name = $first_term->name;
                        }
                    }

                    $places[] = [
                        'id'    => $mypods->field('id'),
                        'title' => $mypods->field('post_title'),
                        'area'  => $area_name,
                        'name'  => $mypods->field('post_title'),
                        'street' => $mypods->field('street') ?: 'Ingen adress',
                        'postal_code' => $mypods->field('zip_code') ?: 'Ingen postkod',
                        'city' => $mypods->field('city') ?: 'Ingen stad',
                    ];
                }
            }

            // 2. UTÖKNING: Hämta sparade tillfällen för detta event (så de laddas vid redigering)
            $occurrences = [];
            if ($post_id && function_exists('pods')) {
                $occ_pods = pods('event_occurrence', [
                    'where' => 'event_id.id = ' . (int)$post_id,
                    'limit' => -1
                ]);

                if ($occ_pods && $occ_pods->total() > 0) {
                    while ($occ_pods->fetch()) {
                        $start_dt = $occ_pods->field('start_datetime');
                        $end_dt   = $occ_pods->field('end_datetime');

                        $date  = '';
                        $start = '';
                        $end   = '';

                        if ($start_dt) {
                            $parts = explode(' ', $start_dt);
                            $date  = $parts[0];
                            $start = isset($parts[1]) ? substr($parts[1], 0, 5) : '';
                        }
                        if ($end_dt) {
                            $parts = explode(' ', $end_dt);
                            $end   = isset($parts[1]) ? substr($parts[1], 0, 5) : '';
                        }

                        $loc = $occ_pods->field('location');
                        $loc_id = '';
                        if (is_array($loc) && isset($loc['id'])) {
                            $loc_id = $loc['id'];
                        } elseif (is_object($loc) && isset($loc->id)) {
                            $loc_id = $loc->id;
                        } elseif (is_numeric($loc)) {
                            $loc_id = $loc;
                        }

                        $occurrences[] = [
                            'id'         => $occ_pods->field('id'),
                            'date'       => $date,
                            'start_time' => $start,
                            'end_time'   => $end,
                            'location'   => $loc_id
                        ];
                    }
                }
            }

            // 3. UTÖKNING: Hämta alla tillgängliga globala taxonomitermer från WP
            $age_groups_terms = get_terms(['taxonomy' => 'age_group', 'hide_empty' => false]);
            $categories_terms = get_terms(['taxonomy' => 'event_category', 'hide_empty' => false]);
            $tags_terms       = get_terms(['taxonomy' => 'event_tag', 'hide_empty' => false]);

            $all_age_groups = [];
            foreach ($age_groups_terms as $term) {
                if (! is_wp_error($term)) {
                    $all_age_groups[] = ['id' => $term->term_id, 'name' => $term->name];
                }
            }

            $all_categories = ! is_wp_error($categories_terms) ? wp_list_pluck($categories_terms, 'name') : [];
            $all_tags       = ! is_wp_error($tags_terms) ? wp_list_pluck($tags_terms, 'name') : [];

            // 4. UTÖKNING: Hämta nuvarande sparade relationer för detta specifika event
            $current_age_groups = $post_id ? wp_get_object_terms($post_id, 'age_group', ['fields' => 'ids']) : [];
            $current_categories = $post_id ? wp_get_object_terms($post_id, 'event_category', ['fields' => 'names']) : [];
            $current_tags       = $post_id ? wp_get_object_terms($post_id, 'event_tag', ['fields' => 'names']) : [];

            // 5. VIKTIGT: Skicka all samlad data till JavaScript
            wp_localize_script('biugu-admin-js', 'biuguEventData', [
                'places'      => $places,
                'occurrences' => $occurrences,
                'taxonomies'  => [
                    'all_age_groups' => $all_age_groups,
                    'all_categories' => $all_categories,
                    'all_tags'       => $all_tags,
                    'current'        => [
                        'age_groups' => is_wp_error($current_age_groups) ? [] : array_map('intval', $current_age_groups),
                        'categories' => is_wp_error($current_categories) ? [] : $current_categories,
                        'tags'       => is_wp_error($current_tags) ? [] : $current_tags,
                    ]
                ]
            ]);
        }
    }

    public function inject_react_container()
    {
        global $post;
        if ($post && $post->post_type === 'event') {
            echo '<script>
                document.addEventListener("DOMContentLoaded", function() {
                    // 1. Injektera root för Plats och tid (Huvudspalten)
                    let occurrenceBox = document.getElementById("pods-meta-plats-och-tid");
                    if (occurrenceBox) {
                        var inside = occurrenceBox.querySelector(".inside");
                        if (inside && !document.getElementById("biugu-event-editor-root")) {
                            var root = document.createElement("div");
                            root.id = "biugu-event-editor-root";
                            inside.insertBefore(root, inside.firstChild);
                        }
                    }

                    // 2. KORRIGERING: Injektera root för Taxonomier (Sidofältet)
                    let taxonomyBox = document.getElementById("pods-meta-taxonomies");
                    if (taxonomyBox) {
                        var inside = taxonomyBox.querySelector(".inside");
                        if (inside && !document.getElementById("biugu-event-taxonomies-target")) {
                            var target = document.createElement("div");
                            target.id = "biugu-event-taxonomies-target";
                            inside.insertBefore(target, inside.firstChild);
                        }
                    }
                });
            </script>';
        }
    }
}
