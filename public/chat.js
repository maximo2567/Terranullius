const msg = document.getElementById("msg")
const form = document.querySelector("form")
const chatBox = document.querySelector('.chatbox')
const activeUsers = document.querySelector('.activeUsers')
const tone = document.getElementById("myAudio"); 
const {userName} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
var currentUserId = ''

const socket = io()

socket.emit('newUser', userName)

socket.on('userId', id => {
    currentUserId = id;
})

socket.on('msgFromServer', data => {
    displayMsg(data)
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on('updateActiveUser', data => {
    addActiveUser(data)
})

function displayMsg(data) {
    if (typeof data.userName !== 'undefined') {
        const div = document.createElement('div')
        div.classList.add('chatMsg')
    
        div.innerHTML = `<h1 id="userName"><strong>${data.userName} ${Date(data.time).toString().split(' ')[4]}</strong></h1>
        <br>
        <p>${data.msg}</p>`
    
      chatBox.appendChild(div);
      if (currentUserId !== data.id) {
        playAudio()
      }
    }
}

function addActiveUser(data) {
    console.log("here")
    const li = document.createElement('li')
    li.innerHTML = ""
    for (let eachUser in data) {
        li.innerHTML += `<li> <img src="online.png" class="online-logo"> ${data[eachUser]}</li>`
    }
    activeUsers.innerHTML = ''
    activeUsers.appendChild(li)
}

function playAudio() { 
    tone.play(); 
}

form.addEventListener("submit", e => {
    e.preventDefault()
    const data = {
        msg: msg.value,
        userName: userName,
        id: currentUserId
    }
    socket.emit('msgFromUser', data)
    form.reset()
})