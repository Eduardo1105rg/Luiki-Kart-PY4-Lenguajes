const fs = require('fs');
const path = require('path');
let rutaArchivoBryan = "C:\\Users\\bryan\\Desktop\\Luiki-Kart-PY4-Lenguajes\\Servidor\\mapas";
let rutaArchivoEdu = "C:\\Users\\edurg\\OneDrive\\Escritorio\\Proyecto 4\\Luiki-Kart-PY4-Lenguajes\\Servidor\\mapas";


//Esta va a ser la ruta que consuma según se haya puesto
const carpetaMapas = rutaArchivoEdu;

// Función que retorna un array con los nombres de archivos
function obtencionMapas() {
  try {
    const archivos = fs.readdirSync(carpetaMapas);
    const archivosCSV = archivos.filter(nombre => nombre.endsWith('.csv')); // Aqui podríamos agregar mas por si es otro tipo de archivo
    return archivosCSV;
  } catch (error) {
    console.error('Error al leer la carpeta de mapas:', error);
    return [];
  }
}


module.exports = { 
  obtencionMapas 
};
