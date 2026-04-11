const PeriodosModel = require("../models/periodos.model");

const PeriodosService = {

  getPeriodos: (callback) => {
    PeriodosModel.getAll(callback);
  },

  getPeriodoById: (id, callback) => {
    PeriodosModel.getById(id, callback);
  },

  createPeriodo: (data, callback) => {
    PeriodosModel.create(data, callback);
  },

  updatePeriodo: (id, data, callback) => {
    PeriodosModel.update(id, data, callback);
  },

  deletePeriodo: (id, callback) => {
    PeriodosModel.delete(id, callback);
  }

};

module.exports = PeriodosService;