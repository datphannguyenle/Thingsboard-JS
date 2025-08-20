// Cấu hình kết nối ThingsBoard
const thingsboardConfig = {
    serverUrl: 'http://localhost:8080', // URL của ThingsBoard server
    username: 'tenant@thingsboard.org', // Tên đăng nhập mặc định
    password: 'tenant', // Mật khẩu mặc định
    token: null // Token sẽ được cập nhật sau khi đăng nhập
};

// Đăng nhập vào ThingsBoard
async function loginToThingsBoard() {
    try {
        const response = await fetch(`${thingsboardConfig.serverUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: thingsboardConfig.username,
                password: thingsboardConfig.password
            })
        });

        if (response.ok) {
            const data = await response.json();
            thingsboardConfig.token = data.token;
            console.log('Đăng nhập ThingsBoard thành công');
            return true;
        } else {
            console.error('Đăng nhập ThingsBoard thất bại:', await response.text());
            return false;
        }
    } catch (error) {
        console.error('Lỗi khi đăng nhập ThingsBoard:', error);
        return false;
    }
}

// Lấy dữ liệu từ ThingsBoard
async function fetchDeviceData(deviceId) {
    if (!thingsboardConfig.token) {
        const loginSuccess = await loginToThingsBoard();
        if (!loginSuccess) return null;
    }

    try {
        const response = await fetch(`${thingsboardConfig.serverUrl}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${thingsboardConfig.token}`
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Lấy dữ liệu thiết bị thất bại:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thiết bị:', error);
        return null;
    }
}

// Gửi lệnh điều khiển đến ThingsBoard
async function sendCommand(deviceId, command) {
    if (!thingsboardConfig.token) {
        const loginSuccess = await loginToThingsBoard();
        if (!loginSuccess) return false;
    }

    try {
        const response = await fetch(`${thingsboardConfig.serverUrl}/api/plugins/rpc/twoway/${deviceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${thingsboardConfig.token}`
            },
            body: JSON.stringify(command)
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Gửi lệnh điều khiển thất bại:', await response.text());
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi gửi lệnh điều khiển:', error);
        return null;
    }
}

// Đăng ký widget với ThingsBoard
function registerWidgetWithThingsBoard() {
    // Hàm này sẽ được triển khai khi tích hợp với ThingsBoard
    console.log('Đăng ký widget với ThingsBoard');
}

// Khởi tạo kết nối ThingsBoard khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra xem có đang chạy trong ThingsBoard không
    if (window.self !== window.top) {
        console.log('Đang chạy trong iframe của ThingsBoard');
        // Đăng ký widget với ThingsBoard
        registerWidgetWithThingsBoard();
    } else {
        console.log('Đang chạy độc lập, không phải trong ThingsBoard');
    }
});