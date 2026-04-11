const MateriasModel = require("../models/materias.model");

const MateriasService = {

  getMaterias: (callback) => {
    MateriasModel.getAll(callback);
  },

  getMateriaById: (id, callback) => {
    MateriasModel.getById(id, callback);
  },

  getMateriasByCarrera: (carrera_id, callback) => {
    MateriasModel.getByCarrera(carrera_id, callback);
  },

  createMateria: (data, callback) => {
    MateriasModel.create(data, callback);
  },

  updateMateria: (id, data, callback) => {
    MateriasModel.update(id, data, callback);
  },

  deleteMateria: (id, callback) => {
    MateriasModel.delete(id, callback);
  }

};

module.exports = MateriasService;