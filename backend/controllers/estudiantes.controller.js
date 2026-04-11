const EstudiantesService = require("../services/estudiantes.service");

exports.getEstudiantes = (req, res) => {
  EstudiantesService.getEstudiantes((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getEstudianteById = (req, res) => {
  const { id } = req.params;

  EstudiantesService.getEstudianteById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createEstudiante = (req, res) => {
  const data = req.body;

  EstudiantesService.createEstudiante(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Estudiante creado", results });
  });
};

exports.updateEstudiante = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  EstudiantesService.updateEstudiante(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Estudiante actualizado", results });
  });
};

exports.deleteEstudiante = (req, res) => {
  const { id } = req.params;

  EstudiantesService.deleteEstudiante(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Estudiante eliminado", results });
  });
};