const { leerCSV } = require('../utils/LeerCSV');
const { obtencionMapas } = require('../utils/ObtenerPistasMapa');


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
const ObtenerMapas = async (req, res) => {
  try {
    const mapas = obtencionMapas();
    console.log(mapas);
    res.status(201).json(mapas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mapas' });
  }
};


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
const ObtenerMapaEspecifico = async (req, res) => {
  try {
    const { nombreMapa } = req.body;
    if (!nombreMapa) {
      return res.status(400).json({ error: 'Nombre de mapa requerido' });
    }

    console.log("Esto fue lo que llego del mapa seleccionado", nombreMapa)
    const mapaEspecifico = leerCSV(nombreMapa);

    res.status(201).json(mapaEspecifico);

  } catch (error) {
    console.error('Error al obtener mapa específico:', error);
    res.status(500).json({ error: 'Error al obtener mapa específico' });
  }
};


// Exportar los modulos que conforman esa parte esta seccion.
module.exports = {

    ObtenerMapas,
    ObtenerMapaEspecifico,

};

