const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('./src/database.js');
const fs = require('fs');
const ExcelJS = require('exceljs');

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
  //win.webContents.openDevTools()

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

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Export',
          click: () => {
            exportToExcel();
          },
        },
        {
          label: 'Exit',
          click: () => {
            app.quit();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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

async function exportToExcel() {
  const articles = await database.fetchArticles();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Articles');

  const headers = ['RG-Nr','Datum', 'ArtikelNr', 'Beschreibung','Listenpreis', 'Nettopreis', 'Anzahl', 'Einheit'  ];
  worksheet.addRow(headers);

  // Populate data from Sequelize into the worksheet
  articles.forEach((article) => {
    worksheet.addRow([
      article.transaction_number,
      article.date,
      article.articleNr,
      article.description,
      article.list_price,
      article.netto_price,
      article.quantity,
      article.unit,
    ]);
  });

  const outputPath = dialog.showSaveDialogSync({
    title: 'Speichere Excel Datei',
    defaultPath: 'bo artikel.xlsx',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] }
    ]
  });

  if (outputPath) {
    workbook.xlsx.writeFile(outputPath)
      .then(() => {
        console.log('Excel file saved successfully.');
      })
      .catch(error => {
        console.error('Error saving Excel file:', error);
      });
  }
}
