var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('wfp.sqlite');

var sessions = require('./server/sessions');
sessions.init(db);

sessions.WithSessionDo('86af5280-ba7c-11eb-9b2c-bd5f7b098ef0', function(err, user) {
    console.log(user);
});

