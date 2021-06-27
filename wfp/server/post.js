'use strict';

exports.init = function (app, db) {

    app.post('/post', function (req, res) {
        console.log(req.body);
        //  if (!req.body.user || !req.body.passwd) {
        //     res.json({ errormsg: 'Peticion mal formada'});
        //    return;
        // }
        if (!req.body.selectedProcess) {
            db.get(
                'SELECT * FROM users WHERE login=?', req.body.user,
                function (err, row) {
                    if (row == undefined) {
                        res.json({ errormsg: 'El usuario no existe' });
                    } else if (row.passwd === req.body.passwd) {
                        // Crear la sesion con estos datos de usuario
                        req.session.userID = row.id;
                        req.session.isAdmin = (row.id == 1);

                        var data = {
                            user: {
                                id: row.id,
                                login: row.login,
                                name: row.name
                            },
                            isAdmin: (row.id == 1)
                        };
                        res.json(data);
                    } else {
                        res.json({ errormsg: 'Fallo de autenticación' });
                    }
                }
            );
        }

        else {
            ////////Ejecutamos esta parte del código cuando un usuario activa un proceso
            var usrId= req.session.userID;
            var usrProcess = req.body.selectedProcess;
            //Buscamos el id del usuario
            db.get(
                'SELECT id FROM users WHERE name=?', req.body.user,
                function (err, row) {
                    usrId = row.id;
                    var idColumna;
                    ///Hacemos una inserción en la tabla runs
                    var sql = 'INSERT INTO runs (workflow,user,state,usertask) VALUES(' + usrProcess + "," + usrId + "," + "1,null)";
                    console.log(sql);
                    db.run(sql, function (err) {
                        if (err) {
                            return console.log(err.message);
                        }
                        else console.log("Inserción correcta workflows");
                        var sql6 = 'SELECT id FROM runs ORDER BY id DESC LIMIT 1;';
                        db.all(sql6, function (err, rows) {
                            console.log(rows);
                            var runid = rows[0].id;
                            ///Ahora insertamos en la tabla UserTasks, tantas filas como tareas en el proceso. Inicialmente todos los estados = 1 
                            var sql2 = 'SELECT id from wftasks where workflow=?';

                            db.all(sql2, usrProcess, function (err, rows) {
                                console.log(rows[0].id);
                                console.log(rows[1].id);
                                console.log(rows[2].id);
                                var first = true;
                                rows.forEach(element => {
                                    if (first) {
                                        var sql3 = 'INSERT INTO usertasks(run,user,wftask,state) VALUES(' + runid + ',' + usrId + ',' + element.id + ',2' + ');';
                                        db.run(sql3, function (err) {
                                            if (err) {
                                                return console.log(err.message);
                                            }
                                            else {
                                                console.log("Inserción correcta usertasks");
                                            }
                                            var sql5 = 'SELECT id from usertasks where run=' + runid + ';';
                                            db.all(sql5, function (err, rows) {
                                                console.log(rows);
                                                var usertaskID = rows[0].id;
                                                var sql7 = 'UPDATE runs SET usertask=? WHERE id=' + runid + ';';
                                                db.run(sql7, usertaskID, function (err) {
                                                    if (err) {
                                                        return console.log(err.message);
                                                    }
                                                    else {
                                                        console.log("Inserción correcta usertasks");
                                                    }
                                                });
                                            });
                                        });
                                        first = false;
                                    }
                                    else {
                                        var sql4 = 'INSERT INTO usertasks(run,user,wftask,state) VALUES(' + runid + ',' + usrId + ',' + element.id + ',1' + ');';
                                        db.run(sql4, function (err) {
                                            if (err) {
                                                return console.log(err.message);
                                            }
                                            else {
                                                console.log("Inserción correcta usertasks");
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
            );

            res.json({ message: 'Se ha registrado el proceso ' + usrProcess });
        }




    });
};
