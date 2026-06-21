import { createRoot } from '@wordpress/element';
import AdminApp from './admin/settings/page';
import EventEditorPage from './admin/event/page';

console.log('Biugu Core JS loaded');

const checkElements = () => {
    const adminRoot = document.getElementById('biugu-admin-root');
    const eventRoot = document.getElementById('biu-event-editor-root');

    // Hämta platser från det globala objektet vi skickade med PHP
    const places = window.biuguEventData?.places || [];

    if (adminRoot) {
        createRoot(adminRoot).render(<AdminApp />);
    }

    if (eventRoot) {
        createRoot(eventRoot).render(<EventEditorPage />);
    }
};

window.addEventListener('load', checkElements);