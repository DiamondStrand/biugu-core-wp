import { CheckboxControl, FormTokenField } from '@wordpress/components';

// Matchar exakt de props som skickas från page.jsx
export default function TaxonomyManager({ value, onChange }) {

    const taxData = window.biuguEventData?.taxonomies || {};
    const allAgeGroups = taxData.all_age_groups || [];
    const allCategories = taxData.all_categories || [];
    const allTags = taxData.all_tags || [];

    const handleAgeGroupChange = (id, checked) => {
        const currentIds = value.age_groups || [];
        const nextIds = checked 
            ? [...currentIds, id] 
            : currentIds.filter(gId => gId !== id);
        
        onChange({ ...value, age_groups: nextIds });
    };

    return (
        <div className="biu-taxonomy-manager" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '5px 0' }}>
            
            {/* 1. Åldersgrupper (Checkboxes) */}
            <div className="biu-tax-section">
                <label className="biugu-label" style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    Åldersgrupper
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {allAgeGroups.map(group => (
                        <CheckboxControl
                            key={group.id}
                            label={group.name}
                            checked={(value.age_groups || []).includes(group.id)}
                            onChange={(checked) => handleAgeGroupChange(group.id, checked)}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Kategorier (Sök & Token) */}
            <div className="biu-tax-section">
                <FormTokenField
                    label="Kategorier"
                    value={value.categories || []}
                    suggestions={allCategories}
                    onChange={(tokens) => onChange({ ...value, categories: tokens })}
                    __next40pxDefaultSize={true}
                />
            </div>

            {/* 3. Taggar (Sök & Token) */}
            <div className="biu-tax-section">
                <FormTokenField
                    label="Taggar"
                    value={value.tags || []}
                    suggestions={allTags}
                    onChange={(tokens) => onChange({ ...value, tags: tokens })}
                    __next40pxDefaultSize={true}
                />
            </div>
        </div>
    );
}