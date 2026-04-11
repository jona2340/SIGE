const db = require("../config/db");

const UsuariosModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO usuarios (email, password_hash, rol, estatus)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [data.email, data.password_hash, data.rol, data.estatus], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE usuarios
      SET email = ?, password_hash = ?, rol = ?, estatus = ?
      WHERE id = ?
    `;
    db.query(sql, [data.email, data.password_hash, data.rol, data.estatus, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = UsuariosModel;