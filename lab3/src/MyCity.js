import React, { useState } from 'react';

// Компонент картки
const BuildingCard = ({ building }) => (
  <div className="building-card">
    <div className="b-icon">{building.icon}</div>
    <div className="b-info">
      <h4>{building.name}</h4>
      <p>Категорія: <strong>{building.category}</strong></p>
      <p>Вартість побудови: {building.cost}</p>
    </div>
  </div>
);

// ТЕПЕР МИ ОТРИМУЄМО mapBuildings ТА setMapBuildings З APP.JS
export default function MyCity({ resources, setResources, setSatisfaction, mapBuildings, setMapBuildings }) {
  const [filter, setFilter] = useState('Всі');
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  const catalog = [
    { id: 1, name: 'Житловий комплекс', category: 'Житлові', icon: '🏢', cost: '$60,000' },
    { id: 2, name: 'Приватний будинок', category: 'Житлові', icon: '🏠', cost: '$20,000' },
    { id: 3, name: 'Торговий центр', category: 'Комерційні', icon: '🏬', cost: '$100,000' },
    { id: 4, name: 'Супермаркет', category: 'Комерційні', icon: '🏪', cost: '$50,000' },
    { id: 5, name: 'Завод', category: 'Промислові', icon: '🏭', cost: '$150,000' },
  ];

  const filteredCatalog = filter === 'Всі' ? catalog : catalog.filter(b => b.category === filter);

  const upgradeMapBuilding = () => {
    if (!selectedBuildingId) {
       alert("Спочатку виберіть об'єкт на карті!");
       return;
    }

    const target = mapBuildings.find(b => b.id === selectedBuildingId);

    if (target.upgraded) {
        alert("Цей об'єкт вже модернізовано до максимуму!");
        return;
    }

    if (resources.budget >= target.costBudget && resources.concrete >= target.costConcrete) {
      setResources(r => ({ 
        budget: r.budget - target.costBudget, 
        concrete: r.concrete - target.costConcrete 
      }));
      setSatisfaction(s => Math.min(s + 5, 100));
      
      setMapBuildings(prev => prev.map(b => 
        b.id === selectedBuildingId 
          ? { ...b, icon: b.upgradedIcon, upgraded: true }
          : b
      ));
      
      setSelectedBuildingId(null);
      alert(`Успішно модернізовано: ${target.name}!`);
    } else {
      alert(`Недостатньо ресурсів! Потрібно $${target.costBudget.toLocaleString()} та ${target.costConcrete} т бетону.`);
    }
  };

  const cityMap = [
    ['grass', 'park',  'road',  'grass', 'grass', 'grass', 'park'],
    ['grass', 1,       'road',  3,       'grass', 'grass', 'grass'],
    ['road',  'road',  'road',  'road',  'road',  'road',  'road'],
    ['park',  'grass', 'road',  2,       'grass', 4,       'grass'],
    ['grass', 'grass', 'road',  'grass', 'grass', 'grass', 'park'],
    ['grass', 5,       'road',  'grass', 'park',  'grass', 'grass'],
    ['grass', 'grass', 'road',  'grass', 'grass', 'grass', 'grass']
  ];

  const selectedBuildingData = mapBuildings.find(b => b.id === selectedBuildingId);

  return (
    <div className="my-city-layout">
      <div className="panel map-panel">
        <h3>Моє місто (Сектор 7х7)</h3>
        
        <div className="city-grid-react">
          {cityMap.map((row, rowIndex) => 
            row.map((cell, colIndex) => {
              if (typeof cell === 'number') {
                const b = mapBuildings.find(build => build.id === cell);
                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell ${b.type} ${b.upgraded ? 'upgraded' : ''} ${selectedBuildingId === b.id ? 'selected' : ''}`} 
                    onClick={() => setSelectedBuildingId(b.id)}
                    title={b.name}
                  >
                    {b.icon}
                  </div>
                );
              }
              
              let icon = '';
              if (cell === 'road') icon = '🛣️';
              if (cell === 'park') icon = '🌳';

              return (
                <div key={`${rowIndex}-${colIndex}`} className={`cell ${cell}`}>
                  {icon}
                </div>
              );
            })
          )}
        </div>

        <div className="construction-center">
          {selectedBuildingData ? (
            <div>
              <p><strong>Вибрано:</strong> {selectedBuildingData.name}</p>
              {!selectedBuildingData.upgraded ? (
                <p style={{fontSize: '0.85rem', color: '#f59e0b', marginBottom: '10px'}}>
                  Вартість покращення: ${selectedBuildingData.costBudget.toLocaleString()} | {selectedBuildingData.costConcrete} т бетону
                </p>
              ) : (
                <p style={{fontSize: '0.85rem', color: '#10b981', marginBottom: '10px'}}>✅ Об'єкт модернізовано</p>
              )}
            </div>
          ) : (
            <p>Виберіть об'єкт на карті для перегляду інформації.</p>
          )}
          
          <button className="btn-primary" onClick={upgradeMapBuilding}>Покращити об'єкт 🌟</button>
        </div>
      </div>

      <div className="panel catalog-panel">
        <h3>Доступні об'єкти</h3>
        
        <div className="filters">
          {['Всі', 'Житлові', 'Комерційні', 'Промислові'].map(cat => (
            <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="catalog-grid">
          {filteredCatalog.map(b => <BuildingCard key={b.id} building={b} />)}
        </div>
      </div>
    </div>
  );
}