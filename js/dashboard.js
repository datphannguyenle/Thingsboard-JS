// Dữ liệu mẫu cho các nhà màng
const greenhousesData = [
    {
        id: 1,
        name: 'Nhà màng 1',
        location: 'Khu A',
        status: 'normal',
        sensors: [
            { id: 101, name: 'Nhiệt độ', value: 28, unit: '°C', min: 20, max: 35 },
            { id: 102, name: 'Độ ẩm không khí', value: 75, unit: '%', min: 60, max: 85 },
            { id: 103, name: 'Độ ẩm đất', value: 65, unit: '%', min: 50, max: 80 },
            { id: 104, name: 'Ánh sáng', value: 5200, unit: 'lux', min: 3000, max: 10000 },
            { id: 105, name: 'CO2', value: 450, unit: 'ppm', min: 350, max: 1000 }
        ]
    },
    {
        id: 2,
        name: 'Nhà màng 2',
        location: 'Khu B',
        status: 'warning',
        sensors: [
            { id: 201, name: 'Nhiệt độ', value: 34, unit: '°C', min: 20, max: 35 },
            { id: 202, name: 'Độ ẩm không khí', value: 62, unit: '%', min: 60, max: 85 },
            { id: 203, name: 'Độ ẩm đất', value: 45, unit: '%', min: 50, max: 80 },
            { id: 204, name: 'Ánh sáng', value: 6500, unit: 'lux', min: 3000, max: 10000 },
            { id: 205, name: 'CO2', value: 520, unit: 'ppm', min: 350, max: 1000 }
        ]
    },
    {
        id: 3,
        name: 'Nhà màng 3',
        location: 'Khu C',
        status: 'danger',
        sensors: [
            { id: 301, name: 'Nhiệt độ', value: 38, unit: '°C', min: 20, max: 35 },
            { id: 302, name: 'Độ ẩm không khí', value: 55, unit: '%', min: 60, max: 85 },
            { id: 303, name: 'Độ ẩm đất', value: 72, unit: '%', min: 50, max: 80 },
            { id: 304, name: 'Ánh sáng', value: 9800, unit: 'lux', min: 3000, max: 10000 },
            { id: 305, name: 'CO2', value: 950, unit: 'ppm', min: 350, max: 1000 }
        ]
    }
];

// Hiển thị danh sách nhà màng trong sidebar
function renderGreenhouseList() {
    const greenhouseList = document.getElementById('greenhouse-list');
    greenhouseList.innerHTML = '';
    
    greenhousesData.forEach(greenhouse => {
        const greenhouseItem = document.createElement('div');
        greenhouseItem.className = 'greenhouse-item';
        greenhouseItem.textContent = greenhouse.name;
        greenhouseItem.dataset.id = greenhouse.id;
        
        greenhouseItem.addEventListener('click', () => {
            selectGreenhouse(greenhouse.id);
        });
        
        greenhouseList.appendChild(greenhouseItem);
    });
}

// Hiển thị grid các nhà màng trong dashboard
function renderGreenhouseGrid() {
    const greenhouseGrid = document.getElementById('greenhouse-grid');
    greenhouseGrid.innerHTML = '';
    
    greenhousesData.forEach(greenhouse => {
        const card = document.createElement('div');
        card.className = `greenhouse-card status-${greenhouse.status}`;
        card.dataset.id = greenhouse.id;
        
        // Tạo tiêu đề nhà màng
        const title = document.createElement('h3');
        title.textContent = greenhouse.name;
        
        // Tạo vị trí nhà màng
        const location = document.createElement('div');
        location.className = 'greenhouse-location';
        location.textContent = `Vị trí: ${greenhouse.location}`;
        
        // Tạo trạng thái các cảm biến
        const statusContainer = document.createElement('div');
        statusContainer.className = 'greenhouse-status';
        
        // Hiển thị 3 cảm biến chính: nhiệt độ, độ ẩm không khí, ánh sáng
        const mainSensors = greenhouse.sensors.filter(sensor => 
            ['Nhiệt độ', 'Độ ẩm không khí', 'Ánh sáng'].includes(sensor.name)
        );
        
        mainSensors.forEach(sensor => {
            const statusItem = document.createElement('div');
            statusItem.className = 'status-item';
            
            // Xác định trạng thái cảm biến
            let statusClass = 'status-normal';
            if (sensor.value < sensor.min || sensor.value > sensor.max) {
                statusClass = sensor.value > sensor.max ? 'status-danger' : 'status-warning';
            }
            
            statusItem.innerHTML = `
                <div class="status-value ${statusClass}">${sensor.value}${sensor.unit}</div>
                <div class="status-label">${sensor.name}</div>
            `;
            
            statusContainer.appendChild(statusItem);
        });
        
        // Thêm các phần tử vào card
        card.appendChild(title);
        card.appendChild(location);
        card.appendChild(statusContainer);
        
        // Thêm sự kiện click để xem chi tiết nhà màng
        card.addEventListener('click', () => {
            selectGreenhouse(greenhouse.id);
        });
        
        greenhouseGrid.appendChild(card);
    });
}

// Chọn nhà màng để xem chi tiết
function selectGreenhouse(greenhouseId) {
    // Cập nhật trạng thái active trong danh sách
    const greenhouseItems = document.querySelectorAll('.greenhouse-item');
    greenhouseItems.forEach(item => {
        if (parseInt(item.dataset.id) === greenhouseId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Tìm nhà màng được chọn
    const selectedGreenhouse = greenhousesData.find(gh => gh.id === greenhouseId);
    if (!selectedGreenhouse) return;
    
    // Cập nhật tiêu đề
    document.getElementById('greenhouse-title').textContent = `Chi tiết: ${selectedGreenhouse.name}`;
    
    // Hiển thị view chi tiết nhà màng
    showView('greenhouse-view');
    
    // Hiển thị danh sách cảm biến
    renderSensorList(selectedGreenhouse.sensors);
    
    // Chọn cảm biến đầu tiên mặc định
    if (selectedGreenhouse.sensors.length > 0) {
        selectSensor(selectedGreenhouse.sensors[0].id);
    }
}

// Khởi tạo dashboard
function initDashboard() {
    renderGreenhouseList();
    renderGreenhouseGrid();
    
    // Xử lý nút thêm nhà màng
    document.getElementById('add-greenhouse').addEventListener('click', () => {
        // Hiển thị form thêm nhà màng (có thể thêm sau)
        showAlert('Chức năng thêm nhà màng sẽ được phát triển sau', 'info');
    });
}

// Khởi chạy dashboard khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initDashboard);