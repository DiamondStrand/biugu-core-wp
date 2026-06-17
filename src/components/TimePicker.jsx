import { useState, useEffect, useRef } from '@wordpress/element';
import '../../assets/styles/components/timepicker.css';

export default function TimePickerField({ label, value, onChange, interval = 15, startHour = 6, endHour = 23 }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const parseValue = (val) => {
        if (!val) return { hour: startHour, min: 0 };
        const [h, m] = val.split(':').map(Number);
        return { hour: h, min: m };
    };

    const { hour: selHour, min: selMin } = parseValue(value);

    const selectHour = (h) => {
        const m = selMin.toString().padStart(2, '0');
        const hStr = h.toString().padStart(2, '0');
        onChange(`${hStr}:${m}`);
    };

    const selectMin = (m) => {
        const h = selHour.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        onChange(`${h}:${mStr}`);
    };

    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const minutes = Array.from({ length: 60 / interval }, (_, i) => i * interval);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div ref={ref} className="biugu-tp-wrap">
            {label && <div className="biugu-tp-label">{label}</div>}

            <button className="biugu-tp-field" onClick={() => setOpen(!open)} type="button">
                <span className="biugu-tp-field-value">{value || '--:--'}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            </button>

            {open && (
                <div className="biugu-tp-popover">
                    <div className="biugu-tp-hours-scroll">
                        {hours.map((h) => (
                            <button
                                key={h}
                                type="button"
                                className={`biugu-tp-hour-btn ${h === selHour ? 'is-active' : ''}`}
                                onClick={() => selectHour(h)}
                            >
                                {h.toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>

                    <div className="biugu-tp-minutes-wrap">
                        <div className="biugu-tp-minutes-label">Minuter</div>
                        <div className="biugu-tp-minute-grid">
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    className={`biugu-tp-min-btn ${m === selMin ? 'is-active' : ''}`}
                                    onClick={() => selectMin(m)}
                                >
                                    {m.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="biugu-tp-footer">
                        <button type="button" className="biugu-tp-confirm-btn" onClick={() => setOpen(false)}>
                            Välj {value}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}