const UsuariosService = require("../services/usuarios.service");

exports.getUsuarios = (req, res) => {

  UsuariosService.getUsuarios((err, results) => {

    if (err) return res.status(500).json(err);

    res.json(results);

  });

};

exports.getUsuarioById = (req, res) => {

  const id = req.params.id;

  UsuariosService.getUsuarioById(id, (err, results) => {

    if (err) return res.status(500).json(err);

    res.json(results[0]);

  });

};

exports.createUsuario = (req, res) => {

  const data = req.body;

  UsuariosService.createUsuario(data, (err, result) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Usuario creado",
      id: result.insertId
    });

  });

};

exports.updateUsuario = (req, res) => {

  const id = req.params.id;
  const data = req.body;

  UsuariosService.updateUsuario(id, data, (err) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Usuario actualizado"
    });

  });

};

exports.deleteUsuario = (req, res) => {

  const id = req.params.id;

  UsuariosService.deleteUsuario(id, (err) => {

    if (err) return res.status(500).json(err);

    res.json({
      message: "Usuario eliminado"
    });

  });

};