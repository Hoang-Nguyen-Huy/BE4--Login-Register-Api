const sql = require('./db');

const User = funtion(user) {
    this.userId = user.userId;
    this.name = user.name;
    this.password = user.password;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", new User, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};


