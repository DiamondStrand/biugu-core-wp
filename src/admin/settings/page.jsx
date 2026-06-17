import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const StatCard = ({ label, value, status = 'default' }) => (
    <div className={`biugu-stat-card ${status}`}>
        <div className="biugu-stat-label">{label}</div>
        <div className="biugu-stat-value">{value}</div>
    </div>
);

const Badge = ({ status, label }) => (
    <span className={`biugu-badge biugu-badge-${status}`}>
        {label}
    </span>
);

const ActionRow = ({ name, description, children, last = false }) => (
    <div className={`biugu-action-row ${last ? 'last' : ''}`}>
        <div className="biugu-action-info">
            <div className="biugu-action-name">{name}</div>
            <div className="biugu-action-desc">{description}</div>
        </div>
        <div className="biugu-action-actions">{children}</div>
    </div>
);

const Toast = ({ message, type }) => {
    if (!message) return null;
    return <div className={`biugu-toast biugu-toast-${type}`}>{message}</div>;
};

const LogEntry = ({ entry }) => (
    <div className="biugu-log-entry">
        <span className="biugu-log-time">{entry.time}</span>
        <span className="biugu-log-msg">{entry.msg}</span>
    </div>
);

export default function AdminApp() {
    const [stats, setStats] = useState({ event_total: 0, occurrence_total: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [log, setLog] = useState([]);

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString('sv-SE');
        setLog((prev) => [{ time, msg }, ...prev.slice(0, 19)]);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
    };

    const fetchStats = async () => {
        try {
            const data = await apiFetch({ path: '/biugu/v1/stats' });
            setStats(data);
        } catch (error) {
            addLog('Kunde inte hämta statistik.');
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        addLog('Startar schema-synk…');
        try {
            await apiFetch({ path: '/biugu/v1/sync-schema', method: 'POST' });
            showToast('Pods-schema uppdaterat');
            addLog('Schema synkat utan fel.');
            fetchStats();
        } catch (error) {
            addLog(`Fel: ${error?.message || 'okänt fel'}`);
            showToast('Fel vid synk', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleClearCache = async () => {
        setClearing(true);
        addLog('Rensar tillfällescache…');
        try {
            await apiFetch({ path: '/biugu/v1/clear-cache', method: 'POST' });
            showToast('Cache rensad');
            addLog('Cache rensad.');
        } catch (error) {
            addLog(`Fel: ${error?.message || 'okänt fel'}`);
            showToast('Fel vid cacherensning', 'error');
        } finally {
            setClearing(false);
        }
    };

    const handleExport = async () => {
        addLog('Exporterar event-data…');
        try {
            const data = await apiFetch({ path: '/biugu/v1/export', method: 'GET' });
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'biugu-export.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('Export laddas ned');
            addLog('Export klar.');
        } catch (error) {
            addLog(`Fel: ${error?.message || 'okänt fel'}`);
            showToast('Fel vid export', 'error');
        }
    };

    return (
        <div className="biugu-wrap">
            <Toast message={toast.message} type={toast.type} />

            <div className="biugu-grid">
                <StatCard label="Pods-schema" value="Synkat" status="ok" />
                <StatCard label="Event (totalt)" value={loadingStats ? '...' : stats.event_total} />
                <StatCard label="Tillfällen (totalt)" value={loadingStats ? '...' : stats.occurrence_total} />
            </div>

            <div className="biugu-card">
                <div className="card-title">Schema & data</div>

                <ActionRow name="Synka Pods-schema" description="Uppdaterar struktur mot databasen">
                    <button className="biugu-btn-primary" onClick={handleSync} disabled={syncing}>
                        {syncing ? 'Synkroniserar…' : 'Synka'}
                    </button>
                </ActionRow>

                <ActionRow name="Rensa tillfällescache" description="Tvingar omgenerering av recurring events">
                    <button className="biugu-btn" onClick={handleClearCache} disabled={clearing}>
                        {clearing ? 'Rensar…' : 'Rensa'}
                    </button>
                </ActionRow>

                <ActionRow name="Exportera event-data" description="Ladda ned som JSON" last>
                    <button className="biugu-btn" onClick={handleExport}>
                        Exportera
                    </button>
                </ActionRow>

                {log.length > 0 && (
                    <div className="biugu-log-container">
                        {log.map((entry, i) => (
                            <LogEntry key={i} entry={entry} />
                        ))}
                    </div>
                )}
            </div>

            <div className="biugu-card">
                <div className="biugu-card-title">Systemstatus</div>
                <ActionRow name="Pods" description="Plugin aktivt"><Badge status="ok" label="Aktivt" /></ActionRow>
                <ActionRow name="REST API" description="/biugu/v1"><Badge status="ok" label="Tillgängligt" /></ActionRow>
                <ActionRow name="Classic editor" description="Gutenberg inaktiverat"><Badge status="ok" label="Aktivt" /></ActionRow>
                <ActionRow name="WP_DEBUG" description="Debug-läge på" last><Badge status="warn" label="På" /></ActionRow>
            </div>
        </div>
    );
}