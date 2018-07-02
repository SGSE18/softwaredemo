import { Message } from 'shared';

window.addEventListener('message', (event) => {
    if (event.source !== window)
        return;

    let msg = event.data as Message;

    if (msg.target !== 'fcontent')
        return;

    msg.url = window.location.href;

    chrome.runtime.sendMessage(msg, (response) => {
        let resMsg: Message = {
            fcn: msg.fcn,
            params: response
        };
        _sendMessage(resMsg);
    });
});


chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
    _sendMessage(msg);
    return false;
});

function _sendMessage(msg: Message) {
    msg.target = 'finpage';
    window.postMessage(msg, '*');
}