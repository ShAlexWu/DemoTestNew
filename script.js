// DOM 元素
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageIcon = document.getElementById('messageIcon');

// 使用 localStorage 存储用户数据（仅用于演示）
const STORAGE_KEY = 'users';

// 初始化：从 localStorage 获取用户数据
function getUsers() {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

// 保存用户数据到 localStorage
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// 切换表单显示
function switchForm(showLogin) {
    if (showLogin) {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
    clearMessages();
}

// 显示消息
function showMessage(text, isSuccess = true) {
    messageText.textContent = text;
    messageBox.className = `message-box ${isSuccess ? 'success' : 'error'}`;
    messageIcon.textContent = isSuccess ? '✓' : '✗';
    messageBox.classList.remove('hidden');
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

// 清除错误消息
function clearMessages() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// 验证邮箱格式
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 验证用户名（至少3个字符，只能包含字母、数字和下划线）
function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,}$/;
    return re.test(username);
}

// 登录表单提交
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!username || !password) {
        showMessage('请填写所有字段', false);
        loginFormElement.classList.add('shake');
        setTimeout(() => loginFormElement.classList.remove('shake'), 500);
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
        }
        showMessage(`欢迎回来，${username}！登录成功`, true);
        setTimeout(() => {
            loginFormElement.reset();
        }, 2000);
    } else {
        showMessage('用户名或密码错误', false);
        loginFormElement.classList.add('shake');
        setTimeout(() => loginFormElement.classList.remove('shake'), 500);
    }
});

// 注册表单提交
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessages();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let hasError = false;
    
    // 验证用户名
    if (!username) {
        document.getElementById('usernameError').textContent = '请输入用户名';
        hasError = true;
    } else if (!validateUsername(username)) {
        document.getElementById('usernameError').textContent = '用户名至少3个字符，只能包含字母、数字和下划线';
        hasError = true;
    }
    
    // 验证邮箱
    if (!email) {
        document.getElementById('emailError').textContent = '请输入邮箱';
        hasError = true;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = '请输入有效的邮箱地址';
        hasError = true;
    }
    
    // 验证密码
    if (!password) {
        document.getElementById('passwordError').textContent = '请输入密码';
        hasError = true;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = '密码至少需要6个字符';
        hasError = true;
    }
    
    // 验证确认密码
    if (!confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = '请确认密码';
        hasError = true;
    } else if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = '两次输入的密码不一致';
        hasError = true;
    }
    
    if (hasError) {
        registerFormElement.classList.add('shake');
        setTimeout(() => registerFormElement.classList.remove('shake'), 500);
        return;
    }
    
    // 检查用户名是否已存在
    const users = getUsers();
    if (users.find(u => u.username === username)) {
        document.getElementById('usernameError').textContent = '该用户名已被使用';
        registerFormElement.classList.add('shake');
        setTimeout(() => registerFormElement.classList.remove('shake'), 500);
        return;
    }
    
    // 检查邮箱是否已存在
    if (users.find(u => u.email === email)) {
        document.getElementById('emailError').textContent = '该邮箱已被注册';
        registerFormElement.classList.add('shake');
        setTimeout(() => registerFormElement.classList.remove('shake'), 500);
        return;
    }
    
    // 注册成功
    const newUser = {
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    showMessage(`注册成功！欢迎，${username}`, true);
    
    setTimeout(() => {
        registerFormElement.reset();
        switchForm(true); // 切换到登录页面
    }, 2000);
});

// 切换表单事件
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(false);
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(true);
});

// 实时验证
document.getElementById('registerUsername').addEventListener('blur', function() {
    const username = this.value.trim();
    const errorEl = document.getElementById('usernameError');
    
    if (!username) {
        errorEl.textContent = '';
        return;
    }
    
    if (!validateUsername(username)) {
        errorEl.textContent = '用户名至少3个字符，只能包含字母、数字和下划线';
    } else {
        const users = getUsers();
        if (users.find(u => u.username === username)) {
            errorEl.textContent = '该用户名已被使用';
        } else {
            errorEl.textContent = '';
        }
    }
});

document.getElementById('registerEmail').addEventListener('blur', function() {
    const email = this.value.trim();
    const errorEl = document.getElementById('emailError');
    
    if (!email) {
        errorEl.textContent = '';
        return;
    }
    
    if (!validateEmail(email)) {
        errorEl.textContent = '请输入有效的邮箱地址';
    } else {
        const users = getUsers();
        if (users.find(u => u.email === email)) {
            errorEl.textContent = '该邮箱已被注册';
        } else {
            errorEl.textContent = '';
        }
    }
});

document.getElementById('registerPassword').addEventListener('blur', function() {
    const password = this.value;
    const errorEl = document.getElementById('passwordError');
    
    if (!password) {
        errorEl.textContent = '';
        return;
    }
    
    if (password.length < 6) {
        errorEl.textContent = '密码至少需要6个字符';
    } else {
        errorEl.textContent = '';
    }
});

document.getElementById('confirmPassword').addEventListener('blur', function() {
    const confirmPassword = this.value;
    const password = document.getElementById('registerPassword').value;
    const errorEl = document.getElementById('confirmPasswordError');
    
    if (!confirmPassword) {
        errorEl.textContent = '';
        return;
    }
    
    if (password !== confirmPassword) {
        errorEl.textContent = '两次输入的密码不一致';
    } else {
        errorEl.textContent = '';
    }
});

// 更新时间显示
function updateTime() {
    const timeDisplay = document.getElementById('timeDisplay');
    if (!timeDisplay) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekday}`;
    timeDisplay.innerHTML = `当前时间：<span class="time-text">${timeString}</span>`;
}

// 页面加载时检查是否有记住的用户并启动时间更新
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('loginUsername').value = user.username;
        document.getElementById('rememberMe').checked = true;
    }
    
    // 初始化时间显示
    updateTime();
    // 每秒更新时间
    setInterval(updateTime, 1000);
});

