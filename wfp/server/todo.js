'use strict';

exports.init = function(app, db) {
    // Obtener las tareas pendientes de un usuario
    app.get('/todo', function (req, res) {
        var sql = 'SELECT ut.id AS id, t.name AS name, wt.data AS data FROM usertasks AS ut, wftasks AS wt, tasks AS t WHERE ut.user=? AND ut.state=2 AND ut.wftask=wt.id AND wt.task=t.id';
        var userID = req.session.userID;
        db.all(sql, userID, function(err, rows) {
            res.json(rows);
        });
    });
};
