const db = require("../config/db");

const GruposModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM grupos";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM grupos WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO grupos (nombre_grupo, carrera_id, periodo_id)
      VALUES (?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.nombre_grupo,
        data.carrera_id,
        data.periodo_id
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE grupos
      SET nombre_grupo = ?, carrera_id = ?, periodo_id = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.nombre_grupo,
        data.carrera_id,
        data.periodo_id,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM grupos WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = GruposModel;