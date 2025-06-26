const express = require('express'); // Importar la libreria.

const { ObtenerMapas, ObtenerMapaEspecifico } = require('../controllers/MapasController');

// const { obtencionMapas } = require('../utils/ObtenerPistasMapa');

const router = express.Router();

// Se definen las rutas a usar. Con esto a cada ruta se la asigna una funcion destino.
router.get('/mapas', ObtenerMapas);
router.post('/especifico', ObtenerMapaEspecifico);

module.exports = router;
