<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { io } from 'socket.io-client';

import RegistroPartida from './components/CrearPartidadComponent.vue'; // Componente para el ingreso de los datos de la partida.



const socket = io('http://localhost:3000');
const mapas = ref([])
const crearPartidaActivo = ref(false);

const mostrarFormulario = ref(false);

const mapaSeleccionado = ref(null)
const nombreJugador = ref('');
const vueltas = ref(null)
const tipoJuego = ref(null);
const cantidadJugadores = ref(null);
const mapaContenido = ref([])  // Aquí guardamos la matriz del mapa seleccionado
const posicionesCarros = ref([]);
const datosPartida = ref(null); // Este seria para el registro de los datos a la hora de crear una partidad.


async function obtenerMapa() {
  try {
    const response = await fetch('http://localhost:3000/api/mapa/mapas')
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
async function pedirMapaSeleccionado(mapa) {
  try {
    const response = await fetch('http://localhost:3000/api/mapa/especifico', {
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
}


// Generacion de una partidad.
socket.on('partidaGenerada', (data) => {
  console.log('Partida generada:', data);
  console.log('Posiciones iniciales recibidas:', data.posicionesIniciales);

  posicionesCarros.value = data.posicionesIniciales || [];  
  Swal.fire('Partida generada', `ID: ${data.id}`, 'success');
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


// Resultado de unirse a una sala.
socket.on('jugadorNuevo', (datos) => {
  console.log('Nuevo jugador en la sala:', datos);

  Swal.fire({
    icon: 'info',
    title: 'Te uniste a la partida',
    text: `Ingresando a la sala de espera hasta que se inicie la partida...`
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
                :class="{
                  muro: celda === '#',
                  carro: posicionesCarros.some(p => p.fila === i && p.columna === j)
                }"
              >
                <span v-if="posicionesCarros.some(p => p.fila === i && p.columna === j)">
                  🚗
                </span>
                <span v-else-if="celda !== '#'">
                  {{ celda }}
                </span>
              </td>

            </tr>
          </tbody>
        </table>
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
    font-family: 'Segoe UI', sans-serif;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .botones {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .boton {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    background-color: #42b983;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .boton:hover {
    background-color: #36966f;
  }

  table {
    border-collapse: collapse;
    width: 300px;
    margin-bottom: 1rem;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    user-select: none;
  }

  th {
    background-color: #42b983;
    color: white;
  }

  .muro {
    background-color: #37368e; /* color del muro awiwiw */
    width: 20px;
    height: 20px;
  }
  .carro {
    background-color: red;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

</style>


