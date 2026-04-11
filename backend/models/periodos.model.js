const db = require("../config/db");

const PeriodosModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM periodos";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM periodos WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO periodos (nombre, fecha_inicio, fecha_fin)
      VALUES (?, ?, ?)
    `;
    db.query(sql, [data.nombre, data.fecha_inicio, data.fecha_fin], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE periodos
      SET nombre = ?, fecha_inicio = ?, fecha_fin = ?
      WHERE id = ?
    `;
    db.query(sql, [data.nombre, data.fecha_inicio, data.fecha_fin, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM periodos WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = PeriodosModel;