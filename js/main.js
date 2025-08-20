// Cập nhật thời gian hiện tại
function updateCurrentTime() {
  const el = document.getElementById('current-time');
  if (el && typeof moment !== 'undefined') {
    el.textContent = moment().format('DD/MM/YYYY HH:mm:ss');
  }
}

// Cập nhật thời gian mỗi giây
let _clock = null;
function startClock() {
  if (_clock) clearInterval(_clock);
  updateCurrentTime();
  _clock = setInterval(updateCurrentTime, 1000);
}

// Hiển thị cảnh báo
function showAlert(message, type = 'error') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.textContent = message;
  alertContainer.appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 5000);
}

// Chuyển view
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) target.classList.add('active');
}

// Khởi tạo ứng dụng – CHỈ GỌI TỪ Controller onInit
function initApp() {
  // Giờ
  startClock();

  // Gắn nút Back (sau khi HTML đã render)
  const backBtn = document.getElementById('back-to-dashboard');
  if (backBtn && !backBtn.dataset.bound) {
    backBtn.addEventListener('click', () => {
      // charts.js có thể đang chạy interval → để charts.js tự clear; nếu muốn an toàn:
      if (window.updateInterval) { clearInterval(window.updateInterval); window.updateInterval = null; }
      showView('dashboard-view');
    });
    backBtn.dataset.bound = '1';
  }

  // View mặc định
  showView('dashboard-view');
}

// KHÔNG cần DOMContentLoaded ở môi trường ThingsBoard
// document.addEventListener('DOMContentLoaded', initApp);
