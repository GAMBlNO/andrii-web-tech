import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './Dashboard';
import MyCity from './MyCity';
import './App.css';

export default function App() {
  // Спільний стан ресурсів та задоволеності
  const [resources, setResources] = useState({ budget: 225000, concrete: 450 });
  const [satisfaction, setSatisfaction] = useState(87);

  // ПЕРЕНЕСЕНО З MyCity: Тепер глобальний стан об'єктів зберігається тут і не зникає!
  const [mapBuildings, setMapBuildings] = useState([
    { id: 1, name: 'Житловий комплекс', type: 'residential', icon: '🏢', upgradedIcon: '🏙️', costBudget: 60000, costConcrete: 150, upgraded: false },
    { id: 2, name: 'Приватний будинок', type: 'residential', icon: '🏠', upgradedIcon: '🏡', costBudget: 20000, costConcrete: 50, upgraded: false },
    { id: 3, name: 'Торговий центр', type: 'commercial', icon: '🏬', upgradedIcon: '🛒', costBudget: 100000, costConcrete: 200, upgraded: false },
    { id: 4, name: 'Супермаркет', type: 'commercial', icon: '🏪', upgradedIcon: '🛍️', costBudget: 50000, costConcrete: 100, upgraded: false },
    { id: 5, name: 'Завод', type: 'industrial', icon: '🏭', upgradedIcon: '☢️', costBudget: 150000, costConcrete: 300, upgraded: false },
  ]);

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">
            <h2>CityBuilder <span>Pro</span></h2>
          </div>
          <nav className="main-nav">
            <ul>
              <li><NavLink to="/" className={({isActive}) => isActive ? "active-link" : ""}>📊 Дашборд</NavLink></li>
              <li><NavLink to="/my-city" className={({isActive}) => isActive ? "active-link" : ""}>🗺️ Моє місто</NavLink></li>
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <h2>Симулятор управління містом (Лабораторна №3)</h2>
          </header>
          
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard resources={resources} satisfaction={satisfaction} />} />
              <Route path="/my-city" element={
                <MyCity 
                  resources={resources} 
                  setResources={setResources} 
                  setSatisfaction={setSatisfaction}
                  mapBuildings={mapBuildings} /* Передаємо будинки */
                  setMapBuildings={setMapBuildings} /* Передаємо функцію оновлення */
                />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}