const sql = require('./db');
const crypto = require('crypto');

const UserDetail = function(userDetail) {
    this.lname = userDetail.lname;
    this.fname = userDetail.fname;
    this.age = userDetail.age;
    this.email = userDetail.email;
    this.userid = userDetail.userid;
};

const User = function(user) {
    this.userid = user.userid;
    this.username = user.username;
    this.password = user.password;
    this.role = user.role;
    this.UserDetail = new UserDetail(user.detail);
};

User.create = (newUser, result) => {
    //Generate a random UUID (v4)
    const uuid = crypto.randomUUID();

    //Hash the UUID with MD5
    const md5hash = crypto.createHash('md5').update(uuid).digest('hex');

    //Use md5hash as the userid in newUser
    newUser.userid = md5hash;

    //Extract detail from User
    const { detail, ...userWithoutDetail } = newUser;

    //Start a transaction
    sql.beginTransaction(function(err) {
        if (err) {
            throw err;
        }

        //Insert into user table
        sql.query("INSERT INTO user SET ?", userWithoutDetail, function(err, res) {
            if (err) {
                sql.rollback(function() { 
                    console.log("error: ", err);
                    result(err, null);
                });
            }

            //Add userid to detail object
            detail.userid = md5hash;

            //Insert into user_detail table
            sql.query("INSERT INTO user_detail SET ?", detail, function(err, res) {
                if (err) {
                    sql.rollback(function() {
                        console.log("error: ", err);
                        result(err, null);
                    });
                }
                
                //Commit the transaction if both inserts are successful
                sql.commit(function(err) {
                    if (err) {
                        sql.rollback(function() {
                            console.log("error: ", err);
                            result(err, null);
                        });
                    }

                    console.log("created user: ", { userid: md5hash, ...userWithoutDetail, ...detail });

                    // Remove userid from detail before returning the result
                    delete detail.userid;

                    // Return the whole newUser object after insertion
                    result(null, newUser);
                });
            });
        });
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

User.findByUserId = (userid, result) => {
    sql.query(`SELECT * FROM user WHERE userid = '${userid}'`, (err, res) => {
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

