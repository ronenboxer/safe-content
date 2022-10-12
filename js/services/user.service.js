'use strict'

const STORAGE_KEY = 'userDB'

var gUsers
const gUsersImgs = [
    '<img src="imgs/1.png">',
    '<img src="imgs/2.png">',
    '<img src="imgs/3.png">',
    '<img src="imgs/4.png">',
    '<img src="imgs/5.png">',
    '<img src="imgs/6.png">',
    '<img src="imgs/7.png">',
    '<img src="imgs/8.png">',
    '<img src="imgs/9.png">'
]

function _makeId(length = 5) {
    var txt = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return txt;
}

function _getRandomImg() {
    const index = parseInt(Math.random() * (gUsersImgs.length))
    return gUsersImgs[index]
}

function createUsers() {
    var users = loadFromStorage(STORAGE_KEY)

    if (!users || !users.length) users = [{
        id: _makeId(),
        username: 'puki',
        password: 'secret',
        lastLoginTime: Date.now()-1111111,
        isAdmin: false,
        img: _getRandomImg()
    },
    {
        id: _makeId(),
        username: 'muki',
        password: 'public',
        lastLoginTime: Date.now()-44444444,
        isAdmin: false,
        img: _getRandomImg()
    },
    {
        id: _makeId(),
        username: 'yaron',
        password: 'biton',
        lastLoginTime: Date.now()-77777777,
        isAdmin: true,
        img: _getRandomImg()
    },
    {
        id: _makeId(),
        username: 'luki',
        password: 'secret2',
        lastLoginTime: Date.now()-999999,
        isAdmin: false,
        img: _getRandomImg()
    }]
    gUsers = users
    _saveUsers()
}

function _saveUsers() {
    saveToStorage(STORAGE_KEY, gUsers)
}

function getUsersToShow(sortKey) {
    const users = loadFromStorage(STORAGE_KEY)
    if (!sortKey) return users
    users.sort((user1, user2) => {
        if (sortKey === 'time') return user2.lastLoginTime - user1.lastLoginTime
        if (user1.username > user2.username) return 1
        if (user1.username < user2.username) return -1
        return 0
    })
    return users
}
function doLogin(username, password) {
    const user = gUsers.find(user => user.username === username && user.password === password)
    if (!user) return null
    user.lastLoginTime = Date.now()
    _saveUsers()
    saveToStorage('currUser', user)
    return user
}

function getCurrUser() {
    return loadFromStorage('currUser')
}

function setCurrUser(user){
    saveToStorage('currUser', user)
}

function _createUser(username, password) {
    gUsers.push({
        username,
        password,
        id: _makeId(),
        isAdmin: false,
        img: _getRandomImg()
    })
    _saveUsers()
}

function toggleAdmin(id) {
    createUsers()
    const user = gUsers.find(user => user.id === id)
    if (user.isAdmin && isLastAdmin()) return alert('Cannot remove last remaning admin')
    user.isAdmin = !user.isAdmin
    _saveUsers()
}

function removeUser(id) {
    createUsers()
    const userIdx = gUsers.findIndex(user => user.id === id)
    if (gUsers[userIdx].isAdmin && isLastAdmin()) return alert('Cannot remove last remaning admin')
    gUsers.splice(userIdx, 1)[0]
    _saveUsers()
}

function isLastAdmin() {
    return (gUsers.reduce((adminCount, user) => {
        if (user.isAdmin) adminCount++
        return adminCount
    }, 0) === 1)
}