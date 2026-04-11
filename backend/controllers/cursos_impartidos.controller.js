const CursosService = require("../services/cursos_impartidos.service");

exports.getCursos = (req, res) => {
  CursosService.getCursos((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getCursoById = (req, res) => {
  const { id } = req.params;

  CursosService.getCursoById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createCurso = (req, res) => {
  const data = req.body;

  CursosService.createCurso(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Curso asignado", results });
  });
};

exports.updateCurso = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  CursosService.updateCurso(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Curso actualizado", results });
  });
};

exports.deleteCurso = (req, res) => {
  const { id } = req.params;

  CursosService.deleteCurso(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Curso eliminado", results });
  });
};