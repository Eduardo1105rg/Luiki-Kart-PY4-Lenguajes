class Sala {
    
    constructor (salaID, estadoInical, creador) {
        this.IdSala = salaID,
        this.Estado = estadoInical 
        this.Dueno = creador,
        this.posicion = { fila: null, columna: null };
        this.Jugadores = []
    };

    agregarJugador(jugador) {
        const yaExiste = this.jugadores.find(j => j.idSocket === jugador.idSocket);
        if (!yaExiste) {
        this.jugadores.push(jugador);
        }
    }


    finalizar(){
        this.estado = 'finalizado';
    }
    
    iniciar() {
    this.estado = 'jugando';

}

};