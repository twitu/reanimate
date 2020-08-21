function playgroundInit(elt) {
  var mySockets = {};

  function sendSocketCommand(wat) {
    if (wat.cmd == "connect") {
      socket = new WebSocket(wat.address);
      socket.onopen = function (event) {
        app.ports.receiveSocketMsg.send({
          name: wat.name,
          msg: "data",
          data: "connection established"
        });
      }
      socket.onmessage = function (event) {
        app.ports.receiveSocketMsg.send({
          name: wat.name,
          msg: "data",
          data: event.data
        });
      }
      connectionFailedHandler = function (event) {
        app.ports.receiveSocketMsg.send({
          name: wat.name,
          msg: "data",
          data: "connection failed"
        });
      }
      socket.onerror = connectionFailedHandler;
      socket.onclose = connectionFailedHandler;
      mySockets[wat.name] = socket;
    } else if (wat.cmd == "send") {
      mySockets[wat.name].send(wat.content);
    } else if (wat.cmd == "close") {
      mySockets[wat.name].close();
      delete mySockets[wat.name];
    }
  }

  var app = Elm.Main.init({
    node: document.getElementById(elt)
  });
  app.ports.sendSocketCommand.subscribe(sendSocketCommand);
  return app;
}
