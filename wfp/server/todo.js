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
        //console.log(req.body);
        var id=req.body.taskID;
        var wtid=req.body.wtid;
        var finalizar=req.body.finalizar;
        if (finalizar){
            var sql1= 'UPDATE usertasks SET state = 3 WHERE id='+id+';';
            db.run(sql1, function(err){
                if (err) {
                    return console.log(err.message);
                }
                else {
                    console.log("Actualización correcta usertasks");}
                var sql2= 'UPDATE runs SET state = 1 WHERE usertask='+id+' AND user='+req.session.userID+';';
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
                        wfid=wf[0].workflow;
                        order=wf[0].orden;
                        //wf.forEach((row) => {
                            //console.log(row.name);
                        //});
                        //console.log(wfid+" "+order);

                        var ids= [];
                        var sql4= 'SELECT id, orden from wftasks where orden>'+order+' AND workflow =? ORDER BY orden;';
                        db.all(sql4, wfid, function(err, rows) {
                            var maxOrder= Number.MAX_VALUE;
                            //console.log(rows);
                            var i=0;
                            rows.forEach((element) => {
                                if(element.orden>order && element.orden<=maxOrder){
                                    maxOrder=element.orden;
                                    ids[i]=element.id;
                                    //console.log(ids);
                                    i++;
                                }
                            });

                            ids.forEach(wtid =>{
                                //console.log(wtid);
                                var sql5= 'UPDATE usertasks SET state = 2 WHERE wftask='+wtid+';';
                                db.run(sql5, function(err){
                                    if (err) {
                                        return console.log(err.message);
                                    }
                                    else {
                                        console.log("Nuevas tareas pendientes incluidas");}
                                });
                                
                                var sql6 = 'SELECT id from usertasks where wftask='+wtid+';';
                                db.all(sql6, function(err,row){
                                    var usertaskID=row[0].id;
                                    var sql7 = 'INSERT INTO runs(workflow,user,state,usertask) VALUES('+wfid+','+req.session.userID+',2,'+usertaskID+');';
                                    db.run(sql7, function(err){
                                        if (err) {
                                            return console.log(err.message);
                                        }
                                        else {
                                            console.log("Nuevas tareas en runs");}
                                    });
                                });
                            });
                        });
                    });
                });
            });
            
            res.json({message:'Se ha finalizado el proceso '+id+' refresque la página para ver sus nuevas tareas pendientes'});
            }  
        else{
            var sql1= 'UPDATE usertasks SET state = 4 WHERE id='+id+';';
            db.run(sql1, function(err){
                if (err) {
                    return console.log(err.message);
                }
                else {
                    console.log("Actualización correcta usertasks");}
                var sql2= 'UPDATE runs SET state = 1 WHERE usertask='+id+' AND user='+req.session.userID+';';
                db.run(sql2, function(err){
                    if (err) {
                        return console.log(err.message);
                    }
                    else {
                        console.log("Actualización correcta runs");}
                    
                    var wfid=0;
                    var order= 0;
                    var sql3= 'SELECT workflow from wftasks where id=?';
                    db.all(sql3, wtid, function(err,wf){
                        if (err) {
                            return console.error(err.message);
                            }
                        wfid=wf[0].workflow;

                        var ids= [];
                        var sql4= 'SELECT id, orden from wftasks where workflow =? ;';
                        db.all(sql4, wfid, function(err, rows) {
                            var maxOrder= Number.MAX_VALUE;
                            //console.log(rows);
                            var i=0;
                            rows.forEach((element) => {
                                maxOrder=element.orden;
                                ids[i]=element.id;
                                //console.log(ids);
                                i++;
                            });

                            ids.forEach(wtid =>{
                                //console.log(wtid);
                                var sql5= 'UPDATE usertasks SET state = 4 WHERE wftask='+wtid+' AND state<3 AND user='+req.body.userID+';';
                                db.run(sql5, function(err){
                                    if (err) {
                                        return console.log(err.message);
                                    }
                                    else {
                                        console.log("Nuevas tareas canceladas incluidas");}
                                });
                            });
                        });
                    });
                });
            });
            
            res.json({message:'Se ha cancelado el proceso '+wfid});
        }       
    });
};
