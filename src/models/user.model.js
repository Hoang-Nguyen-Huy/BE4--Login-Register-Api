const sql = require('./db');

const User = function(user) {
    this.username = user.username;
    this.password = user.password;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created user: ", { userid : res.insertId, ...newUser });
        result(null, { userid : res.insertId, ...newUser });
    });
};

User.findByUserName = (username, result) => {
    sql.query(`SELECT * FROM user WHERE username= '${username}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return;
        }
        result(null, null);
    });
};

module.exports = User;

