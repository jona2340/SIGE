const UsuariosModel = require("../models/usuarios.model");

const UsuariosService = {

  getUsuarios: (callback) => {
    UsuariosModel.getAll(callback);
  },

  getUsuarioById: (id, callback) => {
    UsuariosModel.getById(id, callback);
  },

  createUsuario: (data, callback) => {
    UsuariosModel.create(data, callback);
  },

  updateUsuario: (id, data, callback) => {
    UsuariosModel.update(id, data, callback);
  },

  deleteUsuario: (id, callback) => {
    UsuariosModel.delete(id, callback);
  }

};

module.exports = UsuariosService;