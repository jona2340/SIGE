const db = require("../config/db");

const CalificacionesModel = {

    getAll: (cb) => {
        db.query("SELECT * FROM calificaciones", cb)
    },
    getById: (id, cb) => {
        db.query("SELECT * FROM calificaciones WHERE id =? ", [id], cb)
    },
    create: (data, cb) => {
        const sql = `
        INSERT INTO calificaciones (estudiante_id, curso_impartido_id, unidad_1, unidad_2, unidad_3, calificacion_final, tipo_evaluacion)
        VALUES (?,?,?,?,?,?,?)
        `;
        db.query(sql, [data.estudiante_id, data.curso_impartido_id, data.unidad_1, data.unidad_2, data.unidad_3, 
            data.calificacion_final, data.tipo_evaluacion], cb);
    },
    update: (id, data, cb) => {
        const sql = `
        UPDATE calificaciones
        SET estudiante_id=?, curso_impartido_id=?, unidad_1=?, unidad_2=?, unidad_3=?, calificacion_final=?, tipo_evaluacion=?
        WHERE id=?
        `;
         db.query(sql, [data.estudiante_id, data.curso_impartido_id, data.unidad_1, data.unidad_2, data.unidad_3, 
            data.calificacion_final, data.tipo_evaluacion, id], cb);
    
    },
    delete: (id, cb) => {
        db.query("DELETE * FROM calificaciones WHERE id=?", [id], cb);
    }
}

module.exports = CalificacionesModel;