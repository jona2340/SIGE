const GruposModel = require("../models/grupos.model");

const GruposService = {

  getGrupos: (callback) => {
    GruposModel.getAll(callback);
  },

  getGrupoById: (id, callback) => {
    GruposModel.getById(id, callback);
  },

  createGrupo: (data, callback) => {
    GruposModel.create(data, callback);
  },

  updateGrupo: (id, data, callback) => {
    GruposModel.update(id, data, callback);
  },

  deleteGrupo: (id, callback) => {
    GruposModel.delete(id, callback);
  }

};

module.exports = GruposService;