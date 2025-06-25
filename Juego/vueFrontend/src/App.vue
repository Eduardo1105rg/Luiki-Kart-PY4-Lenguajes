<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const mapas = ref([])
const crearPartidaActivo = ref(false)
const mapaSeleccionado = ref(null)
const mapaContenido = ref([])  // Aquí guardamos la matriz del mapa seleccionado

async function obtenerMapa() {
  try {
    const response = await fetch('http://localhost:3000/api/mapas')
    if (!response.ok) throw new Error('Error al obtener el mapa')
    const data = await response.json()
    mapas.value = data
    console.log('Mapas recibido:', data)
  } catch (error) {
    console.error('Error en la solicitud:', error)
  }
}

onMounted(() => {
  obtenerMapa()
})

function activarCrearPartida() {
  crearPartidaActivo.value = true
}

function volver() {
  crearPartidaActivo.value = false
  mapaSeleccionado.value = null
  mapaContenido.value = []
}

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
      pedirMapaSeleccionado(mapa)
    }
  })
}

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

</script>

<template>
  <div class="contenedor">
    <h1>Luiki Kart</h1>

    <div v-if="!crearPartidaActivo" class="botones">
      <button class="boton" @click="activarCrearPartida">Crear partida</button>
      <button class="boton">Unirse a una partida (jugar)</button>
      <button class="boton">Ver Ranking</button>
    </div>

    <div v-else>
      <!-- Esto solo sucede si el mapa ya se cargo jsjsjs -->
      <div v-if="mapaContenido.length > 0">
        <table>
          <tbody>
            <tr v-for="(fila, i) in mapaContenido" :key="i">
              <td
                v-for="(celda, j) in fila"
                :key="j"
                :class="{ muro: celda === '#' }"
              >
                <span v-if="celda !== '#'">{{ celda }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="boton" @click="volver">Volver</button>
      </div>

      <!-- Esto es como la parte anterior donde uno selecciona la cual se muestra sino hay mapas ni nada -->
      <div v-else>
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
      </div>
    </div>
  </div>
</template>

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

</style>
