import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#0f172a'}}>
        {isLogin ? 'Вхід у CityBuilder' : 'Реєстрація Мера'}
      </h2>
      
      {error && <p style={{color: '#ef4444', fontSize: '0.85rem', marginBottom: '15px'}}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Електронна пошта" required 
          value={email} onChange={(e) => setEmail(e.target.value)} 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <input 
          type="password" placeholder="Пароль (мінімум 6 символів)" required 
          value={password} onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Увійти' : 'Зареєструватися'}
        </button>
      </form>
      
      <p style={{textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem'}} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Немає акаунту? Створити місто' : 'Вже є місто? Увійти'}
      </p>
    </div>
  );
}