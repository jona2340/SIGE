const CarrerasModel = require("../models/carreras.model");

const CategoryService = {
  getAllCarreras: (cb) => {
    CarrerasModel.getAll(cb);
  },

  getCarreraById: (id, cb) => {
    CarrerasModel.getById(id, cb);
  },

  createCarrera: (data, cb) => {
    CarrerasModel.create(data, cb);
  },

  updateCarrera: (id, data, cb) => {
    CarrerasModel.update(id, data, cb);
  },

  deleteCarrera: (id, cb) => {
    CarrerasModel.delete(id, cb);
  }
};

module.exports = CategoryService;