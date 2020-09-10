import { ipcRenderer } from 'electron';
// import * as os from 'os';
import * as dgram from 'dgram';
import * as arptable from 'arptable-js';
import * as child_process from 'child_process';
// import EzWebServerClient from '@ewoosoft/ezwebserver-client';

const executablePath = 'C:\\Program Files (x86)\\VATECH\\EzDent-i\\Bin\\VTE2Loader_ReqAdmin32.exe';
// var executablePath = "C:\\Program Files (x86)\\VATECH\\EzDent-i\\Bin\\VTE2Loader32.exe";
// var executablePath = "C:\\Program Files (x86)\\VATECH\\EzDent-i\\Bin\\VTE232..exe";

child_process.execFile(executablePath, function (err, data) {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data.toString());
});
// const EzWebServerClient = require().default;

const validateIPaddress = (ip) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );
};

// const getExpire = () => {
//   const expires = new Date();
//   expires.setDate(expires.getDate() + 1);
//   return Math.round(expires.valueOf() / 1000);
// };

const lstIP = [];
const findDuplicate = (address) => {
  return lstIP.findIndex((ip) => ip === address) > 0;
};

window.addEventListener('DOMContentLoaded', () => {
  for (const type of ['chrome', 'node', 'electron']) {
    console.log(type, ' : ', process.versions[type]);
  }

  ipcRenderer.send('asynchronous-message', 'ping');

  ipcRenderer.on('asynchronous-reply', (arg) => {
    // let count = BrowserWindow.getFocusedWindow();
    // console.log("count", count) // "pong" 출력
    console.log('arg', arg); // "pong" 출력
  });

  const data = '0001';
  const message = Buffer.from(data, 'latin1');

  arptable.get(function (table) {
    table.forEach((item) => {
      if (validateIPaddress(item.InternetAddress)) {
        const client = dgram.createSocket('udp4');
        client.on('message', (data, info) => {
          if (String(data) === '0000' && findDuplicate(info.address) === false) {
            lstIP.push(info.address);
            lstIP.sort();
            console.log(lstIP);
          }
          client.close();
        });

        client.send(message, 0, message.length, 43112, String(item.InternetAddress), function (
          err
        ) {
          if (err) {
            console.log('err : ' + err);
            client.close();
          }
        });
      }
    });
  });

  // const postappLogin = () => {
  //   const api = new EzWebServerClient.auth.AuthenticationR2Api();
  //   const webServerBasePath = 'http://localhost:55005';
  //   api.setBasePath(webServerBasePath);

  //   const authData = {
  //     clientName: 'EzWebServerClient Test',
  //     clientVersion: '1.0.0',
  //     userName: 'Master Admin',
  //     password: '0000',
  //     expires: getExpire(),
  //   };

  //   return new Promise((resolve, reject) => {
  //     return api
  //       .postAppLogInR2({ data: EzWebServerClient.common.AuthDataBuilder.build(authData) })
  //       .then((response) => {
  //         console.log("response : ", response);

  //         var networkInterfaces = os.networkInterfaces();
  //         console.log(networkInterfaces);
  //         const resData = response.data;
  //         resolve(resData.token);

  //       })
  //       .catch((response) => {
  //         if (response.data) {
  //           console.log("response error : ", response);
  //           const errorData = response.data;
  //           reject(errorData);
  //         } else {
  //           reject(response);
  //         }
  //       });
  //   });
  // }

  // postappLogin();
});
