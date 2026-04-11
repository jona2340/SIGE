const CalificacionesModel = require("../models/calificaciones.model");

const CalificacionesService = {
    createCalificacion: (data, cb) => {
        CalificacionesModel.create(data, cb);
    },
    getCalificacionById: (id, cb) => {
        CalificacionesModel.getById(id, cb);
    },
    getAllCalificaciones: (cb) => {
        CalificacionesModel.getAll(cb);
    },
    updateCalificacion: (id, data, cb) => {
        CalificacionesModel.update(id, data, cb);
    },
    deleteCalificacion: (id, cb) => {
        CalificacionesModel.delete(id, cb);
    }
};

module.exports = CalificacionesService;