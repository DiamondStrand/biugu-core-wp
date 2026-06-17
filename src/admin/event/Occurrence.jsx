import { useState, useEffect } from '@wordpress/element';
import { 
    SelectControl, 
    TextControl, 
    Button, 
    DateTimePicker,
    DatePicker,
    TimePicker,
    PanelRow, 
    Notice 
} from '@wordpress/components';

import TimePickerField from '../../components/TimePicker';

import './occerrence.css';

export default function Occurrence({ 
    initialOccurrences = [], 
    places = [], 
    onOccurrencesChange = () => {} // Default tom funktion
}) {
    // State för listan med tillfällen
    const [occurrences, setOccurrences] = useState(initialOccurrences);
    
    // Form States
    const [repeatMode, setRepeatSelect] = useState('en_gang');
    const [locationId, setLocationSelect] = useState(places[0]?.id || '');
    const [customType, setCustomType] = useState('veckovis');
    const [customInterval, setCustomInterval] = useState(1);
    
    // Datum & Tider (Använder WP:s inbyggda tidsväljare)
    const [startDate, setStartDate] = useState(new Date().toISOString());
    const [endDate, setEndDate] = useState(new Date().toISOString());
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [excludedDates, setExcludedDates] = useState([]);
    const [tempExcludeDate, setTempExcludeDate] = useState('');

    // Redigera ett tillfälle
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({ date: '', start_time: '', end_time: '', location: '' });

    const [notice, setNotice] = useState(null);

    const selectedPlace = places.find(p => p.id == locationId);

    // Rapportera förändringar uppåt till page.jsx / class-delta-sync när listan muteras
    useEffect(() => {
        onOccurrencesChange(occurrences);
    }, [occurrences]);

    const triggerNotice = (message) => {
        setNotice(message);
        // Ta bort notisen automatiskt efter 4 sekunder
        setTimeout(() => setNotice(null), 6000);
    };

    // Lägg till uteslutet datum i listan
    const addExcludeDate = () => {
        if (tempExcludeDate && !excludedDates.includes(tempExcludeDate)) {
            setExcludedDates([...excludedDates, tempExcludeDate]);
            setTempExcludeDate('');
        }
    };

    // Starta redigering av en specifik rad
    const startEdit = (index, occ) => {
        setEditingIndex(index);
        setEditForm({ ...occ });
    };

    // Spara ändringarna tillbaka till listan
    const saveEdit = (index) => {
        // Kontrollera om det nya redigerade formuläret krockar med någon ANNAN rad
        const isDuplicate = occurrences.some((occ, i) => 
            i !== index && // Ignorera raden vi redigerar
            occ.date === editForm.date && 
            occ.start_time === editForm.start_time && 
            occ.end_time === editForm.end_time &&
            occ.location == editForm.location
        );

        if (isDuplicate) {
            triggerNotice("Detta tillfälle (datum/tid/plats) finns redan i listan!");
            return;
        }

        const updated = [...occurrences];
        updated[index] = editForm;
        updated.sort((a, b) => new Date(a.date) - new Date(b.date));
        setOccurrences(updated);
        setEditingIndex(null);
    };

    // Avbryt utan att spara
    const cancelEdit = () => {
        setEditingIndex(null);
    };

    // Huvudgeneratorn för att bygga tillfällen (Motsvarar din gamla JS-loop)
    const generateOccurrences = () => {
        if (!locationId) return;

        const startObj = new Date(startDate);
        const endObj = new Date(endDate);
        
        // Vi använder state-variablerna startTime/endTime som du redan har (de strängar du valt i TimePickerField)
        const startDateStr = startObj.toISOString().split('T')[0];

        if (repeatMode === 'en_gang') {
            const isDuplicate = occurrences.some(occ => 
                occ.date === startDateStr && 
                occ.start_time === startTime && 
                occ.end_time === endTime &&
                occ.location == locationId
            );

            if (isDuplicate) {
                triggerNotice(`Tillfället den ${startDateStr} kl. ${startTime} finns redan.`);
                return;
            }

            const newOcc = {
                id: null,
                date: startDateStr,
                start_time: startTime,
                end_time: endTime,
                location: locationId
            };
            setOccurrences(prev => [...prev, newOcc].sort((a, b) => new Date(a.date) - new Date(b.date)));
        } else {
            const endParts = endObj.toISOString().split('T')[0].split('-');
            const endLoop = new Date(endParts[0], endParts[1] - 1, endParts[2], 23, 59, 59);
            
            let current = new Date(startDate);
            let skipDays = 7;

            if (repeatMode === 'manadsvis') skipDays = 'monthly';
            if (repeatMode === 'custom') {
                skipDays = customType === 'dagligen' ? customInterval : customInterval * 7;
            }

            const generated = [];
            let loopCount = 0;

            while (current <= endLoop && loopCount < 150) {
                const currentDateStr = current.toISOString().split('T')[0];

                // Dubblettkontroll i loopen
                const isDuplicate = occurrences.some(occ => 
                    occ.date === currentDateStr && 
                    occ.start_time === startTime && 
                    occ.end_time === endTime &&
                    occ.location == locationId
                );

                if (!isDuplicate && !excludedDates.includes(currentDateStr)) {
                    generated.push({
                        id: null,
                        date: currentDateStr,
                        start_time: startTime,
                        end_time: endTime,
                        location: locationId
                    });
                }

                if (skipDays === 'monthly') {
                    current.setMonth(current.getMonth() + 1);
                } else {
                    current.setDate(current.getDate() + skipDays);
                }
                loopCount++;
            }

            if (generated.length === 0) {
                triggerNotice("Inga nya tillfällen genererade (dubbletter eller exkluderade datum).");
            }

            setOccurrences(prev => [...prev, ...generated].sort((a, b) => new Date(a.date) - new Date(b.date)));
        }
        
        setExcludedDates([]);
    };

    return (
        
        <div className="biugu-occurrence-manager">
            {/* 1. Generatorinställningar */}
            <div className="biugu-form-row">
                <div style={{ width: '100%' }}>
                    <SelectControl
                        label="Plats *"
                        value={locationId}
                        __next40pxDefaultSize={true}
                        options={places.map(p => ({ label: `${p.title} - ${p.street}`, value: p.id }))}
                        onChange={setLocationSelect}
                    />
                </div>

                <div style={{ width: '100%' }}>
                    Område: 
                    <div className="biugu-area-display">
                        {selectedPlace && (
                            <div>
                                {selectedPlace.area}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="biugu-form-row">
                <SelectControl
                    label="Repeterar"
                    value={repeatMode}
                    __next40pxDefaultSize={true}
                    options={[
                        { label: 'En gång', value: 'en_gang' },
                        { label: 'Veckovis', value: 'veckovis' },
                        { label: 'Månadsvis', value: 'manadsvis' },
                        { label: 'Custom', value: 'custom' },
                    ]}
                    onChange={setRepeatSelect}
                />
            </div>

            {/* Custom-inställningar */}
            {repeatMode === 'custom' && (
                <div className="biugu-form-row biugu-custom-row">
                    <SelectControl
                        label="Repetition *"
                        value={customType}
                        __next40pxDefaultSize={true}
                        options={[
                            { label: 'Dagvis', value: 'dagligen' },
                            { label: 'Veckovis', value: 'veckovis' },
                        ]}
                        onChange={setCustomType}
                    />
                    <TextControl
                        label="Intervall (Var X:e) *"
                        type="number"
                        value={customInterval}
                        min="1"
                        onChange={(val) => setCustomInterval(parseInt(val, 10) || 1)}
                    />
                </div>
            )}

            {/* Datum- och tidväljare */}
            <div className="biugu-date-time-pickers">
                <PanelRow>
                    {/* START-BLOCK (Vänster) */}
                    <div className="biugu-col-half">
                        <TimePickerField label="Starttid" value={startTime} onChange={setStartTime} interval={15} />
                        <div style={{ marginTop: '10px' }}>
                            <label className="biugu-label">Startdatum</label>
                            <div className="biugu-date-picker">
                                <DatePicker currentDate={startDate} onChange={setStartDate} isInline={true} />
                            </div>
                        </div>
                    </div>

                    {/* SLUT-BLOCK (Höger) */}
                    <div className="biugu-col-half">
                        <TimePickerField label="Sluttid" value={endTime} onChange={setEndTime} interval={15} />
                        
                        {repeatMode !== 'en_gang' && (
                            <div style={{ marginTop: '10px' }}>
                                <label className="biugu-label">Slutdatum</label>
                                <div className="biugu-date-picker">
                                    <DatePicker currentDate={endDate} onChange={setEndDate} isInline={true}  />
                                </div>
                            </div>
                        )}
                    </div>
                </PanelRow>
            </div>

            {repeatMode !== 'en_gang' && (
                <div className="biugu-exclude-section" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccd0d4', borderRadius: '4px', background: '#fcfcfc' }}>
                    <label className="biugu-label">Uteslut datum från serien</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                        <TextControl
                            label="Välj datum"
                            type="date"
                            value={tempExcludeDate}
                            onChange={setTempExcludeDate}
                        />
                        <Button isSecondary onClick={addExcludeDate} style={{ height: '40px' }}>
                            Lägg till
                        </Button>
                    </div>
                    
                    {/* Pills-listan */}
                    {excludedDates.length > 0 && (
                        <div className="biugu-exclude-pills" style={{ marginTop: '10px' }}>
                            {excludedDates.map(date => (
                                <span key={date} style={{ display: 'inline-block', padding: '4px 8px', margin: '2px', background: '#e0e0e0', borderRadius: '12px', fontSize: '11px' }}>
                                    {date} 
                                    <b style={{ marginLeft: '5px', cursor: 'pointer' }} onClick={() => setExcludedDates(excludedDates.filter(d => d !== date))}> ×</b>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="biugu-action-area" style={{ marginTop: '15px', textDirection: 'right' }}>
                <Button variant='primary' onClick={generateOccurrences}>Generera tillfällen</Button>
            </div>

            {/* 2. List-rendering av sparade och genererade rader */}
            <div className="biugu-master-list-section" style={{ marginTop: '30px' }}>
                 {notice && (
                    <div style={{ marginBottom: '15px' }}>
                        <Notice status="warning" onRemove={() => setNotice(null)}>
                            {notice}
                        </Notice>
                    </div>
                )}
                <h4>Tillagda Tillfällen ({occurrences.length})</h4>
                {occurrences.map((occ, index) => {
                    const isEditing = index === editingIndex;
                    const matchedPlace = places.find(p => p.id == (isEditing ? editForm.location : occ.location));

                    return (
                        <div 
                            key={index} 
                            className="biugu-wire-item-row" 
                            style={{ 
                                padding: '12px', 
                                background: isEditing ? '#f0f6fc' : '#fff', 
                                border: isEditing ? '1px solid #2271b1' : '1px solid #ccd0d4', 
                                marginBottom: '8px', 
                                borderRadius: '4px' 
                            }}
                        >
                            {isEditing ? (
                                /* --- REDIGERINGSLÄGE --- */
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                        <TextControl
                                            label="Datum"
                                            type="date"
                                            value={editForm.date}
                                            onChange={(val) => setEditForm({ ...editForm, date: val })}
                                        />
                                        <TimePickerField
                                            label="Start"
                                            value={editForm.start_time}
                                            onChange={(val) => setEditForm({ ...editForm, start_time: val })}
                                            interval={15}
                                        />
                                        <TimePickerField
                                            label="Slut"
                                            value={editForm.end_time}
                                            onChange={(val) => setEditForm({ ...editForm, end_time: val })}
                                            interval={15}
                                        />
                                        <SelectControl
                                            label="Plats"
                                            value={editForm.location}
                                            options={places.map(p => ({ label: p.title, value: p.id }))}
                                            onChange={(val) => setEditForm({ ...editForm, location: val })}
                                            __next40pxDefaultSize={true}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <Button isLink isDestructive onClick={cancelEdit}>Avbryt</Button>
                                        <Button variant="primary" onClick={() => saveEdit(index)}>Spara</Button>
                                    </div>
                                </div>
                            ) : (
                                /* --- VANLIGT VISNINGSLÄGE --- */
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div 
                                        onClick={() => startEdit(index, occ)} 
                                        style={{ cursor: 'pointer', flex: 1 }}
                                        title="Klicka för att ändra tillfälle"
                                    >
                                        <strong>{occ.date}</strong> — Kl {occ.start_time} - {occ.end_time}
                                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                                            {matchedPlace ? `${matchedPlace.area} - ${matchedPlace.title}` : 'Okänd plats'} 
                                            <span style={{ color: '#2271b1', marginLeft: '10px' }}>— ✎ Ändra</span>
                                        </div>
                                    </div>
                                    <Button 
                                        isDestructive 
                                        size="Small"
                                        onClick={() => setOccurrences(occurrences.filter((_, i) => i !== index))}
                                    >
                                        ×
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}