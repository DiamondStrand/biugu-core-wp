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

        // NYTT: Köa scriptet specifikt för denna klass
        add_action('admin_enqueue_scripts', [$this, 'enqueue_event_scripts']);
    }

    public function enqueue_event_scripts($hook)
    {
        // Hämta det aktuella skärmobjektet från WordPress
        $screen = get_current_screen();

        // Garanterar att skriptet laddas på BÅDE post.php (redigera) och post-new.php (skapa nytt)
        if ($screen && $screen->post_type === 'event') {

            // Genererar en helt ren absolut URL till din build-mapp baserad på pluginets rotfil
            $js_url = plugins_url('build/index.js', dirname(dirname(dirname(__DIR__))) . '/biugu-core.php');

            wp_enqueue_script(
                'biugu-admin-js',
                $js_url,
                ['wp-element', 'wp-api-fetch', 'wp-components'],
                '1.0.0',
                true
            );

            // 1. Skapa arrayen
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

            // 2. VIKTIGT: Skicka datan till JavaScript
            wp_localize_script('biugu-admin-js', 'biuguEventData', [
                'places' => $places
            ]);
        }
    }

    public function inject_react_container()
    {
        global $post;
        if ($post && $post->post_type === 'event') {
            echo '<script>
                document.addEventListener("DOMContentLoaded", function() {
                    let box = document.getElementById("pods-meta-plats-och-tid");
                    if (box) {
                        var inside = box.querySelector(".inside");
                        if (inside && !document.getElementById("biu-event-editor-root")) {
                            var root = document.createElement("div");
                            root.id = "biu-event-editor-root";
                            // Lägg till längst upp i .inside
                            inside.insertBefore(root, inside.firstChild);
                        }
                    }
                });
            </script>';
        }
    }
}
