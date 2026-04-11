const PeriodosService = require("../services/periodos.service");

exports.getPeriodos = (req, res) => {

  PeriodosService.getPeriodos((err, results) => {

    if (err) return res.status(500).json(err);

    res.json(results);

  });

};

exports.getPeriodoById = (req, res) => {

  const id = req.params.id;

  PeriodosService.getPeriodoById(id, (err, results) => {

    if (err) return res.status(500).json(err);

    res.json(results[0]);

  });

};

exports.createPeriodo = (req, res) => {

  const data = req.body;

  PeriodosService.createPeriodo(data, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Periodo creado",
      id: result.insertId
    });

  });

};

exports.updatePeriodo = (req, res) => {

  const id = req.params.id;
  const data = req.body;

  PeriodosService.updatePeriodo(id, data, (err) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Periodo actualizado"
    });

  });

};

exports.deletePeriodo = (req, res) => {

  const id = req.params.id;

  PeriodosService.deletePeriodo(id, (err) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Periodo eliminado"
    });

  });

};