const els = {
    welcomeScreen: null,
    chatScreen: null
};
let nickname = '';

const init = () => {
    els.welcomeScreen = document.querySelector('.welcome-screen');
    els.chatScreen = document.querySelector('.chat-screen');

    const socket = io();

    // Prevent the refresh of the page when click on the form button
    els.welcomeScreen.querySelector('form')
        .addEventListener('submit', (e) => {
            e.preventDefault();
        });
    els.chatScreen.querySelector('form')
        .addEventListener('submit', (e) => {
            e.preventDefault();
        });

    const wBtn = els.welcomeScreen.querySelector('button');
    // Same as (but less performant)
    // const wBtn = document.querySelector('.welcome-screen button');
    wBtn.addEventListener('click', () => {
        const inputEl = els.welcomeScreen.querySelector('input');
        if (inputEl.value.length === 0) {
            return;
        }
        nickname = inputEl.value;

        els.welcomeScreen.style.display = 'none';
        els.chatScreen.style.display = 'block';

        els.chatScreen.querySelector('h1').textContent = nickname;
    });

    const cBtn = els.chatScreen.querySelector('button');
    cBtn.addEventListener('click', () => {
        const inputEl = els.chatScreen.querySelector('input');
        if (inputEl.value.length === 0) {
            return;
        }
        const message = inputEl.value;

        socket.emit('message-client', { nickname, message });

        addMessage({ nickname, message, isSender : true });

        inputEl.value = '';
    });

    socket.on('message-server', ({ nickname, message }) => {
        console.log('nickname', nickname);
        console.log('message', message);
        addMessage({ nickname, message, isSender: false });
    });


};

// 1 - Client: Send message to server
// 2 - Server: Listen the message
// 3 - Server: Broadcast the message
// 4 - Client: Listen the broadcasted message
// 5 - Client: Display the message in HTML (not related to socket io)

const addMessage = ({ nickname, message, isSender }) => {
    const el = createMessageEl({ nickname, message, isSender });
    console.log('el', el);

    els.chatScreen.querySelector('ul').appendChild(el);
};

const createMessageEl = ({ nickname, message, isSender }) => {
    const container = document.createElement('li'); // <li></li>
    container.classList.add('message'); // <li class="message"></li>
    if (isSender === true) {
        container.classList.add('sender'); // <li class="message sender"></li>
    }

    const nicknameEl = document.createElement('img');
    nicknameEl.setAttribute('alt', nickname);
    nicknameEl.setAttribute('src', `https://avatars.dicebear.com/v2/human/${nickname}.svg`);

    const messageEl = document.createElement('span');
    messageEl.textContent = message; // <span>{message}</span>

    /**
     * <li class="message">
     *   <span>{nickname}</span>
     *   <span>{message}</span>
     * </li>
     */
    if (isSender === false) {
        container.appendChild(nicknameEl);
    }
    container.appendChild(messageEl);
    if (isSender === true) {
        container.appendChild(nicknameEl);
    }
    
    return container;
};

window.addEventListener('load', init);