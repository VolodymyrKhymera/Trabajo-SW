'use strict';

exports.init = function(app, db) {

    // Obtener los datos de un usuario
    app.get('/user/:id', function (req, res) {
        db.get(
            'SELECT * FROM users WHERE id=?', req.params.id,
            function(err, row) {
                if (row == undefined)
                    res.send(err);
                else
                    res.json({
                        id: row.id,
                        name: row.name,
                        email: row.email
                    });
            }
        );
    });

    // Crear un nuevo usuario
    app.post('/user', function (req, res) {
        // guardar el usuario en la base de datos y devolver el ID
        db.run(
            'INSERT INTO users VALUES (?, ?, ?)',
            [
                req.params.name,
                req.params.email,
                rea.params.passwd
            ],
            function(err) {
                if (err)
                    res.send(err);
            }
        );
        res.end();
    });

    // Modificar los datos de un usuario
    app.put('/user/:id', function (req, res) {
        res.send('Got a PUT request at /user');
    });

    // Borrar un usuario
    app.delete('/user/:id', function (req, res) {
        // Borrar primero todas los registros de tablas con claves de usuario
        // DELETE FROM usertasks WHERE user=?
        // DELETE FROM runs WHERE user=?
        // DELETE FROM sessions WHERE user=?

        // Borrar el usuario en la base de datos
        db.run('DELETE FROM users WHERE id=?', req.params.id);

        res.end();
    });

    // Listar todos los usuarios
    app.get('/users', function(req, res) {
        db.all(
            'SELECT id, login, name, email FROM users',
            function(err, rows) {
                res.json(rows);
            }
        );
    });
};
