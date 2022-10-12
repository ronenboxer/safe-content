'use strict'

function onInit() {
    document.querySelector('body').innerHTML = `<section class="sign-in"><div class="header">Sign in</div>
    <form>
        Username <br>
        <input type="text" name="username" placeholder="Enter Username" /> <br>
        Password <br>
        <input type="password" name="password" placeholder="Enter Password" /> <br>
        <button onclick="onLogin(event)">Login</button><br>
        <button onclick="onSignup()">Signup</button>
    </form></section>`
    document.querySelector('body').classList.remove('logged-in')
    createUsers()
}

function onLogin(ev) {
    // ev.preventDefault()
    const username = document.querySelector(`[name=username]`).value
    const password = document.querySelector(`[name=password]`).value
    const user = doLogin(username, password)
    if (!user || !password ||
        !username) return alert('Wrong username/password')
    showContent()
}

function showContent() {
    const user = getCurrUser()
    document.querySelector('body').innerHTML = `
    <section class="user-card ${user.id}">
        <span>${user.username}</span>
        <span>${user.img}</span>
        <div class="user-info ${user.id}">
        <span>id: ${user.id}</span>
        <span>password: ${user.password}</span>
        <span>${user.isAdmin ? "" : "not"} admin</span>
        </div>
        <button onclick="ontRemoveUser('${user.id}')">Delete profile</button>
        <button onclick="onLogout()">Logout</button>
    ${(user.isAdmin) ? `<button onclick="onGoToAdmin()">Manage</button>` : ``}
        </section>`
    document.querySelector('body').classList.add('logged-in')
}

function onGoToAdmin() {
    window.location.href = `admin.html`
}

function onLogout(){
    setCurrUser(null)
    window.location.href = `index.html`
}

function onSignup() {
    document.querySelector('body').innerHTML = `<section class="sign-up"><div class="header">Sign up</div>
    <form onsubmit=checkUserDetails(event)>
        Username<br>
        <input type="txt" name="username" placeholder="4-10 chars, letters only" /> <br>
        Password
        <input type="password" name="password" placeholder="6-8 chars, letters and numbers" /> <br>
        <input type="password" name="password-validate" placeholder="Repeat Password" /> <br>
        <button>Create Porfile</button>`
}

function checkUserDetails(ev) {
    ev.preventDefault()
    const username = document.querySelector('[name=username]').value
    const password = document.querySelector('[name=password]').value
    const passwordValidate = document.querySelector('[name=password-validate]').value
    if (!password || !username) return
    if (!isUsernameLegal(username)) return alert('Illegal username')
    const users = getUsersToShow()
    if (users.find(user => user.username === username)) return alert('Username already taken')
    if (!isPasswordLegal(password)) return alert('Illegal password')
    if (password !== passwordValidate) return alert(`Passwords don't match`)
    _createUser(username, password)
    alert(`Profile created successfully`)
    onInit()
}

function isPasswordLegal(password) {
    const numbers = '0987654321'
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    return (password.length <= 8 && password.length >= 6 &&
        password.split(``).some(char => numbers.includes(char)) &&
        password.split('').some(char => letters.includes(char)))
}

function isUsernameLegal(username) {
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    return (username.length >= 4 && username.length <= 10 &&
        username.split('').every(char => letters.includes(char.toLowerCase())))
}

function ontRemoveUser(id) {
    if (confirm('Are you sure about this?'))
    removeUser(id)
}