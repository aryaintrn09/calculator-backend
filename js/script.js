document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const calcForm = document.getElementById('calc-form');
    const showHistoryButton = document.getElementById('show-history');
    const logoutButton = document.getElementById('logout');
    const loginRegisterDiv = document.getElementById('login-register');
    const calculatorDiv = document.getElementById('calculator');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    function showLogin() {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('register-section').style.display = 'none';
        loginRegisterDiv.style.display = 'block';
        calculatorDiv.style.display = 'none';
    }

    function showRegister() {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('register-section').style.display = 'block';
        loginRegisterDiv.style.display = 'block';
        calculatorDiv.style.display = 'none';
    }

    function showCalculator() {
        loginRegisterDiv.style.display = 'none';
        calculatorDiv.style.display = 'block';
    }

    function login(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('backend/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                showCalculator();
            } else {
                alert(data.message);
            }
        });
    }

    function register(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        fetch('backend/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === 'User registered successfully') {
                alert('Registration successful! Please log in.');
                showLogin();
            } else {
                alert(data.message);
            }
        });
    }

    function calculate(event) {
        event.preventDefault();
        const expression = document.getElementById('expression').value;
        const token = localStorage.getItem('token');

        fetch('backend/calculate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, calculation: expression })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('result').textContent = `Result: ${data.result}`;
        });
    }

    function showHistory() {
        const token = localStorage.getItem('token');

        fetch(`backend/history.php?token=${token}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('history').innerHTML = data.history.map(calc => `<p>${calc}</p>`).join('');
        });
    }

    function logout() {
        localStorage.removeItem('token');
        showLogin();
    }

    showRegisterLink.addEventListener('click', showRegister);
    showLoginLink.addEventListener('click', showLogin);
    loginForm.addEventListener('submit', login);
    registerForm.addEventListener('submit', register);
    calcForm.addEventListener('submit', calculate);
    showHistoryButton.addEventListener('click', showHistory);
    logoutButton.addEventListener('click', logout);

    if (localStorage.getItem('token')) {
        showCalculator();
    } else {
        showLogin();
    }
});
