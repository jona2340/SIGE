const MateriasService = require("../services/materias.service");

exports.getMaterias = (req, res) => {
  MateriasService.getMaterias((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getMateriaById = (req, res) => {
  const { id } = req.params;

  MateriasService.getMateriaById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getMateriasByCarrera = (req, res) => {
  const { carrera_id } = req.params;

  MateriasService.getMateriasByCarrera(carrera_id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createMateria = (req, res) => {
  const data = req.body;

  MateriasService.createMateria(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Materia creada", results });
  });
};

exports.updateMateria = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  MateriasService.updateMateria(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Materia actualizada", results });
  });
};

exports.deleteMateria = (req, res) => {
  const { id } = req.params;

  MateriasService.deleteMateria(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Materia eliminada", results });
  });
};