const CalificacionesService = require("../services/calificaciones.service");

const CalificaionesController = {
 getAll: (req, res) => {
    CalificacionesService.getAllCalificaciones((err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  },

  getById: (req, res) => {
    CalificacionesService.getCalificacionById(req.params.id, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data[0]);
    });
  },

  create: (req, res) => {
    CalificacionesService.createCalificacion(req.body, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Calificacion creada", id: result.insertId });
    });
  },

  update: (req, res) => {
    CalificacionesService.updateCalificacion(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Calificacion actualizada" });
    });
  },

  delete: (req, res) => {
    CalificacionesService.deleteCalificacion(req.params.id, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Calificacion eliminada" });
    });
  }   
}

module.exports = CalificaionesController;