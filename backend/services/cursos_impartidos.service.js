const CursosImpartidosModel = require("../models/cursos_impartidos.model");

const CursosImpartidosService = {

  getCursos: (callback) => {
    CursosImpartidosModel.getAll(callback);
  },

  getCursoById: (id, callback) => {
    CursosImpartidosModel.getById(id, callback);
  },

  createCurso: (data, callback) => {
    CursosImpartidosModel.create(data, callback);
  },

  updateCurso: (id, data, callback) => {
    CursosImpartidosModel.update(id, data, callback);
  },

  deleteCurso: (id, callback) => {
    CursosImpartidosModel.delete(id, callback);
  }

};

module.exports = CursosImpartidosService;