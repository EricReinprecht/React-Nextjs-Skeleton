import { Category } from '@/src/app/lib/entities/category';
import { useState, useEffect } from 'react';

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
        <>
            <input
            className='category-search'
                type="search"
                placeholder="Kategorie suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className='categories-list'>
                {filteredCategories.length === 0 && <p>Keine Kategorien gefunden</p>}
                {filteredCategories.map(category => (
                    <div className='category-result'>
                        <input
                            type="checkbox"
                            checked={selectedCategories.some(c => c.id === category.id)}
                            onChange={() => toggleCategory(category)}
                            style={{ marginRight: '0.5rem' }}
                            id={`category_checkbox-${category.id}`}
                            name={`category_checkbox-${category.id}`}
                        />
                        <label key={category.id} htmlFor={`category_checkbox-${category.id}`} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Step5CategorySelector;
