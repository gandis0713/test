import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { EventEmitter } from 'events';
let winSecond = undefined;

//윈도우 객체의 전역으로 선언합니다. 그렇지 않으면 윈도우가 자동으로 닫는다.
//자바 스크립트 객체가 가비지 수집 될 때 자동으로 닫는다.

function createWindow() {
  // 브라우저 창을 만듭니다.
  console.log('create11111111 window');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      webSecurity: false,
    },
  });

  console.log('create window');

  //index.html를 로드합니다.
  // win.loadURL('https://prod.dentasssssslclever.com/signIn');
  // win.loadURL('https://prod.dentalclever.com/signIn');
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // 개발툴을 사용하기 위해 오픈한다.
  win.webContents.openDevTools();

  // 윈도우가 닫힐 때 발생되는 이벤트다.
  win.on('closed', () => {
    // win = null
    console.log('close window');
  });
  win.removeMenu();
  win.webContents.on(
    'new-window',
    (
      event: Electron.NewWindowWebContentsEvent,
      url,
      frameName,
      disposition,
      options: Electron.BrowserWindowConstructorOptions,
      additionalFeatures,
      referrer,
      postBody
    ) => {
      event.preventDefault();
      if (winSecond === undefined) {
        winSecond = new BrowserWindow(options);
        winSecond.once('ready-to-show', () => winSecond.show());
        winSecond.webContents.on(
          'did-fail-load',
          (
            event,
            errorCode,
            errorDescription,
            validatedURL,
            isMainFrame,
            frameProcessId,
            frameRoutingId
          ) => {
            event.preventDefault();
            console.log('winSecond evert : ', event);
            console.log('winSecond errorCode : ', errorCode);
            console.log('winSecond errorDescription : ', errorDescription);
            console.log('winSecond validatedURL : ', validatedURL);
            console.log('winSecond isMainFrame : ', isMainFrame);
            console.log('winSecond frameProcessId : ', frameProcessId);
            console.log('winSecond frameRoutingId : ', frameRoutingId);
          }
        );

        if (postBody != null) {
          const loadOptions = {
            httpReferrer: referrer,
            postData: undefined,
            extraHeaders: undefined,
          };
          const { contentType, boundary } = postBody;
          loadOptions.postData = postBody.data;
          loadOptions.extraHeaders = `content-type: ${contentType}; boundary=${boundary}`;

          winSecond.loadURL(url, loadOptions); // existing webContents will be navigated automatically
        } else {
          winSecond.loadURL(url, { httpReferrer: referrer });
        }

        winSecond.webContents.openDevTools();
        winSecond.removeMenu();
        event.newGuest = winSecond;
      }
    }
  );

  win.webContents.on(
    'did-fail-load',
    (
      event,
      errorCode,
      errorDescription,
      validatedURL,
      isMainFrame,
      frameProcessId,
      frameRoutingId
    ) => {
      event.preventDefault();
      console.log('win evert : ', event);
      console.log('win errorCode : ', errorCode);
      console.log('win errorDescription : ', errorDescription);
      console.log('win validatedURL : ', validatedURL);
      console.log('win isMainFrame : ', isMainFrame);
      console.log('win frameProcessId : ', frameProcessId);
      console.log('win frameRoutingId : ', frameRoutingId);
    }
  );
}

//사용 준비가 완료되면 윈도우를 연다.
app.on('ready', createWindow);

// 모든 창이 닫히면 종료한다.
app.on('window-all-closed', () => {
  console.log('app.on window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS에서 독 아이콘이 클릭되고 다른 창은 열리지 않는다.
  console.log('app.on activate');
});

const myEmitter = new EventEmitter();
//message가 event인 이벤트를 등록한다.
myEmitter.on('event', () => {
  console.log('A');
});

//message가 event인 이벤트를 발생한다.
myEmitter.emit('event');

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg); // arg 내용이 출력된다.
  event.sender.send('asynchronous-reply', 'pong'); // 비동기 메시지를 전송한다.
});

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg); // arg 내용이 출력된다.
  event.returnValue = 'pong'; // 동기 메시지를 전송한다.
});
