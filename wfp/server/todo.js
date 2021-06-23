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

    app.post('/todo', function(req, res) {
        console.log(req.body.taskID);
        var id=req.body.taskID;
        var sql= 'UPDATE usertasks SET state = 3 WHERE id='+id+';';
        db.run(sql, function(err){
            if (err) {
                return console.log(err.message);
            }
            else {
                console.log("Actualización correcta usertasks");}
        });
        var sql2= 'UPDATE runs SET state = 1 WHERE usertasks='+id+';';
        db.run(sql2, function(err){
            if (err) {
                return console.log(err.message);
            }
            else {
                console.log("Actualización correcta usertasks");}
        });
        res.json({message:'Se ha finalizado el proceso '+id});
    });
};
