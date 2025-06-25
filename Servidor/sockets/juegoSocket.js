// sockets/gameSocket.js
// module.exports = function(io) {
//   io.on('connection', (socket) => {
//     console.log(`Nuevo jugador conectado: ${socket.id}`);

//     socket.on('disconnect', () => {
//       console.log(`Jugador desconectado: ${socket.id}`);
//     });
//   });
// };

// Esta parte de aqui abajo era para probar como funcionaban los sockets mas o menos, actualmente no funciona.
// module.exports = function(io) {
//   io.on('connection', (socket) => {
//     console.log(`liente conectado: ${socket.id}`);

//     socket.on('mensajeCliente', (payload) => {
//       console.log(`Recibido del cliente:`, payload);

//       // Responder al cliente con un mensaje
//       socket.emit('mensajeServidor', {
//         mensaje: `${payload.nombre}`,
//         timestamp: `${payload.mensaje}`//new Date()
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log(`Cliente desconectado: ${socket.id}`);
//     });
//   });
// };
