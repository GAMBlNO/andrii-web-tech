import React from 'react';

// --- КОМПОНЕНТ 1: Індикатор Бюджету ---
const BudgetWidget = ({ budget }) => (
  <div className="panel widget-card">
    <h3>💰 Бюджет міста</h3>
    <p className="value text-success">${budget.toLocaleString()}</p>
    <p className="subtitle">Кошти для будівництва</p>
  </div>
);

// --- КОМПОНЕНТ 2: Індикатор задоволеності ---
const SatisfactionWidget = ({ satisfaction }) => (
  <div className="panel widget-card">
    <h3>😊 Задоволеність жителів</h3>
    <div className="progress-bar-bg">
      <div className="progress-bar-fill" style={{ width: `${satisfaction}%` }}></div>
    </div>
    <p className="subtitle">{satisfaction}% - Показник щастя</p>
  </div>
);

// --- СТОРІНКА ДАШБОРДУ ---
export default function Dashboard({ resources, satisfaction }) {
  return (
    <div className="page-content">
      <div className="dashboard-grid">
        <BudgetWidget budget={resources.budget} />
        <SatisfactionWidget satisfaction={satisfaction} />
        
        {/* Віджет ресурсів */}
        <div className="panel widget-card">
          <h3>🧱 Будматеріали</h3>
          <p className="value">{resources.concrete} т</p>
          <p className="subtitle">Запаси бетону</p>
        </div>
      </div>
    </div>
  );
}