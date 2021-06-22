'use strict';
exports.init = function(app, db) {
    // Obtener los procesos de la empresa
    app.get('/runs', function (req, res) {
        var sql = 'SELECT workflows.id, name, workflow,orden, task, data FROM workflows INNER JOIN wftasks ON workflows.id = wftasks.workflow;';
        //var userID = req.session.userID;
        db.all(sql,function(err, rows) {
            res.json(rows);
        });
    });
};
