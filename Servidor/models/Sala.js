class Sala {
    
    constructor (salaID, estadoInical, creador) {
        this.IdSala = salaID,
        this.Estado = estadoInical
        this.Dueno = creador,
        this.Jugadores = []
    };

    AgregarJugador(jugador) {
        this.Jugadores += [jugador]; 
    };


};