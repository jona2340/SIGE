const GruposService = require("../services/grupos.service");

exports.getGrupos = (req, res) => {
  GruposService.getGrupos((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.getGrupoById = (req, res) => {
  const { id } = req.params;

  GruposService.getGrupoById(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createGrupo = (req, res) => {
  const data = req.body;

  GruposService.createGrupo(data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Grupo creado", results });
  });
};

exports.updateGrupo = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  GruposService.updateGrupo(id, data, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Grupo actualizado", results });
  });
};

exports.deleteGrupo = (req, res) => {
  const { id } = req.params;

  GruposService.deleteGrupo(id, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Grupo eliminado", results });
  });
};