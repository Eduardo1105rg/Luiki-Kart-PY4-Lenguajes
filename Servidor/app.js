
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Inicializar Express
const app = express();
const server = http.createServer(app);

// WebSocket con Socket.io
const io = new Server(server, {
  cors: { // Configurar el cors para no tener problemas mas delante.
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

// Permisos, certificados
app.use(cors());
app.use(express.json());

// Ruta de prueba [Esta solo es para ver que el servidor esta corriendo.]
// app.get('/', (req, res) => {
//   res.send('Servidor de juego activo');
// });

// Importar y configurar sockets [Aqui se llamarian a los archivos que tengan sockets configurados, pero deberia de usarse el routes]
// const registerSocketHandlers = require('./sockets/juegoSocket');
// registerSocketHandlers(io);

const { leerCSV } = require('./utils/LeerCSV');

const pista = leerCSV("mapa1.csv");
console.log(pista);




// Estos es para deplegar el servidor en un puerto local, despues usaremos el ports fowar de visual para publicarlo.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
