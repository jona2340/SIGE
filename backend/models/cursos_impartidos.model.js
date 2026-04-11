const db = require("../config/db");

const CursosImpartidosModel = {

  getAll: (callback) => {
    const sql = "SELECT * FROM cursos_impartidos";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM cursos_impartidos WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO cursos_impartidos (docente_id, materia_id, grupo_id)
      VALUES (?, ?, ?)
    `;
    db.query(
      sql,
      [
        data.docente_id,
        data.materia_id,
        data.grupo_id
      ],
      callback
    );
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE cursos_impartidos
      SET docente_id = ?, materia_id = ?, grupo_id = ?
      WHERE id = ?
    `;
    db.query(
      sql,
      [
        data.docente_id,
        data.materia_id,
        data.grupo_id,
        id
      ],
      callback
    );
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM cursos_impartidos WHERE id = ?";
    db.query(sql, [id], callback);
  }

};

module.exports = CursosImpartidosModel;