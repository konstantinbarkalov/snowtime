'use strict';
function Connector($container) {
  let that = this;
  let isConnected = null;
  let isConnecting = null;
  let $buttonConnect = null;
  let $selectServer = null;
  let $inputServer = null; // used to play readonly role, while select is hidden (when select is visible, this input is hidden)
  let $inputRoomname = null;
  let $inputPassword = null;
  let $inputUsername = null;
  let $inputs = null;
  function init() {
    isConnected = false;
    isConnecting = false;
    $buttonConnect = $container.find('button.connector__connect');
    $selectServer = $container.find('select.connector__server');
    $inputServer = $container.find('input.connector__server');
    $inputRoomname = $container.find('input.connector__roomname');
    $inputPassword = $container.find('input.connector__password');
    $inputUsername = $container.find('input.connector__username');
    $inputs = $inputServer.add($inputRoomname).add($inputPassword).add($inputUsername);
    $buttonConnect.on('click', ()=>{
      if (!isConnected) {
        connect();
      } else {
        disconnect();
      }
    });
    teplite.on('stat.net.isConnected', (newIsConnected)=>{
      isConnected = newIsConnected;
      isConnecting = false;
      updateAll();
    })
  }
  function updateAll() {
    if (isConnecting || isConnected) {
      $selectServer.hide();
      $inputServer.show();
      $inputServer.val($selectServer.children(':selected').text());
    } else {
      $selectServer.show();
      $inputServer.hide();
    }
    $buttonConnect.prop('disabled', isConnecting);
    $buttonConnect.text(isConnected?'отключиться':'подключиться');
    $inputs.prop('readonly', isConnecting || isConnected);
  }
  function connect() {
    isConnecting = true;
    updateAll();
    teplite.gritter.addGrit('Подключаемся...');
    let url = $selectServer.children(':selected').val();
    teplite.sioClient.connect(url, $inputRoomname.val(), $inputPassword.val(), $inputUsername.val()).then(()=>{
      teplite.gritter.addGrit('Подключились к комнате');
      isConnected = true;
    }).catch((err)=>{
      teplite.gritter.addGrit(`Подключиться к комнате не удалось, причина: ${err}`, 'warn');
      isConnected = false;
    }).then(()=>{
      isConnecting = false;
      updateAll();
    });
  }
  function disconnect() {
    teplite.gritter.addGrit('Соединение отключено');
    teplite.sioClient.disconnect();
    isConnected = false;
    isConnecting = false;
    updateAll();
  }

  init();
}
module.exports = Connector;
