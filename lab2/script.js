// 1. Ініціалізація бази даних ресурсів
const cityResources = {
    budget: { name: "Бюджет міста", value: 125000, unit: "$" },
    concrete: { name: "Бетон", value: 450, unit: "т" },
    wood: { name: "Деревина", value: 820, unit: "куб.м" }
};

// Змінні для статистики міста
let population = 45200;
let energyUsed = 120;
const energyMax = 150;

// Функція для додавання запису в Журнал подій
function logActivity(message) {
    const logList = document.getElementById('activity-log');
    const newLog = document.createElement('li');
    
    // Отримуємо поточний час (наприклад, 14:35:12)
    const now = new Date();
    const timeString = now.toLocaleTimeString('uk-UA');
    
    newLog.innerHTML = `<span class="log-time">[${timeString}]</span> ${message}`;
    
    // Додаємо новий запис на початок списку
    logList.insertBefore(newLog, logList.firstChild);
}

// ==========================================
// ВИМОГА 1: Виведення ресурсів циклом do..while
// ==========================================
function renderResources() {
    const resourcesContainer = document.getElementById('resources-container');
    resourcesContainer.innerHTML = ''; // Очищаємо контейнер перед оновленням
    
    const resourceKeys = Object.keys(cityResources);
    let index = 0;

    // Цикл do..while (виконується щонайменше 1 раз)
    do {
        const key = resourceKeys[index];
        const resource = cityResources[key];
        
        const listItem = document.createElement('li');
        const displayValue = resource.unit === '$' ? `$${resource.value.toLocaleString()}` : `${resource.value} ${resource.unit}`;
        
        listItem.innerHTML = `
            <div class="material-info">
                <span>${resource.name}</span> 
                <span class="material-value" id="val-${key}">${displayValue}</span>
            </div>
        `;
        
        resourcesContainer.appendChild(listItem);
        index++;
    } while (index < resourceKeys.length);
}

// Первинний виклик функції для відмальовки
renderResources();


// ==========================================
// ВИМОГА 2 ТА 3: Карта та логіка модернізації
// ==========================================
const mapCells = document.querySelectorAll('.cell');
let selectedBuilding = null;

// Обробка кліку по карті
mapCells.forEach(cell => {
    cell.addEventListener('click', function() {
        // Умова if: взаємодіємо лише з будинками та заводами, які ще не покращені
        if ((this.dataset.type === 'house' || this.dataset.type === 'factory') && !this.classList.contains('upgraded')) {
            
            // Знімаємо виділення з усіх
            mapCells.forEach(c => c.classList.remove('selected'));
            
            // Виділяємо поточний
            this.classList.add('selected');
            selectedBuilding = this;
            
            const bType = this.dataset.type === 'house' ? 'Житловий комплекс' : 'Промисловий об\'єкт';
            logActivity(`Вибрано об'єкт для аналізу: ${bType}.`);
        } else if (this.classList.contains('upgraded')) {
            logActivity(`Увага: Цей об'єкт вже модернізовано до максимального рівня.`);
        }
    });
});

// Обробка натискання кнопки "Почати модернізацію"
document.getElementById('upgrade-btn').addEventListener('click', function() {
    
    if (!selectedBuilding) {
        alert("Спочатку натисніть на об'єкт (🏠 або 🏭) на карті!");
        return;
    }

    const costBudget = 50000;
    const costConcrete = 100;

    // Умова if-else: перевірка наявності ресурсів
    if (cityResources.budget.value >= costBudget && cityResources.concrete.value >= costConcrete) {
        
        // Віднімаємо ресурси
        cityResources.budget.value -= costBudget;
        cityResources.concrete.value -= costConcrete;

        // Оновлюємо відображення ресурсів (викликаємо нашу функцію з циклом)
        renderResources();

        // Модернізуємо об'єкт залежно від його типу
        if (selectedBuilding.dataset.type === 'house') {
            selectedBuilding.textContent = '🏢'; 
            selectedBuilding.classList.add('upgraded');
            selectedBuilding.dataset.type = 'upgraded_house';
            
            // Збільшуємо населення
            population += 150;
            document.getElementById('population-val').textContent = population.toLocaleString();
            logActivity(`Модернізацію житла успішно завершено. Населення зросло на 150 осіб.`);
            
        } else if (selectedBuilding.dataset.type === 'factory') {
            selectedBuilding.textContent = '☢️'; 
            selectedBuilding.classList.add('upgraded');
            selectedBuilding.dataset.type = 'upgraded_factory';
            
            // Збільшуємо споживання енергії
            energyUsed += 15;
            document.getElementById('energy-val').textContent = `${energyUsed} / ${energyMax}`;
            logActivity(`Завод переобладнано. Споживання енергії зросло на 15 МВт.`);
        }

        // Скидаємо вибір
        selectedBuilding.classList.remove('selected');
        selectedBuilding = null;

    } else {
        // Логуємо помилку
        logActivity(`<span style="color: red;">Помилка транзакції: Недостатньо ресурсів для модернізації!</span>`);
        alert("Недостатньо ресурсів! Потрібно $50,000 та 100 т бетону.");
    }
});