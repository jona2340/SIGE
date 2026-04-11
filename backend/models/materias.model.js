const db = require("../config/db");

const MateriasModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM materias";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM materias WHERE id = ?";
    db.query(sql, [id], callback);
  },

  getByCarrera: (carrera_id, callback) => {
    const sql = "SELECT * FROM materias WHERE carrera_id = ?";
    db.query(sql, [carrera_id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO materias (carrera_id, nombre, cuatrimestre_dictado)
      VALUES (?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.carrera_id,
        data.nombre,
        data.cuatrimestre_dictado
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE materias
      SET carrera_id = ?, nombre = ?, cuatrimestre_dictado = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.carrera_id,
        data.nombre,
        data.cuatrimestre_dictado,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM materias WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = MateriasModel;