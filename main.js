const { app, BrowserWindow, ipcMain, screen, ipcRenderer } = require('electron');

let mainWindow;
let bannerWindows = []; // 存储所有横幅窗口

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js',
      contextIsolation: true,
    },
    // menu bar hide
    autoHideMenuBar: true,
    resizable: false,
  });

  //mainWindow.webContents.openDevTools();

  mainWindow.loadFile('index.html');

  ipcMain.on('get-screens', (event) => {
    const displays = screen.getAllDisplays();
    event.sender.send('screens', displays.map((d, i) => ({
      id: i,
      display: d,
    })));
  });




  let bannerWindow = null;
  let currentScreen = null;

  // 提供状态查询的响应
  ipcMain.handle('get-banner-status', () => {
    return bannerWindow !== null;
  });

  // 更新Banner窗口的大小
  ipcMain.on('banner-size', (event, size) => {
    if (bannerWindow == null) return;
    bannerWindow.setSize(Math.ceil(size.width) + 50, Math.ceil(size.height) + 50);
    // 如果超出屏幕范围则移动到屏幕内
    if (bannerWindow.getPosition()[0] + size.width+50 > currentScreen.workArea.width) {
      bannerWindow.setPosition(Math.ceil(currentScreen.workArea.width - (size.width+50)), bannerWindow.getPosition()[1]);
    }
    if (bannerWindow.getPosition()[1] + size.height+50 > currentScreen.workArea.height) {
      bannerWindow.setPosition(bannerWindow.getPosition()[0], Math.ceil(currentScreen.workArea.height - (size.height+50)));
    }
  });

  ipcMain.on('show-banner', (event, options) => {
    const displays = screen.getAllDisplays();
    const targetDisplay = displays[options.displayIndex];
    if (!targetDisplay) return;
    currentScreen = targetDisplay;
    let screen_width = targetDisplay.workArea.width;
    let screen_height = targetDisplay.workArea.height;
    console.log(screen_width, screen_height);
    // 如果没有打开则创建一个新的横幅窗口
    if (bannerWindow === null) {
      bannerWindow = new BrowserWindow({
        height: 1,
        width: 1,
        x: 50,
        y: 50,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true, // 不显示在任务栏
        type: 'toolbar', // 特定窗口类型，适合在任务栏之上
        transparent: true,
        webPreferences: {
          preload: __dirname + '/preload.js',
          contextIsolation: true,
        },
      });
    }
    console.log("new posisiong", getXY(options.position, bannerWindow.getSize(), targetDisplay));
    bannerWindow.setPosition(getXY(options.position, bannerWindow.getSize(), targetDisplay).x, getXY(options.position, bannerWindow.getSize(), targetDisplay).y);
    // bannerWindow.webContents.openDevTools();

    bannerWindow.loadURL(`data:text/html;charset=utf-8,
        ${encodeURIComponent(`
        <body style="margin: 0; padding: 0; background-color:${options.backgroundColor || 'yellow'};color:${options.color || 'red'};font-size:${options.fontSize || '24px'};font-family:${options.fontFamily || 'Arial'};opacity:0.8;">
          <!-- close button at top right -->
          <div style="position: absolute; top: 0; right: 0; padding: 5px; cursor: pointer;" 
           onclick="window.electron.closeBanners();">
           <span style="font-size: 20px;">&times;</span>
          </div>
          <div id="car-info" style="
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            height: 100%;
          ">
            <span id="car-text"></span>
          </div>
          <script>
            const carList = ${JSON.stringify(options.carList)};
            let currentIndex = 0;
            const carTextElement = document.getElementById('car-text');
      
            function updateCarInfo() {
              const car = carList[currentIndex];
              const text = \`\${car.brand} \${car.model} \${car.color} \${car.license} 挪下车 \`;
              carTextElement.innerHTML = text;
              
              // Update index for next car, loop back to the start if needed
              currentIndex = (currentIndex + 1) % carList.length;

             const size = document.getElementById('car-text').getBoundingClientRect();
              window.electron.updateBannerSize({width: size.width, height: size.height});

            }
      
            // Initial display of the first car info
            updateCarInfo();
            
            // Update every 3 seconds
            setInterval(updateCarInfo, 3000);
          </script>
        </body>
        
        `)}`);

    bannerWindow.on('closed', () => {
      bannerWindow = null;
    });
  });

  ipcMain.on('close-banners', (event) => {
    if (bannerWindow === null) return;
    bannerWindow.close();
    bannerWindow = null;
    //
  });

});

// <option value="top|left">右上方</option>
// <option value="top|center">正上方</option>
// <option value="top|right">左上方</option>
// <option value="center|left">右侧</option>
// <option value="center|center">正中</option>
// <option value="center|right">左侧</option>
// <option value="bottom|left">右下方</option>
// <option value="bottom|center">正下方</option>
// <option value="bottom|right">左下方</option>
const getXY = (position, bannerSize, display) => {

  const [x, y] = position.split('|');
  let posx = 0;
  let posy = 0;
  if (x === 'top') {
    posx = 0;
  }
  if (x === 'center') {
    posx = display.workArea.height / 2 - bannerSize[1] / 2;
  }
  if (x === 'bottom') {
    posx = display.workArea.height - bannerSize[1];
  }
  if (y === 'left') {
    posy = 0;
  }
  if (y === 'center') {
    posy = display.workArea.width / 2 - bannerSize[0] / 2;
  }
  if (y === 'right') {
    posy = display.workArea.width - bannerSize[0];
  }
  if (posx < 0) {
    posx = 0;
  }
  if (posy < 0) {
    posy = 0;

  }
  if (posx + bannerSize[1] > display.workArea.height) {
    posx = display.workArea.height - bannerSize[1];
  }
  if (posy + bannerSize[0] > display.workArea.width) {
    posy = display.workArea.width - bannerSize[0];
  }



  //console.log(position, bannerSize, display, { x: posy, y: posx });
  return { x: Math.ceil(posy), y: Math.ceil(posx) };
}
