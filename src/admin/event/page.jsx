import { useState, useEffect, createPortal } from '@wordpress/element';
import Occurrence from './Occurrence';
import TaxonomyManager from './TaxonomyManager';

export default function EventEditorPage() {
    const placesFromServer = window.biuguEventData?.places || [];
    const initialOccurrences = window.biuguEventData?.occurrences || [];

    const savedTaxonomies = window.biuguEventData?.taxonomies?.current || {
        age_groups: [],
        categories: [],
        tags: []
    };

    const [allOccurrences, setAllOccurrences] = useState(initialOccurrences);
    const [taxonomies, setTaxonomies] = useState(savedTaxonomies);
    const [taxonomyTarget, setTaxonomyTarget] = useState(null);

    useEffect(() => {
        // 1. Hitta portalmålet i sidofältet
        const target = document.getElementById('biugu-event-taxonomies-target');
        if (target) {
            setTaxonomyTarget(target);
        }

        // 2. Döljer Pods platshållar-tabeller
        const hidePodsPlaceholders = () => {
            const boxes = ['pods-meta-plats-och-tid', 'pods-meta-taxonomies'];
            
            boxes.forEach(boxId => {
                const box = document.getElementById(boxId);
                if (!box) return;

                // Hitta tabellen som Pods genererade för "Laddar..." fält
                const podsTable = box.querySelector('table.pods-metabox');
                if (podsTable) {
                    podsTable.style.display = 'none'; // Gömmer tabellen helt
                }
            });
        };

        // Körs direkt, samt efter en kort timeout för att parera WordPress initiering
        hidePodsPlaceholders();
        setTimeout(hidePodsPlaceholders, 60);
    }, []);

    return (
        <div className="biugu-event-editor-container">

            {/* Huvudboxen: Plats och tid */}
            <div className="biugu-editor-card">
                <h3>Datum, Tid & Platser</h3>
                <Occurrence 
                    initialOccurrences={allOccurrences} 
                    places={placesFromServer} 
                    onOccurrencesChange={setAllOccurrences} 
                />
            </div>
            <input 
                type="hidden" 
                id="biugu-occurrences-transport-field"
                name="biugu_occurrences_transport" 
                value={JSON.stringify(allOccurrences)} 
            />

            {/* Portal till sidorutan: Taxonomies */}
            {taxonomyTarget && createPortal(
                <div className="biugu-sidebar-portal-wrapper">
                    <TaxonomyManager 
                        value={taxonomies}
                        onChange={setTaxonomies} 
                    />
                    <input 
                        type="hidden" 
                        id="biugu-taxonomies-transport-field"
                        name="biugu_taxonomies_transport" 
                        value={JSON.stringify(taxonomies)} 
                    />
                </div>,
                taxonomyTarget
            )}
        </div>
    );
}