const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getScreens: () => ipcRenderer.send('get-screens'),
  onScreens: (callback) => ipcRenderer.on('screens', (event, screens) => callback(screens)),
  
  showBanner: (options) => ipcRenderer.send('show-banner', options),
  closeBanners: () => ipcRenderer.send('close-banners'),
  updateBannerSize: (size) => ipcRenderer.send('banner-size', size),
  onBannerSize: (callback) => ipcRenderer.on('banner-size', (event, size) => callback(size)),

  getBannerStatus: async () => {
    return await ipcRenderer.invoke('get-banner-status');
  },

});
