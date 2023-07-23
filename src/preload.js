const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["saveArticle", "deleteArticle"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            } else {
                console.log('blocked send channel: ' + channel)
            }
        },
        receive: (channel, func) => {
            let validChannels = ["articles"];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            } else {
                console.log('blocked receive channel: ' + channel)
            }
        }
    }
);