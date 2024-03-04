const sql = require('./db');
const crypto = require('crypto');

const User = function(user) {
    this.userid = userid;
    this.username = user.username;
    this.password = user.password;
};

User.create = (newUser, result) => {
    //Generate a random UUID (v4)
    const uuid = crypto.randomUUID();

    //Hash the UUID with MD5
    const md5hash = crypto.createHash('md5').update(uuid).digest('hex');

    //Use md5hash as the userid in newUser
    newUser.userid = md5hash;

    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("created user: ", { userid : md5hash, ...newUser });
        result(null, { userid : md5hash, ...newUser });
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

