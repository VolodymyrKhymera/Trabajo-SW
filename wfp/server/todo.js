'use strict';

exports.init = function(app, db) {
    // Obtener las tareas pendientes de un usuario
    app.get('/todo', function (req, res) {
        var sql = 'SELECT ut.id AS id, t.name AS name, wt.data AS data, wt.id AS wtid FROM usertasks AS ut, wftasks AS wt, tasks AS t WHERE ut.user=? AND ut.state=2 AND ut.wftask=wt.id AND wt.task=t.id';
        var userID = req.session.userID;
        db.all(sql, userID, function(err, rows) {
            res.json(rows);
        });
    });

    app.post('/todo', function(req, res) {
        console.log(req.body);
        var id=req.body.taskID;
        var wtid=req.body.wtid;
        var sql1= 'UPDATE usertasks SET state = 3 WHERE id='+id+';';
        db.run(sql1, function(err){
            if (err) {
                return console.log(err.message);
            }
            else {
                console.log("Actualización correcta usertasks");}
            var sql2= 'UPDATE runs SET state = 1 WHERE usertask='+id+';';
            db.run(sql2, function(err){
                if (err) {
                    return console.log(err.message);
                }
                else {
                    console.log("Actualización correcta runs");}
                
                var wfid=0;
                var order= 0;
                var sql3= 'SELECT workflow , orden from wftasks where id=?';
                db.all(sql3, wtid, function(err,wf){
                    if (err) {
                        return console.error(err.message);
                        }
                    console.log(wf[0]);
                    wfid=wf[0].workflow;
                    order=wf[0].orden;
                    //wf.forEach((row) => {
                        //console.log(row.name);
                    //});
                    console.log(wfid+" "+order);
                });
            });
        });

        /*var ids= [];
        var sql4= 'SELECT id, orden form wftasks where order>'+order+' AND workflow =? ORDER BY order;';
        db.all(sql4, wfid, function(err, rows) {
            var maxOrder= Number.MAX_VALUE;
            console.log(rows);
            rows.forEach((element) => {
                if(element.order>order && element.order<=maxOrder){
                    maxOrder=element.order;
                    ids=[ids, element.id];
                    console.log(ids);
                }
            });
            res.json(rows);
        });
        ids.forEach(wfid =>{
            var sql5= 'UPDATE usertasks SET state = 2 WHERE wftasks='+wfid+';';
            db.run(sql5, function(err){
                if (err) {
                    return console.log(err.message);
                }
                else {
                    console.log("Nuevas tareas pendientes incluidas");}
            });
        });*/
        
        res.json({message:'Se ha finalizado el proceso '+id});
    });
};
