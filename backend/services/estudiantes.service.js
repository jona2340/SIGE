const EstudiantesModel = require("../models/estudiantes.model");

const EstudiantesService = {

  getEstudiantes: (callback) => {
    EstudiantesModel.getAll(callback);
  },

  getEstudianteById: (id, callback) => {
    EstudiantesModel.getById(id, callback);
  },

  createEstudiante: (data, callback) => {
    EstudiantesModel.create(data, callback);
  },

  updateEstudiante: (id, data, callback) => {
    EstudiantesModel.update(id, data, callback);
  },

  deleteEstudiante: (id, callback) => {
    EstudiantesModel.delete(id, callback);
  }

};

module.exports = EstudiantesService;