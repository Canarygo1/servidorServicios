exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
      socket.on('file2Event', function () {
        console.log('file2Event triggered');
      });
      socket.on('nuevo', function (params) {
        console.log('nuevo');
      })
    });
    
  }