# MoveOutYourCar  

**MoveOutYourCar** 是一款用于大型聚会中，通过投影屏幕实时显示车牌信息和提示的工具。它帮助车主快速识别并挪动车辆，从而缓解堵车现象，提高活动效率。

---

## 功能特点  
- 实时显示车辆信息（品牌、型号、颜色、车牌号）。  
- 支持自定义通知样式，包括颜色、字体、大小等。  
- 支持平滑滚动或定时切换车牌信息的显示方式。  
- 支持多屏幕投影，适应不同场景需求。  

---

## 环境需求  
### 开发环境  
- Node.js (版本 16.x 或更高)  
- npm (随 Node.js 一起安装)  

### 依赖库  
- Electron (用于构建桌面应用)  
- Tailwind CSS (用于前端样式)  

---

## 如何编译  

### 1. 克隆项目  
使用以下命令克隆仓库到本地：  
```bash  
git clone https://github.com/Cecpadua/MoveOutYourCar.git  
cd MoveOutYourCar  
```  

### 2. 安装依赖  
运行以下命令安装项目依赖：  
```bash  
npm install  
```  


### 3. 编译为可执行文件  
运行以下命令将项目编译为桌面应用：  
```bash  
npm run package -- --arch="x64"
```  
编译完成后，可执行文件会出现在 `dist/` 文件夹中。  

---

## 贡献  
如果你有改进建议或发现了 Bug，欢迎提交 Issue 或创建 Pull Request！  

---

## 许可证  
本项目基于 [MIT 许可证](LICENSE)。  