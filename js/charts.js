// Biến lưu trữ biểu đồ
let sensorChart = null;

// Cập nhật biểu đồ cho cảm biến
function updateSensorChart(sensor) {
    const ctx = document.getElementById('sensor-chart').getContext('2d');
    
    // Nếu đã có biểu đồ, hủy nó để tạo biểu đồ mới
    if (sensorChart) {
        sensorChart.destroy();
    }
    
    // Tạo dữ liệu mẫu cho biểu đồ (24 giờ gần nhất)
    const labels = [];
    const data = [];
    
    // Tạo dữ liệu mẫu cho 24 giờ gần nhất
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(now.getHours() - i);
        labels.push(time.getHours() + ':00');
        
        // Tạo giá trị ngẫu nhiên xung quanh giá trị hiện tại
        const randomValue = sensor.value + (Math.random() * 10 - 5);
        data.push(Math.max(0, randomValue.toFixed(1)));
    }
    
    // Tạo biểu đồ mới
    sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${sensor.name} (${sensor.unit})`,
                data: data,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: Math.max(0, sensor.min - 10),
                    suggestedMax: sensor.max + 10
                }
            },
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: sensor.min,
                        borderColor: '#f39c12',
                        borderWidth: 2,
                        label: {
                            content: `Ngưỡng dưới: ${sensor.min}${sensor.unit}`,
                            enabled: true,
                            position: 'left'
                        }
                    },
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: sensor.max,
                        borderColor: '#e74c3c',
                        borderWidth: 2,
                        label: {
                            content: `Ngưỡng trên: ${sensor.max}${sensor.unit}`,
                            enabled: true,
                            position: 'left'
                        }
                    }
                ]
            }
        }
    });
    
    // Cập nhật biểu đồ mỗi 5 giây với dữ liệu mới
    startRealtimeUpdates(sensor);
}

// Biến lưu trữ interval để cập nhật dữ liệu thời gian thực
let updateInterval = null;

// Bắt đầu cập nhật dữ liệu thời gian thực
function startRealtimeUpdates(sensor) {
    // Xóa interval cũ nếu có
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    // Tạo interval mới để cập nhật dữ liệu
    updateInterval = setInterval(() => {
        if (!sensorChart) return;
        
        // Thêm dữ liệu mới
        const newValue = sensor.value + (Math.random() * 4 - 2);
        const roundedValue = Math.max(0, newValue.toFixed(1));
        
        // Cập nhật giá trị hiện tại của cảm biến
        sensor.value = parseFloat(roundedValue);
        document.getElementById('current-value').textContent = roundedValue;
        
        // Thêm dữ liệu mới vào biểu đồ
        const now = new Date();
        sensorChart.data.labels.push(now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes());
        sensorChart.data.datasets[0].data.push(roundedValue);
        
        // Giới hạn số điểm dữ liệu hiển thị (giữ 24 điểm)
        if (sensorChart.data.labels.length > 24) {
            sensorChart.data.labels.shift();
            sensorChart.data.datasets[0].data.shift();
        }
        
        // Cập nhật biểu đồ
        sensorChart.update();
        
        // Kiểm tra ngưỡng cảnh báo
        checkSensorThresholds(sensor);
    }, 5000); // Cập nhật mỗi 5 giây
}

// Dừng cập nhật dữ liệu thời gian thực khi chuyển view
document.getElementById('back-to-dashboard').addEventListener('click', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
});