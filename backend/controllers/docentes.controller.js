const DocentesService = require("../services/docentes.service");

exports.getDocentes = (req, res) => {
  DocentesService.getDocentes((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getDocenteById = (req, res) => {
  const { id } = req.params;

  DocentesService.getDocenteById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createDocente = (req, res) => {
  const data = req.body;

  DocentesService.createDocente(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Docente creado", results });
  });
};

exports.updateDocente = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  DocentesService.updateDocente(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Docente actualizado", results });
  });
};

exports.deleteDocente = (req, res) => {
  const { id } = req.params;

  DocentesService.deleteDocente(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Docente eliminado", results });
  });
};
