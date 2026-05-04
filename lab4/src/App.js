import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from './firebase';

import Dashboard from './Dashboard';
import MyCity from './MyCity';
import Auth from './Auth';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Стан міста
  const [resources, setResources] = useState({ budget: 125000, concrete: 450 });
  const [satisfaction, setSatisfaction] = useState(87);
  const [mapBuildings, setMapBuildings] = useState([
    { id: 1, name: 'Житловий комплекс', type: 'residential', icon: '🏢', upgradedIcon: '🏙️', costBudget: 60000, costConcrete: 150, upgraded: false },
    { id: 2, name: 'Приватний будинок', type: 'residential', icon: '🏠', upgradedIcon: '🏡', costBudget: 20000, costConcrete: 50, upgraded: false },
    { id: 3, name: 'Торговий центр', type: 'commercial', icon: '🏬', upgradedIcon: '🛒', costBudget: 100000, costConcrete: 200, upgraded: false },
    { id: 4, name: 'Супермаркет', type: 'commercial', icon: '🏪', upgradedIcon: '🛍️', costBudget: 50000, costConcrete: 100, upgraded: false },
    { id: 5, name: 'Завод', type: 'industrial', icon: '🏭', upgradedIcon: '☢️', costBudget: 150000, costConcrete: 300, upgraded: false },
  ]);

  // Слухаємо зміну статусу авторизації
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Читаємо дані з Firestore для поточного гравця
        const cityRef = doc(db, "cities", currentUser.uid);
        const citySnap = await getDoc(cityRef);
        
        if (citySnap.exists()) {
          const data = citySnap.data();
          setResources(data.resources);
          setSatisfaction(data.satisfaction);
          setMapBuildings(data.mapBuildings);
        } else {
          // Якщо це новий гравець, створюємо для нього початкове місто в базі
          await setDoc(cityRef, { resources, satisfaction, mapBuildings });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Ця функція оновлює інтерфейс і ОДНОЧАСНО зберігає зміни в хмару
  const saveAndSyncState = async (newResources, newSatisfaction, newBuildings) => {
    setResources(newResources);
    setSatisfaction(newSatisfaction);
    setMapBuildings(newBuildings);
    
    if (user) {
      const cityRef = doc(db, "cities", user.uid);
      await setDoc(cityRef, { 
        resources: newResources, 
        satisfaction: newSatisfaction, 
        mapBuildings: newBuildings 
      }, { merge: true });
    }
  };

  if (loading) return <div style={{marginTop: '50px', textAlign: 'center'}}>Завантаження...</div>;

  // Захист доступу: якщо не увійшов — показуємо лише форму
  if (!user) return <Auth />;

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
          
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
            <p style={{fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px'}}>{user.email}</p>
            <button onClick={() => signOut(auth)} style={{width: '100%', background: '#ef4444', color: 'white', padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Вийти</button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <h2>Симулятор управління містом (Лабораторна №4)</h2>
          </header>
          
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard resources={resources} satisfaction={satisfaction} />} />
              <Route path="/my-city" element={
                <MyCity 
                  resources={resources} 
                  satisfaction={satisfaction}
                  mapBuildings={mapBuildings} 
                  syncWithDB={saveAndSyncState} 
                />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}