// Получаем все ячейки
const cells = document.querySelectorAll('.cell');
const colorOverlay = document.getElementById('colorOverlay');
const colorImageContainer = document.getElementById('colorImageContainer');
const colorImage = document.getElementById('colorImage');

// Последовательность открытия ячеек
const nextCellMap = {
    1: 2,
    2: 3,
    3: 4,
    4: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 5,
    5: null  // После 5 ячейки больше нет
};

// Координаты кликабельных зон для каждой ячейки
const clickableZones = {
    1: [{ left: 37, top: 289, width: 100, height: 40 }],
    2: [{ left: 208, top: 305, width: 100, height: 40 }],
    3: [{ left: 221, top: 37, width: 100, height: 40 }],
    4: [{ left: 20, top: 267, width: 100, height: 40 }],
    5: [{ left: 225, top: 302, width: 100, height: 40 }],
    6: [{ left: 168, top: 277, width: 100, height: 40 }],
    7: [{ left: 59, top: 320, width: 100, height: 40 }],
    8: [{ left: 14, top: 131, width: 100, height: 40 }],
    9: [{ left: 167, top: 228, width: 100, height: 40 }]
};

let currentCell = null;

// Обработка кликов на ячейки
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        // Проверяем, есть ли у ячейки класс show-wb
        if (cell.classList.contains('show-wb')) {
            const cellNumber = cell.getAttribute('data-cell');
            currentCell = cellNumber;
            console.log(`Клик на ячейку ${cellNumber} с активным wb`);
            
            // Устанавливаем изображение color
            colorImage.src = `images/color/${cellNumber}color.png`;
            
            // Показываем оверлей
            colorOverlay.classList.add('active');
            
            // Создаем кликабельные зоны для этой ячейки
            createClickableZones(cellNumber);
        }
    });
});

// Создание кликабельных зон
function createClickableZones(cellNumber) {
    // Удаляем старые зоны
    const oldZones = colorImageContainer.querySelectorAll('.clickable-zone');
    oldZones.forEach(zone => zone.remove());
    
    // Создаем новые зоны
    const zones = clickableZones[cellNumber];
    zones.forEach(zoneData => {
        const zone = document.createElement('div');
        zone.className = 'clickable-zone';
        zone.style.left = zoneData.left + 'px';
        zone.style.top = zoneData.top + 'px';
        zone.style.width = zoneData.width + 'px';
        zone.style.height = zoneData.height + 'px';
        
        zone.addEventListener('click', (e) => {
            e.stopPropagation();
            handleZoneClick(zone);
        });
        
        colorImageContainer.appendChild(zone);
    });
}

// Обработка клика по кликабельной зоне
function handleZoneClick(zone) {
    // Подсвечиваем зеленым
    zone.classList.add('success');
    
    // Через небольшую задержку закрываем оверлей и обновляем ячейки
    setTimeout(() => {
        colorOverlay.classList.remove('active');
        
        // Находим текущую ячейку
        const currentCellElement = document.querySelector(`.cell[data-cell="${currentCell}"]`);
        
        if (currentCellElement) {
            // Меняем текущую ячейку на opened
            currentCellElement.classList.remove('show-wb');
            currentCellElement.classList.add('show-opened');
            
            // Активируем следующую ячейку (wb) по карте последовательности
            const nextCellNumber = nextCellMap[parseInt(currentCell)];
            if (nextCellNumber) {
                const nextCellElement = document.querySelector(`.cell[data-cell="${nextCellNumber}"]`);
                if (nextCellElement) {
                    nextCellElement.classList.add('show-wb');
                }
            }
        }
        
        currentCell = null;
    }, 300);
}

// Обработка клика по оверлею (мимо зон)
colorOverlay.addEventListener('click', (e) => {
    // Если клик был по самому оверлею, а не по зоне
    if (e.target === colorOverlay || e.target === colorImage || e.target === colorImageContainer) {
        // Добавляем класс для эффекта тряски
        colorImage.classList.add('shake');
        
        // Убираем класс после анимации
        setTimeout(() => {
            colorImage.classList.remove('shake');
        }, 500);
    }
});

