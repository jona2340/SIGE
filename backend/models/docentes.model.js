const db = require("../config/db");

const DocentesModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM docentes";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM docentes WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO docentes (usuario_id, numero_empleado, nombre, apellidos, departamento_o_academia)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.usuario_id,
        data.numero_empleado,
        data.nombre,
        data.apellidos,
        data.departamento_o_academia
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE docentes
      SET usuario_id = ?, numero_empleado = ?, nombre = ?, apellidos = ?, departamento_o_academia = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.usuario_id,
        data.numero_empleado,
        data.nombre,
        data.apellidos,
        data.departamento_o_academia,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM docentes WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = DocentesModel;