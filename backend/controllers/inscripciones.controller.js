const InscripcionesService = require("../services/inscripciones.service");

exports.getInscripciones = (req, res) => {
  InscripcionesService.getInscripciones((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getInscripcionById = (req, res) => {
  const { id } = req.params;

  InscripcionesService.getInscripcionById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createInscripcion = (req, res) => {
  const data = req.body;

  InscripcionesService.createInscripcion(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Inscripción creada", results });
  });
};

exports.updateInscripcion = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  InscripcionesService.updateInscripcion(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Inscripción actualizada", results });
  });
};

exports.deleteInscripcion = (req, res) => {
  const { id } = req.params;

  InscripcionesService.deleteInscripcion(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Inscripción eliminada", results });
  });
};