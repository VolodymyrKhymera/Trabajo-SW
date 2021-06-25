'use strict';

exports.init = function (app, db) {
    // Obtener las tareas pendientes de un usuario
    app.get('/procs', function (req, res) {
        if (req.session.isAdmin) {
            var sql = 'SELECT wt.workflow AS id, wf.name AS name, ut.user AS user, wt.id AS wftid FROM usertasks AS ut, wftasks AS wt, workflows AS wf WHERE ut.state=2 AND ut.wftask=wt.id AND wf.id=wt.workflow';
            db.all(sql, function (err, rows) {
                console.log(rows);
                res.json(rows);
            });
        }
        else{
            var sql = 'SELECT wt.workflow AS id, wf.name AS name, ut.user AS user, wt.id AS wftid FROM usertasks AS ut, wftasks AS wt, workflows AS wf WHERE ut.user=? AND ut.state=2 AND ut.wftask=wt.id AND wf.id=wt.workflow';
            var userID=req.session.userID;
            db.all(sql,userID, function (err, rows) {
                console.log(rows);
                res.json(rows);
            });
        }
    });

    app.post('/procs', function (req, res) {
        //console.log(req.body);
        var wftid = req.body.wftid;
        var wfid = req.body.wfid;
        var user = req.body.user;
        var sql1 = 'SELECT orden from wftasks where id=? ;';
        db.all(sql1, wftid, function (err, row) {
            var order = row[0].orden;
            var wtids = [];
            var sql2 = 'SELECT id from wftasks where workflow =? AND orden>=' + order + ';';
            db.all(sql2, wfid, function (err, rows) {
                //console.log(rows);
                var i = 0;
                rows.forEach((element) => {
                    wtids[i] = element.id;
                    //console.log(ids);
                    i++;

                });

                wtids.forEach(wtid => {
                    //console.log(wtid);
                    var sql5 = 'UPDATE usertasks SET state = 4 WHERE wftask=' + wtid + ' AND user=?;';
                    db.run(sql5, user, function (err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        else {
                            console.log("Tareas canceladas");
                        }
                    });

                    var sql6 = 'SELECT id from usertasks where wftask=' + wtid + ' AND user=?;';
                    db.all(sql6, user, function (err, row) {
                        console.log(row);
                        var usertaskID = row[0].id;
                        var sql7 = 'UPDATE runs SET state = 1 WHERE usertask=' + usertaskID + ' AND user=?;';
                        db.run(sql7, user, function (err) {
                            if (err) {
                                return console.log(err.message);
                            }
                            else {
                                console.log("Tareas en runs terminadas");
                            }
                        });
                    });
                });
            });
        });
        res.json({ message: 'Se ha cancelado el proceso ' + wfid + ' refresque la página para ver sus procesos activos' });
    });
};