const fs = require('fs');
const path = require('path');
//https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
function leerCSV(nombreArchivo) {

    try {
        
        // const filePath = path.join(__dirname, '../mapas', nombreArchivo);
        //console.log("Ruta Archivo: ", rutaArchivo);//"C:\\Users\\edurg\\OneDrive\\Escritorio\\Proyecto 4\\Luiki-Kart-PY4-Lenguajes\\Servidor\\mapas\\mapa1.csv"
        
        // Construir la ruta del archivo.
        let rutaArchivoEdu = "C:\\Users\\edurg\\OneDrive\\Escritorio\\Proyecto 4\\Luiki-Kart-PY4-Lenguajes\\Servidor\\mapas\\" + nombreArchivo;
        let rutaArchivoBryan = "C:\\Users\\bryan\\Desktop\\Luiki-Kart-PY4-Lenguajes\\Servidor\\mapas\\" + nombreArchivo;
        let contenido = fs.readFileSync(rutaArchivoEdu, 'utf-8'); // Leer el contenido del archivo.
        console.log("Contenido: ", contenido)

        // contenido = contenido.trim("[","]");
        // Primero se separa por salto de linea, despues se separa por cada ','.
        let matriz = contenido.trim().split('\n').map(linea => linea.split(',').map(celda => celda.trim()));// El segundo map es para eliminar el \r

        return matriz;

    } catch (error) {
        console.log("Error al leer el archivo csv" + error);
        return [];
    }
}


// List<List<int>> matrizSudokuResuelta = resultado
//     .Split("],[")
//     .Select(sublista => sublista
//         .Split(',')
//         .Select(num => int.Parse(num.Trim()))
//         .ToList()
//     )
//     .ToList();


module.exports = {
  leerCSV
};
