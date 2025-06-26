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



// Definir lo que seria el socket para el juego en si.
const { GenerarCodigoSala } = require('../utils/GenerarCodigoSala'); // Para generar los codigos de las salas.
const { Sala, Jugador } = require('../models/Jugador');
const partidasActivas = new Map(); // Las partidas que hay actualmente, podemos cambiarlo por una clase despues.
const { leerCSV } = require('../utils/LeerCSV');
const { buscarPosicionE } = require('../utils/PosicionInicial');

module.exports = function(io) {

    // Esta parte seria general, se configuran los datos de una sala para jugar, y 
    // despues se tendran dos opciones o unirse a una sala o la otra seria crear una nueva sala.
    
    // Este seria para establcer conexion con el socket.
    io.on('connection', (socket) => {
        // socket.data.estado = 'lobby'; para meterle datps al socket
        // Con socket.on('', (datos) => {}); es para cuando se comunica desde el lado del cliente.

        // Con socket.emit('', na); Es para enviar datos.

        // Crear la sala.
        socket.on('crearPartida', (datos) => {

            // Obtener los datos.
            const { creador, tipoJuego, pista, vueltas, cantJugadores } = datos;

            // Generar el codigo.
            let codigo = GenerarCodigoSala(); 
            
            // Obtener el mapa.
            const mapa = leerCSV(pista);
            const posicionInicial = buscarPosicionE(mapa);
            const posicionesIniciales = [{
                idJugador: socket.id,
                nombre: creador,           
                fila: posicionInicial.fila,
                columna: posicionInicial.columna
            }];

            console.log("Mapa actual: ", mapa);


            console.log('Posiciones iniciales generadas:', posicionesIniciales);
            const nuevaPartida = { // Este de aqui seria con lo de la clase.
                id: codigo,
                creador: socket.id,
                pista,
                mapa,
                tipoJuego,
                vueltas,
                cantJugadores,
                posicionesIniciales,
                jugadores: [{
                    idSocket: socket.id,
                    nombre: creador,
                    posicion: posicionesIniciales[0]  // <--- asignar posición inicial aca
                }], // Tambien seria con lo de la clase.

                // Este de aqui es para que se cierre despues de el tiempo de espera.
                estado: 'esperando',
                creada: Date.now(),
                expiracion: Date.now() + 180000 // 3 minutos
            };

            // Este de aqui es para registrar las partidas actuales, tambien hay que modificarlo para que funciones con las clases.
            partidasActivas.set(codigo, nuevaPartida);

            // Unirse a la sala.
            socket.join(codigo);

            //para guardar el id de la sala
            socket.data.idSala = codigo;
            // Devolver los datos que se generaron.
            socket.emit('partidaGenerada', nuevaPartida);

            // revisar de forma automatica si la sala no se ha cerrado despues de 3 minutos
            setTimeout(() => {
                const partida = partidasActivas.get(codigo);

                if (partida && partida.estado === 'esperando') {
                    partidasActivas.delete(codigo);
                    io.to(codigo).emit('juegoCancelado', { motivo: 'El tiempo de espera ha superado los 3 minutos.' });
                }

            }, 180000);

        });
        
        // Unirse a una sala.
        socket.on('unirseSala', (datos) => {
            const { idSala, nombreUsuario } = datos;

            const partida = partidasActivas.get(idSala);

            // Aqui se validaria que la sala este en condiciones. (Este 'EnEspera', no tenga el maximo de jugadores)
           
            if (!partida) { // Por si se puso el id de la sala mal.
                return socket.emit('errorSala', { mensaje: 'Sala no encontrada' });
            }

            if (partida.estado !== 'esperando') { // Por si ya inicio o finalizo.
                return socket.emit('errorSala', { mensaje: 'La partida ya ha iniciado' });
            }

            if (partida.jugadores.length >= partida.cantJugadores) { // Se alanzo la cantidad maxima de participantes.
                return socket.emit('errorSala', { mensaje: 'La sala esta llena' });
            }
            const indiceJugador = partida.jugadores.length;
            const posicionInicial = buscarPosicionE(leerCSV(partida.pista)); 

            const nuevaPosicion = {
                fila: posicionInicial.fila,
                columna: posicionInicial.columna + indiceJugador
            };

            partida.jugadores.push({ 
                idSocket: socket.id, 
                nickname: nombreUsuario,
                posicion: nuevaPosicion
            });

            partida.posicionesIniciales = partida.jugadores.map(j => ({
                idJugador : j.idSocket,
                nombre: j.nombre || j.nickname,  
                fila: j.posicion.fila,
                columna: j.posicion.columna
            }));

            // Registrar el jugador en la partidad
            // Tambien a esa partida se le asociaria el usuario.
            socket.join(idSala);
            socket.data.idSala = idSala; // Guardar el id de la sala.
            if (!partida.contenidoMapa) {
                const contenidoMapa = leerCSV(partida.pista);
                partida.contenidoMapa = contenidoMapa;
            }

            // Aqui se emitiria un mensaje para lo demas de la sala.
            io.to(idSala).emit('jugadorNuevo', {
                jugadores: partida.jugadores,
                cantJugadores: partida.cantJugadores,
                mapaSeleccionado: partida.pista,
                contenidoMapa: partida.contenidoMapa,
                posicionesIniciales: partida.posicionesIniciales
            });


            // Tambien se podria hacer algo para indicar si ya se lleno la sala.
            if (partida.jugadores.length === partida.cantJugadores) {
                io.to(idSala).emit('salaListaParaIniciar', { sala: idSala });
            }

        });

        // Inciar el juego dentro de una sala.
        socket.on('iniciarJuego', (datos) => {
            const { idSala } = datos;

            const partida = partidasActivas.get(idSala);
            if (!partida) {
                return;
            }

            partida.estado = 'jugando';
            partida.inicio = Date.now();
            io.to(idSala).emit('juegoIniciado', { cuentaRegresiva: 3 }); 
            // Aqui seria la parte que corresponde al inicio de una partida.

            // Se debe de detener el cronometro y cambiar el estado a 'EnJuego' o algo asi.

            // Emitir un mensaje a todos los de la sala.

        });

        // Moverse.
        socket.on('realizarMovimiento', (datos) => {
            const { idSala, fila, columna } = datos;

            // Revisar los datos que llegaron
            const partida = partidasActivas.get(idSala);
            if (!partida) {
                console.log("Error 1")
                return;
            }

            // Usamos el id para buscar el jugador para no tener que pasar el nombre cada vez.
            const jugador = partida.jugadores.find(j => j.idSocket === socket.id);
            if (!jugador) {
                console.log("Error 2")
                return;
            }

            // Aqui va todo lo relacionado con el movimiento 
            const mapa = partida.mapa;
            // Recibe las posicion que ingreso el usuario, verifica que pueda moverser, si se puede mover actualiza, vuleve a pasar la matriz a todos los jugadores.
            if ( fila < 0 || fila >= mapa.length || columna < 0 || columna >= mapa[0].length || mapa[fila][columna] === '#' ) {
                console.log("Error 3")
                return;
            }
            // al jugador que fue el que hizo el movimiento se le manda la matriz y dejar preprado para una posible parte de enviar un mensaje.
            jugador.posicion = { fila, columna };

            // Reistrar los datos.
            partida.posicionesIniciales = partida.jugadores.map(j => ({
                idSocket: j.idSocket,
                nombre: j.nombre || j.nickname,
                fila: j.posicion.fila,
                columna: j.posicion.columna
            }));

            console.log("Se va a emitir los datos.")
            // Esto es basico, se deberia de volver a pasar la matriz actual o algo para modificarla.
            io.to(idSala).emit('actualizarEstadoJuego', {
                jugadorId: socket.id,
                nuevaPosicion: jugador.posicion 
            });

        });


        // Para la verificacion automatica del proceso de juego, se debe de estar verificando constantemente si se llego al numero final de vueltas y eso, aunque tambien 
        // podria hacerse con la parte de realizar movimiento.
        // . No se si este seria con .on
        socket.on('verificacionProcesoJuego', (datos) => {});

        // Aqui seria la parte de la finalizacion de la partida.
        socket.on('finalizarPartidad', (datos) => {

            // Indicar si hay ganadores y esas cosas dependiendo del modo de juego. 

            // Cierre de la sala y sacar a los jugadores de esta.

            const idSala = socket.data.idSala;
            if (!idSala) return;

            const partida = partidasActivas.get(idSala);
            if (!partida) return;

            partida.estado = 'finalizada';

            const resultados = partida.jugadores.map(na => ({
                nickname: na.nickname,
                tiempo: na.tiempoFinal || 0 //Por si se registra el tiempo.
            }));

            // Wnviar los resultados.
            io.to(idSala).emit('juegoFinalizado', { resultados });

            // Limpiar sala
            partidasActivas.delete(idSala);
            io.in(idSala).socketsLeave(idSala);



        });


        // Salir de la partida.
        socket.on('disconnect', () => {
            console.log(`Se ha desconectado el jugador: ${socket.id}`);
            // Se podria agregar algo por si se quiere un procesamiento adicional.

            
        });

    }); 


};
