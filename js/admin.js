'use strict'
var gIsTableViewModeOn
var gSortBy

function onInit() {
    const currUser = getCurrUser()
    if (!currUser || !currUser.isAdmin) window.location.href = `index.html`
    gIsTableViewModeOn = true
    renderTable()
}

function renderTable(sortBy = null) {
    const users = getUsersToShow(sortBy)
    document.querySelector('body').innerHTML = getHeaderHTML() + `
    <table>
        <thead></thead>
        <tbody></tbody>
    </table>`
    document.querySelector('thead').innerHTML = `
    <th>userName</th>
        <th>password</th>
        <th>lastLoginTime</th>
        <th>isAdmin</th>
        <th>toggleAdmin</th>
        <th>remove</th>`
    var tbodyHTML = ''
    users.forEach(user => {
        tbodyHTML += `<tr><td>${user.username}</td>
        <td>${user.password}</td>
        <td>${dateToString(user.lastLoginTime)}</td>
        <td>${user.isAdmin}</td>
        <td><button onclick="onToggleAdmin('${user.id}')">
        ${user.isAdmin ? 'Make regular' : 'Make admin'}</button></td>
        <td><button onclick="ontRemoveUser('${user.id}')">X</button></td></tr>`
    })
    document.querySelector('tbody').innerHTML = tbodyHTML
}

function renderCards(sortBy = null) {
    const users = getUsersToShow(sortBy)
    document.querySelector('body').innerHTML = getHeaderHTML() + `
    <secion class="cards-container"></secion>`
    var cardsHTML = ''
    users.forEach(user => {
        cardsHTML += `<div class="user-card ${user.id}">
        <span>${user.username}</span>
        <span>${user.img}</span>
        <div class="user-info ${user.id}">
        <span>id: ${user.id}</span>
        <span>login: ${dateToString(user.lastLoginTime)}</span>
        <span>password: ${user.password}</span>
        <span>${user.isAdmin ? "" : "not"} admin</span>
        </div>
        <button onclick="onToggleAdmin('${user.id}')">
        ${user.isAdmin ? 'Make regular' : 'Make admin'}</button>
        <button onclick="ontRemoveUser('${user.id}')">X</button></div>`
    })
    document.querySelector('.cards-container').innerHTML = cardsHTML
}

function onToggleAdmin(id) {
    if (confirm('Are you sure about this?'))
        toggleAdmin(id)
    if (!gIsTableViewModeOn) renderCards()
    else renderTable()
}

function ontRemoveUser(id) {
    if (confirm('Are you sure about this?'))
        removeUser(id)
    if (!gIsTableViewModeOn) renderCards()
    else renderTable()
}

function onToggleViewMode() {
    gIsTableViewModeOn = !gIsTableViewModeOn
    if (!gIsTableViewModeOn) renderCards()
    else renderTable()
}

function onLogout() {
    setCurrUser(null)
    window.location.href = `index.html`
}

function getHeaderHTML(){
    const currUser = getCurrUser()
    return `<h1>Hello ${currUser.username} <section class="sort">
    <select onchange="onSort(this.value)">
        <option value=null>Sort</option>
        <option value="">Auto</option>
        <option value="name">Name</option>
        <option value="time">Last logged in</option>

    </select>
</section></h1>
    <section class="control"><button class="users-display" onclick="onToggleViewMode()">
    <iconify-icon inline icon="carbon:table-split" width="45" class="on"></iconify-icon>
    <iconify-icon inline icon="ph:squares-four-fill" width="45"></iconify-icon></button>
    <button class="logout" onclick="onLogout()">Logout</button></section>`
}

function onSort(sortBy){
    gSortBy = sortBy
    if (!gIsTableViewModeOn) renderCards(sortBy)
    else renderTable(sortBy)
}

function dateToString(ms){
    const dateStr = Date(ms)
    const idxToSlice = dateStr.indexOf('GMT')
    return dateStr.slice(4,idxToSlice)
}