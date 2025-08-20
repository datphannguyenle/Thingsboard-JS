// Biến lưu trữ biểu đồ
let sensorChart = null;
// Biến lưu trữ interval realtime
window.updateInterval = null;

// Cập nhật biểu đồ cho cảm biến
function updateSensorChart(sensor) {
  const canvas = document.getElementById('sensor-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (sensorChart) {
    sensorChart.destroy();
    sensorChart = null;
  }

  // Dữ liệu mẫu 24h
  const labels = [];
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const t = new Date(now);
    t.setHours(now.getHours() - i);
    labels.push(t.getHours() + ':00');
    const rv = sensor.value + (Math.random() * 10 - 5);
    data.push(Math.max(0, Number(rv.toFixed(1))));
  }

  sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${sensor.name} (${sensor.unit})`,
        data,
        borderWidth: 2,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: { mode: 'index', intersect: false },
        // Nếu có plugin annotation sẽ tự ăn cấu hình dưới
        annotation: {
          annotations: [
            { type: 'line', mode: 'horizontal', scaleID: 'y', value: sensor.min,
              borderColor: '#f39c12', borderWidth: 2,
              label: { content: `Ngưỡng dưới: ${sensor.min}${sensor.unit}`, enabled: true, position: 'left' } },
            { type: 'line', mode: 'horizontal', scaleID: 'y', value: sensor.max,
              borderColor: '#e74c3c', borderWidth: 2,
              label: { content: `Ngưỡng trên: ${sensor.max}${sensor.unit}`, enabled: true, position: 'left' } }
          ]
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: Math.max(0, sensor.min - 10),
          suggestedMax: sensor.max + 10
        }
      }
    }
  });

  // Bắt đầu cập nhật realtime
  startRealtimeUpdates(sensor);
}

// Bắt đầu cập nhật dữ liệu thời gian thực
function startRealtimeUpdates(sensor) {
  if (window.updateInterval) {
    clearInterval(window.updateInterval);
    window.updateInterval = null;
  }

  window.updateInterval = setInterval(() => {
    if (!sensorChart) return;

    const newValue = sensor.value + (Math.random() * 4 - 2);
    const rounded = Math.max(0, Number(newValue.toFixed(1)));
    sensor.value = rounded;

    const valEl = document.getElementById('current-value');
    if (valEl) valEl.textContent = rounded;

    const now = new Date();
    const label = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    sensorChart.data.labels.push(label);
    sensorChart.data.datasets[0].data.push(rounded);

    if (sensorChart.data.labels.length > 24) {
      sensorChart.data.labels.shift();
      sensorChart.data.datasets[0].data.shift();
    }

    sensorChart.update();

    if (typeof checkSensorThresholds === 'function') {
      checkSensorThresholds(sensor);
    }
  }, 5000);
}

// ❌ BỎ đoạn top-level sau (đây là nguyên nhân gây lỗi khi HTML chưa render)
// document.getElementById('back-to-dashboard').addEventListener('click', () => { ... });
