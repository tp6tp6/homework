
var net = require('net');
var readline = require('readline').createInterface(process.stdin, process.stdout);
var clients = [];
var server = net.createServer();

server.on('connection', function(sock) {
  sock.name = sock.remoteAddress +':'+ sock.remotePort;
  console.log(sock.name+' 連進來了');
  clients.push(sock);
  broadcast(sock.name + " joined the chat\n", sock);

  readline.setPrompt('');
  readline.prompt();

  readline.on('line', function(line) {
    sock.write(line);
    readline.prompt();
  });
  
  sock.on('data', function (data) {
    broadcast(sock.name + "> " + data, sock);
  });
 
  sock.on('end', function () {
    clients.splice(clients.indexOf(sock), 1);
    broadcast(sock.name + " left the chat.\n");
  });

  function broadcast(message, sender) {
    clients.forEach(function (client) {
      if (client === sender) return;
      client.write(message);
    });
    console.log(message);
  }
}).listen(5757);

console.log('server 啟動');
