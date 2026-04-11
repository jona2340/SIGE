const db = require("../config/db");

const EstudiantesModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM estudiantes";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM estudiantes WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO estudiantes (usuario_id, matricula, nombre, apellidos, carrera_id, cuatrimestre_actual)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.usuario_id,
        data.matricula,
        data.nombre,
        data.apellidos,
        data.carrera_id,
        data.cuatrimestre_actual
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE estudiantes
      SET usuario_id = ?, matricula = ?, nombre = ?, apellidos = ?, carrera_id = ?, cuatrimestre_actual = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.usuario_id,
        data.matricula,
        data.nombre,
        data.apellidos,
        data.carrera_id,
        data.cuatrimestre_actual,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM estudiantes WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = EstudiantesModel;