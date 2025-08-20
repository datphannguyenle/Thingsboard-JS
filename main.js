// Cập nhật thời gian hiện tại
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    currentTimeElement.textContent = moment().format('DD/MM/YYYY HH:mm:ss');
}

// Cập nhật thời gian mỗi giây
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Hiển thị cảnh báo
function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alert-container');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    alertContainer.appendChild(alertElement);
    
    // Tự động xóa cảnh báo sau 5 giây
    setTimeout(() => {
        alertElement.remove();
    }, 5000);
}

// Chuyển đổi giữa các view
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }
}

// Xử lý nút quay lại dashboard
document.getElementById('back-to-dashboard').addEventListener('click', () => {
    showView('dashboard-view');
});

// Khởi tạo ứng dụng
function initApp() {
    // Hiển thị view mặc định
    showView('dashboard-view');
}

// Khởi chạy ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', initApp);