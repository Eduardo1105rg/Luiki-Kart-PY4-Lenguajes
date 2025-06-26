<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client';

import RegistroPartida from './components/CrearPartidadComponent.vue'; // Componente para el ingreso de los datos de la partida.


const rutaApi = 'https://fg54v9hj-3000.use2.devtunnels.ms';//'http://localhost:3000'

const socket = io(rutaApi);
const mapas = ref([]);
const crearPartidaActivo = ref(false);

const mostrarFormulario = ref(false);

const mapaSeleccionado = ref(null)
const nombreJugador = ref('');
const vueltas = ref(null)
const tipoJuego = ref(null);
const cantidadJugadores = ref(null);
const mapaContenido = ref([])  // Aqui guardamos la matriz del mapa seleccionado
const posicionesCarros = ref([]);
const datosPartida = ref(null); // Este seria para el registro de los datos a la hora de crear una partidad.
const esCreadorPartida = ref(false);

const idSalaActual = ref(null); // Registrar el codigo de la sala.

const esCreador = ref(false); // Para registrar el creador de la sala.

const estadoPartida = ref('esperando') // Estado acual de la sala.



//let nada = `${rutaApi}/api/mapa/mapas`; //'http://localhost:3000/api/mapa/mapas'
async function obtenerMapa() {
  try {
    const response = await fetch(`${rutaApi}/api/mapa/mapas`)
    if (!response.ok) throw new Error('Error al obtener el mapa')
    const data = await response.json()
    mapas.value = data
    console.log('Mapas recibido:', data)
  } catch (error) {
    console.error('Error en la solicitud:', error)
  }
}

onMounted(async () => {
  await obtenerMapa();

  const nombre = await pedirNombreJugador();
  if (!nombre) return;

  nombreJugador.value = nombre;

  // Esto lo comente ya que deberia de ser a la hora que se seleccione el crear partidad.
  // const tipo = await pedirTipoJuego();
  // if (!tipo) return;
  // tipoJuego.value = tipo;


  // const maxJugadores = await pedirCantidadJugadores();
  // if (!maxJugadores) return;
  // cantidadJugadores.value = maxJugadores;
});


async function activarCrearPartida() {
  // const { value: cantidad } = await Swal.fire({
  //   title: '¿Cuantas vueltas quieres jugar?',
  //   input: 'number',
  //   inputLabel: 'Cantidad de vueltas',
  //   inputPlaceholder: 'Ej. 3',
  //   inputAttributes: {
  //     min: 1,
  //     max: 10,
  //     step: 1
  //   },
  //   showCancelButton: true,
  //   inputValidator: (value) => {
  //     if (!value || isNaN(value) || value <= 0) {
  //       return 'Ingresá un numero valido de vueltas';
  //     }
  //   }
  // });

  // if (cantidad) {
  //   vueltas.value = parseInt(cantidad);
  //   crearPartidaActivo.value = true;
  //   console.log('Vueltas seleccionadas:', vueltas.value);
    
  // }
  crearPartidaActivo.value = true;

  mostrarFormulario.value = true;

   //console.log("Ingreso Datos: V2", ingresoDatos.value)
}


async function pedirTipoJuego() {
  const { value: tipo } = await Swal.fire({
    title: 'Seleccioná el tipo de juego',
    input: 'select',
    inputOptions: {
      'carrera': 'Carrera',
      'rally': 'Rally',
      'circuito': 'Circuito'
    },
    inputPlaceholder: 'Elegí un tipo de juego',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Debés seleccionar un tipo de juego';
      }
    }
  });

  if (tipo) {
    return tipo;
  } else {
    return null;
  }
}


/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
function volver() {
  crearPartidaActivo.value = false;
  //ingresoDatos.value = true;
   //console.log("Ingreso DatosV1: ", ingresoDatos.value)
  mapaSeleccionado.value = null;
  mapaContenido.value = [];
}

/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
function confirmarSeleccion(mapa) {
  Swal.fire({
    title: `¿Deseás seleccionar "${mapa}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    confirmButtonColor: '#42b983',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      mapaSeleccionado.value = mapa
      Swal.fire({
        title: '¡Mapa seleccionado!',
        text: `Usarás el mapa: ${mapa}`,
        icon: 'success',
        confirmButtonColor: '#42b983'
      })
      pedirMapaSeleccionado(mapa);
      crearPartida();
    }
  })
}

/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
async function pedirMapaSeleccionado(mapa) { //'http://localhost:3000/api/mapa/especifico'
  try {
    const response = await fetch(`${rutaApi}/api/mapa/especifico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreMapa: mapa }) // clave 'nombreMapa' para que coincida con el backend
    });
    if (!response.ok) throw new Error('Error al obtener el mapa');
    const contenidoMapa = await response.json();
    mapaContenido.value = contenidoMapa;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
async function pedirNombreJugador() {
  const { value: nombre } = await Swal.fire({
    title: 'Ingresa tu nombre',
    input: 'text',
    inputLabel: 'Nombre del jugador',
    inputPlaceholder: 'Por ejemplo: Bryan',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Debes escribir tu nombre';
      }
    }
  });
  mostrarFormulario.value = false;
  if (nombre) {
    return nombre;
  } else {
    return null;
  }
}

/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
async function pedirCantidadJugadores() {
  const { value: cantidad } = await Swal.fire({
    title: '¿Cuántos jugadores máximo querés para la partida?',
    input: 'number',
    inputLabel: 'Cantidad de jugadores',
    inputPlaceholder: 'Ej. 4',
    inputAttributes: {
      min: 1,
      max: 20,
      step: 1
    },
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || isNaN(value) || value <= 0) {
        return 'Ingresá un número válido de jugadores';
      }
    }
  });

  if (cantidad) {
    return parseInt(cantidad);
  } else {
    return null;
  }
}

/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
function manejarRegistro(datos) {
  // datos = { nombre, tipoJuego, cantidadJugadores, vueltas, pista }
  nombreJugador.value = datos.nombre;
  tipoJuego.value = datos.tipoJuego;
  cantidadJugadores.value = datos.cantidadJugadores;
  vueltas.value = datos.vueltas;
  mapaSeleccionado.value = datos.pista;

  //console.log("Ingreso Datos: ", ingresoDatos.value)
  mostrarFormulario.value = false;
  pedirMapaSeleccionado(mapaSeleccionado.value); 
  crearPartida(); 

  return;
}

function getCarroEmojiPorIndice(index) {
  const emojis = ['🚗', '🚓', '🚙', '🛻', '🚕'];
  return emojis[index] || '🚗';
}


async function ingresarPartida() {
  
  // Pedir el id de sale al que se quiere unir.
  const { value: idSala } = await Swal.fire({
    title: 'Ingresa el ID de la partida',
    input: 'text',
    inputLabel: 'ID de la partidad',
    inputPlaceholder: 'Por ejemplo: 4pv36bicome',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Debes escribir el ID de la partida';
      }
    }
  });

if (!idSala) {
  return;
}
  // Enviar el id de sala.
  socket.emit('unirseSala', {
    idSala,
    nombreUsuario: nombreJugador.value
  });
  idSalaActual.value = idSala;

  // Esperar el resultado de la union.

}


// >>> ====================== Apartado para los sockets ======================= <<<
/**
 * Nombre:
 * 
 * Descripcion:
 * 
 * Entradas:
 * 
 * Salidas:
 * 
 */
function crearPartida() {
  if (!mapaSeleccionado.value || !vueltas.value || !tipoJuego.value || !cantidadJugadores.value) {
    Swal.fire('Error', 'Debes seleccionar mapa, tipo de juego, cantidad de vueltas y cantidad de jugadores.', 'error');
    return;
  }

  // Esta es la comunicacion con la parte de generar la partida.
  socket.emit('crearPartida', {
    creador: nombreJugador.value,
    tipoJuego: tipoJuego.value,
    vueltas: vueltas.value,
    pista: mapaSeleccionado.value,
    cantJugadores: cantidadJugadores.value
  });

  esCreador.value = true;

}


// Generacion de una partidad.
socket.on('partidaGenerada', (data) => {
  console.log('Partida generada:', data);
  console.log('Posiciones iniciales recibidas:', data.posicionesIniciales);
  esCreadorPartida.value = true;
  posicionesCarros.value = data.posicionesIniciales || [];

  Swal.fire('Partida generada', `ID: ${data.id}`, 'success');

  // Registrar los datos de la sala.
  idSalaActual.value = data.id; // Si no estoy mal este tambien esta registrada en el socket actual.
  estadoPartida.value = data.estado;
  console.log("Estado juego: ",estadoPartida.value )
});

// Para escuchar cuando el tiempo de espera llegue a cero.
socket.on('juegoCancelado', ({ motivo }) => {
  console.warn('La partida fue cerra pues llego al tiempo maximo de espera:', motivo);
  Swal.fire({
    icon: 'warning',
    title: 'Partida cerrada',
    text: motivo
  });

  // La parte de reiniciar.
  // crearPartidaActivo.value = false;
  // mapaSeleccionado.value = null;
  // mapaContenido.value = [];
  volver();
});


// socket.on('jugadorNuevo', (datos) => {
//   console.log('Nuevo jugador en la sala:', datos);

//   mapaSeleccionado.value = datos.mapaSeleccionado;
//   mapaContenido.value = datos.contenidoMapa;
//   posicionesCarros.value = datos.posicionesIniciales || [];
//   crearPartidaActivo.value = true;
//   mostrarFormulario.value = false;  
//   esCreadorPartida.value = false;

//   Swal.fire({
//     icon: 'info',
//     title: 'Nuevo jugador',
//     text: `Se ha unido un nuevo jugador a la sala....`
//   });

// });

// Esto es para avisar que un nuevo jugador se unio a la sala en que esta estan esperando para 
socket.on('jugadorNuevo', (datos) => {
  console.log('Nuevo jugador en la sala:', datos);

  mapaSeleccionado.value = datos.mapaSeleccionado;
  mapaContenido.value = datos.contenidoMapa;
  posicionesCarros.value = datos.posicionesIniciales || [];
  crearPartidaActivo.value = true;
  mostrarFormulario.value = false;  
  esCreadorPartida.value = false;


  Swal.fire({
    icon: 'info',
    title: 'Nuevo jugador',
    text: `Nuevo jugador ingresando a la sala de espera.`
  });
  // Aqui se podria hacer algo mas para mostrar la sala de espera. 
  // Tambien podriamos mostrar el mapa pero no dejar que se muevan hasta que el estado de sea igual a Iniciado
});



// Escuchar si hay un error a la hora de unirse a la sala.
socket.on('errorSala', ({ mensaje }) => {
  Swal.fire({
    icon: 'error',
    title: 'Error al unirse a la sala',
    text: mensaje
  });
});

// Si la sala se llena y esta lista para iniciar
socket.on('salaListaParaIniciar', ({ sala }) => {
  Swal.fire({
    icon: 'success',
    title: 'La sala esta llena',
    text: `La partida ${sala} esta lista para comenzar...`
  }); 

  // Aqui se podria poner algo como el boton de inciar o algo asi.
});


// Escuchar la parte del incio del juego.
socket.on('juegoIniciado', ({ cuentaRegresiva }) => {
  console.log('¡Iniciando el juego! Cuenta regresiva:', cuentaRegresiva);

  let tiempo = cuentaRegresiva;

  const cuentaRegresivaIntervalo = setInterval(() => {
    if (tiempo > 0) {
      Swal.fire({
        title: `Comienza en ${tiempo}...`,
        timer: 1000,
        showConfirmButton: false,
        allowOutsideClick: false
      });
      tiempo--;
    } else {
      clearInterval(cuentaRegresivaIntervalo);

      Swal.fire({
        title: '¡A jugar!',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });

      estadoPartida.value = 'jugando';
      //Aqui va la parte de la habilitacion de los controles del juego o como lo vayamos a manejar.
    }
  }, 1000);
});


// funcion para enviar la solicitud de inicio de juego.
function emitirInicioDeJuego() {
  socket.emit('iniciarJuego', {
    idSala: idSalaActual.value 
  });
}



//Para lo que seria la parte de moverse.
function mover(direccion) {

  console.log("Datos del movimeinto: ", posicionesCarros.value,"   --  ", socket.id);

  if ( estadoPartida.value != 'jugando') {
    return;
  }
  const actual = posicionesCarros.value.find(p => p.idJugador === socket.id); // Bryan ya guardo las pos.
  if (!actual) return;

  let nuevaFila = actual.fila;
  let nuevaColumna = actual.columna;

  // Procesar la entrada.
  switch (direccion) {
    case 'arriba': 
      nuevaFila--; 
      break;
    case 'abajo': 
      nuevaFila++; 
      break;
    case 'izquierda': 
      nuevaColumna--; 
      break;
    case 'derecha': 
      nuevaColumna++; 
      break;
  }

  // Verificar que no se mueva a los limites del mapa.
  if ( nuevaFila < 0 || nuevaFila >= mapaContenido.value.length || nuevaColumna < 0 || nuevaColumna >= mapaContenido.value[0].length) {
    console.log("Datos del movimeinto: Erro 1");
    return;
  }

  // Revisar que el espacio al que se mueva sea valido.
  if (mapaContenido.value[nuevaFila][nuevaColumna] === '#') {
    console.log("Datos del movimeinto: Erro 12");
    return;
  }

  // Comunicarse con el servidor.
  socket.emit('realizarMovimiento', {
    idSala: idSalaActual.value,
    fila: nuevaFila,
    columna: nuevaColumna
  });
}


// Que los demas usuarios recibar la asctulizacion.
socket.on('actualizarEstadoJuego', ({ jugadorId, nuevaPosicion }) => {

  console.log("Datos de la respuesta: ",jugadorId, posicionesCarros.value )
  const index = posicionesCarros.value.findIndex(p => p.idJugador === jugadorId);

  console.log("Index encontrado: ", index);
  if (index != -1) {
    posicionesCarros.value[index].fila = nuevaPosicion.fila;
    posicionesCarros.value[index].columna = nuevaPosicion.columna;
  }
});




</script>

<template>
  <div class="contenedor">
    <h1>Luiki Kart</h1>

    <!-- Mostrar mensaje mientras no hay nombre -->
    <div v-if="!nombreJugador">
      <p>Esperando nombre del jugador...</p>
    </div>

    <!-- Mostrar botones si ya hay nombre y aún no se activa crear partida -->
    <div v-else-if="!crearPartidaActivo" class="botones">
      <button class="boton" @click="activarCrearPartida">Crear partida</button>
      <button class="boton" @click="ingresarPartida" >Unirse a una partida (jugar)</button>
      <button class="boton">Ver Ranking</button>
    </div>

    <RegistroPartida v-if="mostrarFormulario"
      :nombre-jugador="nombreJugador"
      :mapas-disponibles="mapas"
      @registro-completo="manejarRegistro"
    />
    
    <div v-else>
      <!-- Esta es para mostrar el mapa. -->
      <div v-if="mapaContenido.length > 0">
        <table>
          <tbody>
            <tr v-for="(fila, i) in mapaContenido" :key="i">
              <td
                v-for="(celda, j) in fila"
                :key="j"
                :class="{ muro: celda === '#' }"
                style="position: relative; width: 50px; height: 50px; padding: 0;"
              >
                <template v-if="posicionesCarros.some(p => p.fila === i && p.columna === j)">
                  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    <div 
                      v-for="(p, index) in posicionesCarros.filter(p => p.fila === i && p.columna === j)" 
                      :key="p.idJugador"
                      :style="{
                        position: 'absolute',
                        left: `${index * 30}px`,
                        zIndex: index,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }"
                    >
                      <span style="font-size: 20px">{{ getCarroEmojiPorIndice(index) }}</span>
                      <span class="nombre-jugador">
                        {{ p.nombre }}
                      </span>
                    </div>
                  </div>
                </template>
                <span v-else-if="celda !== '#'">
                  {{ celda }}
                </span>
              </td>




            </tr>
          </tbody>
        </table>

        <div class="controles-movimiento-div">
          <button @click="mover('arriba')">⬆️</button>
          <div style="display: flex; justify-content: center; gap: 8px; margin-top: 5px;">
            <button @click="mover('izquierda')">⬅️</button>
            <button @click="mover('derecha')">➡️</button>
          </div>
          <button @click="mover('abajo')" style="margin-top: 5px;">⬇️</button>
        </div>

        
        <!-- v-if="esCreador" -->
        <button @click="emitirInicioDeJuego" class="boton"> Iniciar partida </button>

        <button class="boton" @click="volver">Volver</button>
      </div>

      <!-- Esta es la parte de seleccionar los mapa. -->
      <!-- <div v-else>
        <table class="table stripped bordered">
          <thead>
            <tr>
              <th>Mapas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mapa in mapas" :key="mapa">
              <td @click="confirmarSeleccion(mapa)" style="cursor: pointer">{{ mapa }}</td>
            </tr>
          </tbody>
        </table>
        <button class="boton" @click="volver">Volver</button>
      </div> -->


      <!-- Este seria el componente en el que el usuario ingresaria los datos de la partida. -->
      <div v-if="!crearPartidaActivo">

        <RegistroPartida          
          :nombre-jugador="nombreJugador"
          :mapas-disponibles="mapas"
          @registro-completo="manejarRegistro"
        />

      </div>


    </div>
  </div>
</template>

<!-- Estilos de la aplicacion.. -->
<style scoped>
.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.botones {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 300px;
  margin-bottom: 2rem;
}

.boton {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-weight: 600;
}

.boton:hover {
  background-color: #36966f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.boton:active {
  transform: translateY(0);
}

/* Estilos para el tablero/mapa */
.tablero-contenedor {
  margin: 2rem 0;
  overflow: auto;
  max-width: 100%;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

th, td {
  border: 1px solid #e0e0e0;
  text-align: center;
  user-select: none;
  position: relative;
  width: 35px;
  height: 35px;
  padding: 0;
  background-color: #f9f9f9;
}

th {
  background-color: #42b983;
  color: rgb(246, 171, 171);
  padding: 10px;
  font-weight: 500;
}

/* Estilo para muros/paredes */
.muro {
  background-color: #37368e;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
}

/* Estilo para pista/camino */
.camino {
  background-color: #f5f5f5;
}

/* Contenedor de carros en una celda */
.carro-contenedor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 3px;
}

/* Estilos para el formulario/modal */
.formulario-partida {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  width: 90%;
  max-width: 500px;
  margin: 2rem auto;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .contenedor {
    margin-top: 2rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .botones {
    width: 90%;
  }
  
  table {
    zoom: 0.8;
  }
}

/* Animaciones */
@keyframes aparecer {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tablero-contenedor {
  animation: aparecer 0.5s ease-out;
}


.controles-movimiento-div {
  position: absolute;
  top: 100px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nombre-jugador {
  font-size: 10px;
  background: rgb(177, 14, 14);
  padding: 1px 3px;
  border-radius: 3px;
  margin-top: 2px;
  max-width: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}

td {
  overflow: visible;
  white-space: nowrap;
}
</style>

