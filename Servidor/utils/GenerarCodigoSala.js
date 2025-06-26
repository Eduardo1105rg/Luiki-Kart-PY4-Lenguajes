const codigosGenerados = new Set(); // Para almacenar los codigos que ya se usaron.
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
function GenerarCodigoSala () {

    // Opcion 1, esta es mas complejo 
    // let caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
    // let contraseña = "";
    // for (i=0; i<20; i++) contraseña +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
    // console.log(contraseña, "\n");

    let codigo;
    do {
        // Opcion 2: Este lo que hace que se generen valores aletorios y los pasa a formato string. https://programmerclick.com/article/18331689836/
        codigo = Math.random().toString(36).slice(2);
        console.log(codigo,"\n");

    } while (codigosGenerados.has(codigo))

  codigosGenerados.add(codigo);
  return codigo;
  
}


module.exports = {

    GenerarCodigoSala

};