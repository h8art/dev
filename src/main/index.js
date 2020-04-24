import { app, BrowserWindow, Notification, ipcMain } from 'electron'
var schedule = require('node-schedule');
const { format } = require('date-fns');
const { Client } = require('pg')
const axios = require('axios')
const fs = require('fs')
const http = require('http')
const username = require('username');
const path = require('path')
var name = '';
const {download} = require('electron-dl');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
function callNotification(){
  
}
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const apiUrl = "http://91.134.24.233:8083/"
function createVideoWindow () {
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false
  })

  mainWindow.loadURL(winURL + "#/notification")
  mainWindow.on('closed', () => {
    mainWindow = null
    setTimeout(()=> {
      const notif={
        title: 'РусГидро.Здоровье',
        body: 'Пришло время пройти зарядку'
      };
      var notific = new Notification(notif)
      
      notific.show()
      notific.on('click', function() {
        if (mainWindow!=null) {
          mainWindow.loadURL(winURL + "#/notification")
        }else {
          createVideoWindow()
        }
      })
    },10000)
  })
}
global.videoPath = path.resolve(__dirname, 'videos')
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required")
function initPrc () {

  // const client = new Client({
  //   user: 'mss',
  //   host: '10.101.104.81',
  //   database: 'jerks',
  //   password: 'Abc123',
  //   port: 5432,
  // })
  // client.connect()
  // client.query('SELECT * from video', (err, res) => {
    
  //   res.rows.forEach(v => {
  
  var videos = [];
  var viddir = path.resolve(__dirname, 'videos');
  fs.readdir(viddir, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        videos.push(file)
    });
  });
  // axios.get(apiUrl + "api/v1/videos").then( resp => {
  //   mainWindow = new BrowserWindow({
  //     height: 10,
  //     width: 10,
  //     frame: false,
  //     show: false 
  //   })
  //   mainWindow.hide();
  //   resp.data.forEach(vid => {
  //     if (videos.indexOf(vid.ID + ".mp4") == -1) {
  //       var file = fs.createWriteStream(app.getDataPath() + "videos/" + vid.ID + ".mp4");
  //       var request = http.get(apiUrl + "upload/" + vid.ID + ".mp4", function(response) {
  //         response.pipe(file);
  //       });
  //     }
  //   })
  // })
  const today = new Date()
  axios.get(apiUrl + "api/v1/shedule/" + today.getDay()).then( resp => {
    resp.data.forEach(v => {
      console.log(v)
      schedule.scheduleJob(`${v.Time.split(":").reverse().join(" ")} * * *`, function(){
        mainWindow = new BrowserWindow({
          height: 263,
          useContentSize: true,
          width: 500,
          resizable: false,
          frame: false,
          alwaysOnTop: true,
          visibleOnAllWorkspaces: true,
          center: true,
          webPreferences: {
            webSecurity: false
          }
        })
        
        mainWindow.loadURL(winURL + "#/notification?video_id=" + v.VideoID)
        mainWindow.on('closed', () => {
          mainWindow = null
        })
      })
    })
    // client.end()
  })
  
}

app.on('ready', initPrc)

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

app.on('activate', () => {
  if (mainWindow === null) {
    initPrc()
  }
})

ipcMain.on('open-video', (event, arg) => {
  var d = Date(Date.now()); 
  
  // Converting the number of millisecond in date string 
  var a = d.toString()
  var vidWindow = new BrowserWindow({
    height: 540,
    width: 960,
    webSecurity: false,
    webPreferences: {
      webSecurity: false
    }
  });
  
  vidWindow.loadURL(winURL + "#/video/" + arg)
  vidWindow.maximize()
});
ipcMain.on('declined-video', (event, arg) => {
  const d = new Date()
  const text = 'INSERT INTO stats(username, date, status, video_id) VALUES($1, $2, $3, $4)'
  const values = [name, format(d, "dd/MM/yyyy HH:mm:ss"), "decline", arg]
  const client = new Client({
    user: 'mss',
    host: '10.101.104.81',
    database: 'jerks',
    password: 'Abc123',
    port: 5432,
  })
  client.connect()
  client.query(text, values, (err, res) => {
    client.end()
  })
});
ipcMain.on('watchedhalf-video', (event, arg) => {
  const d = new Date()
  const text = 'INSERT INTO stats(username, date, status, time, video_id) VALUES($1, $2, $3, $4, $5)'
  const values = [name, format(d, "dd/MM/yyyy HH:mm:ss"), "half", arg.time, arg.video_id]
  const client = new Client({
    user: 'mss',
    host: '10.101.104.81',
    database: 'jerks',
    password: 'Abc123',
    port: 5432,
  })
  client.connect()
  client.query(text, values, (err, res) => {
    client.end()
  })
});
ipcMain.on('watchedfull-video', (event, arg) => {
  const d = new Date()
  const text = 'INSERT INTO stats(username, date, status, video_id) VALUES($1, $2, $3, $4)'
  const values = [name, format(d, "dd/MM/yyyy HH:mm:ss"), "full", arg]
  const client = new Client({
    user: 'mss',
    host: '10.101.104.81',
    database: 'jerks',
    password: 'Abc123',
    port: 5432,
  })
  client.connect()
  client.query(text, values, (err, res) => {
    client.end()
  })
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
