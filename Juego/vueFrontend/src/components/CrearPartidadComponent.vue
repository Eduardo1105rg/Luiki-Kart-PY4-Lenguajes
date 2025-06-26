

<!-- Este seria el como se veria pa parte de la creacion de una partida. -->
<template>
  <form @submit.prevent="enviarFormulario" class="formulario">
    <h2>Crear nueva partida</h2>

    <!-- <label>
      Nombre del jugador:
      <input v-model="nombre" type="text" required />
    </label> -->

    <label>
      Tipo de juego:
      <select v-model="tipoJuego" required>
        <option value="" disabled>Selecciona una opción</option>
        <option value="carrera">Carrera</option>
        <option value="rally">Rally</option>
        <option value="circuito">Circuito</option>
      </select>
    </label>

    <label>
      Cantidad de jugadores:
      <input v-model.number="cantidadJugadores" type="number" min="2" max="20" required />
    </label>

    <label>
      Cantidad de vueltas:
      <input v-model.number="vueltas" type="number" min="1" max="10" required />
    </label>


    <label>
        Selecciona un mapa:
        <select v-model="mapaSeleccionado" required>
            <option value="" disabled>Elegí un mapa</option>
            <option v-for="mapa in mapasDisponibles" :key="mapa" :value="mapa">{{ mapa }}</option>
        </select>
    </label>

    <button type="submit">Continuar</button>
  </form>
</template>

<!-- La parte del script. -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
    nombreJugador: { type: String, required: true },
    mapasDisponibles: { type: Array, required: true }
})

const emit = defineEmits(['registro-completo'])

// const nombre = ref('')
const tipoJuego = ref('')
const cantidadJugadores = ref(null)
const vueltas = ref(null)
const mapaSeleccionado = ref('')

function enviarFormulario() {
    // Validar los datos del fomulario.
    if (!tipoJuego.value || !cantidadJugadores.value || !vueltas.value || !mapaSeleccionado.value) {   
            return;// Aqui se podria mostrar un mensaje para indicarle al usuario que hay un error.
        }

    // Con esto se le pasan los datos al padre.
    emit('registro-completo', {
        nombre: props.nombreJugador,
        tipoJuego: tipoJuego.value,
        cantidadJugadores: cantidadJugadores.value,
        vueltas: vueltas.value,
        pista: mapaSeleccionado.value
    })
}
</script>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  margin: auto;
}
input, select {
  padding: 0.5rem;
}
button {
  background-color: #42b983;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
