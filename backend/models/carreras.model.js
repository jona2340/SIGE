const db = require("../config/db");

const CarrerasModel = {
  getAll: (cb) => {
    db.query("SELECT * FROM carreras", cb);
  },

  getById: (id, cb) => {
    db.query("SELECT * FROM carreras WHERE id = ?", [id], cb);
  },

  create: (data, cb) => {
    const sql = `
      INSERT INTO carreras (nombre, siglas)
      VALUES (?, ?)
    `;
    db.query(sql, [data.nombre, data.siglas], cb);
  },

  update: (id, data, cb) => {
    const sql = `
      UPDATE carreras
      SET nombre=?, siglas=?
      WHERE id=?
    `;
    db.query(sql, [data.nombre, data.siglas, id], cb);
  },

  delete: (id, cb) => {
    db.query("DELETE FROM carreras WHERE id=?", [id], cb);
  }
};

module.exports = CarrerasModel;