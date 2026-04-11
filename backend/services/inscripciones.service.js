const InscripcionesModel = require("../models/inscripciones.model");

const InscripcionesService = {

  getInscripciones: (callback) => {
    InscripcionesModel.getAll(callback);
  },

  getInscripcionById: (id, callback) => {
    InscripcionesModel.getById(id, callback);
  },

  createInscripcion: (data, callback) => {
    InscripcionesModel.create(data, callback);
  },

  updateInscripcion: (id, data, callback) => {
    InscripcionesModel.update(id, data, callback);
  },

  deleteInscripcion: (id, callback) => {
    InscripcionesModel.delete(id, callback);
  }

};

module.exports = InscripcionesService;