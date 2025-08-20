// Hiển thị danh sách cảm biến của nhà màng
function renderSensorList(sensors) {
    const sensorList = document.getElementById('sensor-list');
    sensorList.innerHTML = '';
    
    sensors.forEach(sensor => {
        const sensorItem = document.createElement('li');
        sensorItem.textContent = sensor.name;
        sensorItem.dataset.id = sensor.id;
        
        sensorItem.addEventListener('click', () => {
            // Xóa trạng thái active của tất cả các cảm biến
            document.querySelectorAll('#sensor-list li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Thêm trạng thái active cho cảm biến được chọn
            sensorItem.classList.add('active');
            
            // Hiển thị chi tiết cảm biến
            selectSensor(sensor.id);
        });
        
        sensorList.appendChild(sensorItem);
    });
}

// Chọn cảm biến để xem chi tiết
function selectSensor(sensorId) {
    // Tìm nhà màng đang được chọn
    const activeGreenhouseItem = document.querySelector('.greenhouse-item.active');
    if (!activeGreenhouseItem) return;
    
    const greenhouseId = parseInt(activeGreenhouseItem.dataset.id);
    const greenhouse = greenhousesData.find(gh => gh.id === greenhouseId);
    if (!greenhouse) return;
    
    // Tìm cảm biến được chọn
    const sensor = greenhouse.sensors.find(s => s.id === sensorId);
    if (!sensor) return;
    
    // Cập nhật tiêu đề cảm biến
    document.getElementById('sensor-title').textContent = `Chi tiết cảm biến: ${sensor.name}`;
    
    // Cập nhật giá trị hiện tại
    document.getElementById('current-value').textContent = sensor.value;
    document.getElementById('value-unit').textContent = sensor.unit;
    
    // Cập nhật ngưỡng cảnh báo
    document.getElementById('min-threshold').value = sensor.min;
    document.getElementById('max-threshold').value = sensor.max;
    
    // Cập nhật biểu đồ
    updateSensorChart(sensor);
    
    // Kiểm tra và hiển thị cảnh báo nếu cần
    checkSensorThresholds(sensor);
}

// Kiểm tra ngưỡng cảnh báo của cảm biến
function checkSensorThresholds(sensor) {
    if (sensor.value < sensor.min) {
        showAlert(`Cảnh báo: ${sensor.name} (${sensor.value}${sensor.unit}) thấp hơn ngưỡng cho phép (${sensor.min}${sensor.unit})`, 'warning');
    } else if (sensor.value > sensor.max) {
        showAlert(`Cảnh báo: ${sensor.name} (${sensor.value}${sensor.unit}) cao hơn ngưỡng cho phép (${sensor.max}${sensor.unit})`, 'error');
    }
}

// Xử lý sự kiện lưu ngưỡng cảnh báo
document.getElementById('save-threshold').addEventListener('click', () => {
    const minThreshold = parseFloat(document.getElementById('min-threshold').value);
    const maxThreshold = parseFloat(document.getElementById('max-threshold').value);
    
    // Kiểm tra giá trị hợp lệ
    if (isNaN(minThreshold) || isNaN(maxThreshold)) {
        showAlert('Vui lòng nhập giá trị ngưỡng hợp lệ', 'error');
        return;
    }
    
    if (minThreshold >= maxThreshold) {
        showAlert('Ngưỡng dưới phải nhỏ hơn ngưỡng trên', 'error');
        return;
    }
    
    // Tìm cảm biến đang được chọn
    const activeSensorItem = document.querySelector('#sensor-list li.active');
    if (!activeSensorItem) return;
    
    const sensorId = parseInt(activeSensorItem.dataset.id);
    
    // Tìm nhà màng đang được chọn
    const activeGreenhouseItem = document.querySelector('.greenhouse-item.active');
    if (!activeGreenhouseItem) return;
    
    const greenhouseId = parseInt(activeGreenhouseItem.dataset.id);
    const greenhouse = greenhousesData.find(gh => gh.id === greenhouseId);
    if (!greenhouse) return;
    
    // Cập nhật ngưỡng cho cảm biến
    const sensor = greenhouse.sensors.find(s => s.id === sensorId);
    if (!sensor) return;
    
    sensor.min = minThreshold;
    sensor.max = maxThreshold;
    
    showAlert(`Đã cập nhật ngưỡng cảnh báo cho ${sensor.name}`, 'info');
    
    // Kiểm tra lại ngưỡng với giá trị hiện tại
    checkSensorThresholds(sensor);
});