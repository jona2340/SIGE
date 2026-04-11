const DocentesModel = require("../models/docentes.model");

const DocentesService = {

  getDocentes: (callback) => {
    DocentesModel.getAll(callback);
  },

  getDocenteById: (id, callback) => {
    DocentesModel.getById(id, callback);
  },

  createDocente: (data, callback) => {
    DocentesModel.create(data, callback);
  },

  updateDocente: (id, data, callback) => {
    DocentesModel.update(id, data, callback);
  },

  deleteDocente: (id, callback) => {
    DocentesModel.delete(id, callback);
  }

};

module.exports = DocentesService;