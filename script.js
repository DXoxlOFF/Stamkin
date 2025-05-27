document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    checkLearning();
});

function showPopup(type) {
    document.getElementById('loginPopup').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('registerPopup').style.display = type === 'register' ? 'block' : 'none';
}

function closePopup() {
    document.querySelectorAll('.popup-overlay').forEach(p => p.style.display = 'none');
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Простая проверка для примера
    if(username === getCookie('registeredUser') && password === getCookie('userPass')) {
        setCookie('currentUser', username, 7);
        setCookie('currentName', getCookie('registeredName'), 7);
        closePopup();
        checkAuth();
        showNotification('Успешный вход!');
    } else {
        showNotification('Неверные данные!');
    }
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;

    setCookie('registeredUser', username, 7);
    setCookie('userPass', password, 7);
    setCookie('registeredName', name, 7);

    closePopup();
    showNotification('Регистрация успешна!');
}

function checkAuth() {
    const user = getCookie('currentUser');
    if(user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('userSection').style.display = 'flex';
        document.getElementById('userName').textContent = getCookie('currentName');
    } else {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('userSection').style.display = 'none';
    }
}

function logout() {
    setCookie('currentUser', '', -1);
    setCookie('currentName', '', -1);
    setCookie('learningCourse', '', -1);
    checkAuth();
    checkLearning();
    showNotification('Вы вышли из аккаунта');
}

function startLearning(course) {
    if(getCookie('currentUser')) {
        const currentCourse = getCookie('learningCourse');
        if(currentCourse) {
            showNotification('Вы уже изучаете дисциплину!');
        } else {
            setCookie('learningCourse', course, 7);
            checkLearning();
            showNotification('Начато изучение!');
        }
    } else {
        showNotification('Сначала авторизуйтесь!');
    }
}

function checkLearning() {
    const course = getCookie('learningCourse');
    document.querySelectorAll('.course button').forEach(btn => {
        if(btn.getAttribute('onclick').includes(course)) {
            btn.textContent = 'Изучается';
            btn.classList.add('inactive');
            btn.disabled = true;
        } else {
            btn.textContent = 'Учить';
            btn.classList.remove('inactive');
            btn.disabled = false;
        }
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.top = '20px';

    setTimeout(() => {
        notification.style.top = '-100px';
        setTimeout(() => notification.style.display = 'none', 500);
    }, 2000);
}

function showCourseContent(course) {
    const learningCourse = getCookie('learningCourse');
    if(learningCourse === course) {
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('lessonContent').style.display = 'block';
        document.getElementById('lessonTitle').textContent = course;

        const grid = document.getElementById('lessonsGrid');
        grid.innerHTML = '';
        for(let i=1; i<=10; i++) {
            const div = document.createElement('div');
            div.className = 'lesson-item';
            div.textContent = i;
            div.onclick = () => showLessonPopup(i);
            grid.appendChild(div);
        }
    } else {
        showNotification('Сначала начните изучать дисциплину!');
    }
}

function goBack() {
    document.getElementById('lessonContent').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
}

function showLessonPopup(lesson) {
    const popup = document.createElement('div');
    popup.className = 'lesson-popup';
    popup.innerHTML = `
        <h2>Урок ${lesson}</h2>
        <p>Содержимое урока ${lesson}</p>
        <button onclick="this.parentElement.remove()">Закрыть</button>
    `;
    document.body.appendChild(popup);
}
