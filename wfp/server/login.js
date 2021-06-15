'use strict';

exports.init = function(app, db) {

    app.post('/login', function(req, res) {
        if (!req.body.user || !req.body.passwd) {
            res.json({ errormsg: 'Peticion mal formada'});
            return;
        }

        db.get(
            'SELECT * FROM users WHERE login=?', req.body.user,
            function(err, row) {
                if (row == undefined) {
                    res.json({ errormsg: 'El usuario no existe'});
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
                    res.json({ errormsg: 'Fallo de autenticación'});
                }
            }
        );
    });
};
