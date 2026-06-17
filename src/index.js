import { createRoot } from '@wordpress/element';
import AdminApp from './admin/settings/page';
import OccurrenceApp from './admin/event/Occurrence';

const checkElements = () => {
    const adminRoot = document.getElementById('biugu-admin-root');
    const eventRoot = document.getElementById('biu-event-editor-root');

    // Hämta platser från det globala objektet vi skickade med PHP
    const places = window.biuguEventData?.places || [];

    if (adminRoot) {
        createRoot(adminRoot).render(<AdminApp />);
    }

    if (eventRoot) {
        createRoot(eventRoot).render(
            <OccurrenceApp 
                initialOccurrences={[]} 
                places={places} // Använd variabeln vi hämtade ovan!
                onOccurrencesChange={(data) => {
                    const input = document.getElementById('biu-occurrences-transport-field');
                    if (input) {
                        input.value = JSON.stringify(data);
                    }
                }} 
            />
        );
    }
};

window.addEventListener('load', checkElements);