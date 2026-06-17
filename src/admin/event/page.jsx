import { useState } from '@wordpress/element';
import Occurrence from './Occurrence';

export default function EventEditorPage() {
    // Denna data skickas med från WP via wp_localize_script
    const placesFromServer = window.biuCalendarSetup?.places || [];
    const initialOccurrences = window.biuCalendarSetup?.occurrences || [];

    const [allOccurrences, setAllOccurrences] = useState(initialOccurrences);

    return (
        <div className="biu-event-editor-container">
            {/* EventForm.jsx laddas här... */}

            <div className="biu-editor-card">
                <h3>Datum, Tid & Platser</h3>
                <Occurrence 
                    initialOccurrences={allOccurrences} 
                    places={placesFromServer} 
                    onOccurrencesChange={setAllOccurrences} 
                />
            </div>

            {/* Detta dolda fält läses direkt av class-delta-sync.php när Posten sparas */}
            <input 
                type="hidden" 
                name="biu_occurrences_transport" 
                value={JSON.stringify(allOccurrences)} 
            />
        </div>
    );
}