export function buscarPosicionE(mapa) {
  for (let fila = 0; fila < mapa.length; fila++) {
    for (let col = 0; col < mapa[fila].length; col++) {
      if (mapa[fila][col] === 'E') {
        return { fila, columna: col };
      }
    }
  }
  return null;
}
