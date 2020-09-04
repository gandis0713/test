
const { ipcRenderer } = require('electron');
var os = require('os');
var dgram = require('dgram');
var arptable = require('arptable-js');

const EzWebServerClient = require('@ewoosoft/ezwebserver-client').default;



const validateIPaddress = (ip) => {  
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)
}  

const getExpire = () => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  return Math.round(expires.valueOf() / 1000);
};

const checkDuplicate = (data)=>{
  return new Set(data).size !== w.length 
}

const lstIP = [];
const findDuplicate = (address)=>{
  return lstIP.findIndex(ip => ip === address) > 0;
}



window.addEventListener('DOMContentLoaded', () => {
  for (const type of ['chrome', 'node', 'electron']) {
    console.log(type, " : ", process.versions[type]);
  }  

  ipcRenderer.send('asynchronous-message', 'ping');

  ipcRenderer.on('asynchronous-reply', (arg) => {
      console.log("arg", arg) // "pong" 출력
  });


  const data = '0001';
  var message = Buffer.from(data, 'latin1');

  arptable.get(function(table){
    table.forEach(item => {
      if(validateIPaddress(item.InternetAddress)) {
        var client = dgram.createSocket('udp4');
        client.on('message', (data, info) => {
          if(String(data) === '0000' && findDuplicate(info.address) === false) {
            lstIP.push(info.address);
            lstIP.sort();
            console.log(lstIP);
          }
          client.close();
        });
  
        client.send(message, 0, message.length, 43112, String(item.InternetAddress), function(err, bytes) {
          if (err) {
            console.log('err : ' + err);
            client.close();
          };
        });
      }
    });
  });


  const postappLogin = () => {
    const api = new EzWebServerClient.auth.AuthenticationR2Api();
    const webServerBasePath = 'http://localhost:55005';
    api.setBasePath(webServerBasePath);

    const authData = {
      clientName: 'EzWebServerClient Test',
      clientVersion: '1.0.0',
      userName: 'Master Admin',
      password: '0000',
      expires: getExpire(),
    };    

    return new Promise((resolve, reject) => {
      return api
        .postAppLogInR2({ data: EzWebServerClient.common.AuthDataBuilder.build(authData) })
        .then((response) => {
          console.log("response : ", response);
          
          var networkInterfaces = os.networkInterfaces();
          console.log(networkInterfaces);
          const resData = response.data;
          resolve(resData.token);

        })
        .catch((response) => {
          if (response.data) {
            console.log("response error : ", response);
            const errorData = response.data;
            reject(errorData);
          } else {
            reject(response);
          }
        });
    });
  }

  // postappLogin();
})