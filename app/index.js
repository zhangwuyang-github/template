const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let win;

const devUrl = "http://localhost:3000";
const localUrl = `file://${path.resolve(
  __dirname,
  "../../app.asar/build"
)}/index.html`;
const appUrl = isDev ? devUrl : localUrl;

function createWindow() {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 1000,
    height: 700,
  });

  // 然后加载应用的 index.html。
  win.loadURL(appUrl);

  // 当 window 被关闭，这个事件会被触发。
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

// 当全部窗口关闭时退出。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
