const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./src/database.js');

const database = new Database();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/preload.js'),
    },
  });
  database.sync();
  // win.webContents.openDevTools()

ipcMain.on('saveArticle', async(event, obj) => {
    try {
      await database.saveArticle(obj)
      await loadArticles(win);
    } catch (error) {
      console.error('Error saving article:', error);
    }
})

ipcMain.on('deleteArticle', async(event, id) => {
    try {
      await database.deleteArticle(id)
      await loadArticles(win);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
})

win.webContents.on('did-finish-load', async() => {
    try{
        loadArticles(win);
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
});

  win.loadFile('html/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function loadArticles(window) {
    try {
    const data = await database.fetchArticles();
    window.webContents.send('articles', data);
    } catch (error) {
    console.error('Error fetching contacts:', error);
    }
}
