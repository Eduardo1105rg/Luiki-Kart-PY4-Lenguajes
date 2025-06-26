require('dotenv').config();
const { buscarPosicionE } = require('./utils/PosicionInicial');
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
const juegoSocket = require('./sockets/juegoSocket');
juegoSocket(io);

// const { leerCSV } = require('./utils/LeerCSV');
// const { obtencionMapas } = require('./utils/ObtenerPistasMapa');

// const pista = leerCSV("mapa1.csv");
// const mapas = obtencionMapas();
// console.log(pista);

const { GenerarCodigoSala } = require('./utils/GenerarCodigoSala');

GenerarCodigoSala();


// Importar los rutas.
const mapasRoutes = require('./routes/Mapas');

// Inyectar las rutas en el app.

app.use('/api/mapa', mapasRoutes)






// Estos es para deplegar el servidor en un puerto local, despues usaremos el ports fowar de visual para publicarlo.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Esto lo utilizamos para que cuando se llame desde el frontend le devuelva una lista en un json con los mapas
// que tenemos almacenados en nuestras respectivas carpetas
// app.get('/api/mapas', (req, res) => {
//   try {
//     const mapas = obtencionMapas();
//     res.json(mapas);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener mapas.' });
//   }
// });


// //Deberia recibir el titulo porque con eso voy a buscar entonces seria un post 
// app.post('/api/mapa/especifico', (req, res) => {
//   try {
//     const { nombreMapa } = req.body;
//     if (!nombreMapa) {
//       return res.status(400).json({ error: 'Nombre de mapa requerido' });
//     }

//     console.log("Esto fue lo que llego del mapa seleccionado", nombreMapa)
//     const mapaEspecifico = leerCSV(nombreMapa);
//     res.json(mapaEspecifico);
//   } catch (error) {
//     console.error('Error al obtener mapa específico:', error);
//     res.status(500).json({ error: 'Error al obtener mapa específico' });
//   }
// });

