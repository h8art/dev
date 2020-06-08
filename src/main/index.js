import { app, BrowserWindow, Notification, ipcMain } from 'electron'
var schedule = require('node-schedule');
const { format } = require('date-fns');
const { Client } = require('pg')
const axios = require('axios')
const fs = require('fs')
const http = require('http')
const request = require('request')
const username = require('username');
const path = require('path')
var name = '';
const electronDl = require('electron-dl');
const appPath =
  process.env.NODE_ENV === 'production'
    ? `${process.resourcesPath}`
    : __dirname;

var AutoLaunch = require('auto-launch');
 
var minecraftAutoLauncher = new AutoLaunch({
  name: 'РусГидро.Здоровье',
  path: path.join(appPath,'РусГидро.Здоровье.exe'),
});
 
minecraftAutoLauncher.enable();
 
//minecraftAutoLauncher.disable();
 
 
minecraftAutoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
        return;
    }
    minecraftAutoLauncher.enable();
})
.catch(function(err){
    // handle error
});

electronDl();

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
  
const apiUrl = "http://10.101.104.29:8083/"
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

function downloadFile(file_url , targetPath){
  // Save variable to know progress
  var received_bytes = 0;
  var total_bytes = 0;

  var req = request({
      method: 'GET',
      uri: file_url
  });

  var out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on('response', function ( data ) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length' ]);
  });

  req.on('data', function(chunk) {
      // Update the received bytes
      received_bytes += chunk.length;

      showProgress(received_bytes, total_bytes);
  });

  req.on('end', function() {
      alert("File succesfully downloaded");
  });
}

function showProgress(received,total){
  var percentage = (received * 100) / total;
  console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}

global.videoPath = path.resolve(appPath, 'videos')
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
    
    // res.rows.forEach(v => {
  var viddir = path.resolve(appPath, 'videos');
  var videos = [];
  console.log(viddir)
  if(!fs.existsSync(viddir)){
    fs.mkdir(viddir, "0766", function(err){
        if(err){
            console.log(err);
        }
    });
  }
  
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
  axios.get(apiUrl + "api/v1/videos").then( resp => {
    mainWindow = new BrowserWindow({
      height: 10,
      width: 10,
      frame: false,
      show: false 
    })
    mainWindow.hide();
    resp.data.forEach(vid => {
      if (videos.indexOf(vid.ID + ".mp4") == -1) {
        electronDl.download(mainWindow, apiUrl + "upload/" + vid.ID + ".mp4", {
          directory: viddir
        })
        // var file = fs.createWriteStream(path.resolve(viddir, vid.ID + ".mp4") );
        // http.get(apiUrl + "upload/" + vid.ID + ".mp4", function(response) {
        //   response.pipe(file);
        // });
      }
    })
  })
  const today = new Date()
  axios.get(apiUrl + "api/v1/shedule/" +( today.getDay() - 1)).then( resp => {
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
  axios.post(apiUrl + "api/v1/stats", {
    VID: arg,
    Name: name,
    Type: "decline"
  })
});
ipcMain.on('watchedhalf-video', (event, arg) => {
  axios.post(apiUrl + "api/v1/stats", {
    VID: arg.video_id,
    Name: name,
    Type: "decline"
  })
});
ipcMain.on('watchedfull-video', (event, arg) => {
  axios.post(apiUrl + "api/v1/stats", {
    VID: arg,
    Name: name,
    Type: "decline"
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
