var net = require('net');
var readline = require('readline').createInterface(process.stdin, process.stdout);
var server = net.createServer();
var clients = [];

server.on('connection', function(sock) {
  sock.name = sock.remoteAddress + ":" + sock.remotePort 
  clients.push(sock);
  sock.write("Welcome " + sock.name + "\n");
  broadcast(sock.name + " joined the chat\n", sock);

  readline.setPrompt('');
  readline.prompt();

  readline.on('line', function(line) {
    sock.write(line);
  });

  sock.on('data', function(data) {
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
    process.stdout.write(message+"\n")
  }
}).listen(5757);
console.log('server on');
