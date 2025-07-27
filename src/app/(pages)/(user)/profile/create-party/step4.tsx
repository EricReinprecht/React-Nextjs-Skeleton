import { useState, useEffect } from 'react';

interface Category {
    id: string | number;
    name: string;
}

interface Step5CategorySelectorProps {
    allCategories: Category[];
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
}

function Step5CategorySelector({
    allCategories,
    selectedCategories,
    setSelectedCategories,
}: Step5CategorySelectorProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>(allCategories);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredCategories(allCategories);
        } else {
            setFilteredCategories(
                allCategories.filter(cat =>
                    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, allCategories]);

    const toggleCategory = (category: Category) => {
        if (selectedCategories.some(c => c.id === category.id)) {
            setSelectedCategories(selectedCategories.filter(c => c.id !== category.id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <div>
            <input
                type="search"
                placeholder="Kategorie suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
            />

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
                {filteredCategories.length === 0 && <p>Keine Kategorien gefunden</p>}

                {filteredCategories.map(category => (
                    <label key={category.id} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={selectedCategories.some(c => c.id === category.id)}
                            onChange={() => toggleCategory(category)}
                            style={{ marginRight: '0.5rem' }}
                        />
                        {category.name}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default Step5CategorySelector;
