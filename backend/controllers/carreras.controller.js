const CarrerasService = require("../services/carreras.service");

const CategoryController = {
  getAll: (req, res) => {
    CarrerasService.getAllCarreras((err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    });
  },

  getById: (req, res) => {
    CarrerasService.getCarreraById(req.params.id, (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data[0]);
    });
  },

  create: (req, res) => {
    CarrerasService.createCarrera(req.body, (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Carrera creada", id: result.insertId });
    });
  },

  update: (req, res) => {
    CarrerasService.updateCarrera(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Carrera actualizada" });
    });
  },

  delete: (req, res) => {
    CarrerasService.deleteCarrera(req.params.id, (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Carrera eliminada" });
    });
  }
};

module.exports = CategoryController;