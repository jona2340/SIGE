const db = require("../config/db");

const InscripcionesModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM inscripciones";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM inscripciones WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO inscripciones (estudiante_id, grupo_id)
      VALUES (?, ?)
    `;
    db.query(sql, [data.estudiante_id, data.grupo_id], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE inscripciones
      SET estudiante_id = ?, grupo_id = ?
      WHERE id = ?
    `;
    db.query(sql, [data.estudiante_id, data.grupo_id, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM inscripciones WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = InscripcionesModel;