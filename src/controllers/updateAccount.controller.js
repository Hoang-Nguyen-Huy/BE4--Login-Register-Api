const User = require('../models/user.model');

exports.update = (req, res) => {
    const { lname, fname, age, email } = req.body;

    User.findUserDetailByEmail(email, (err, userDetail) => {                                                //find user_detail by email first
        if (err || !userDetail) {
            return res.status(500).json({ message: 'Error updating user detail' });
        }
        User.findByUserId(userDetail.userid, (err, user) => {                                            // then find user by userid from user_detail
            if (err || !user) {
                return res.statu(500).json({ message: 'Error updating user detail' });
            }
            User.updateUserDetail(user.userid, { lname, fname, age, email }, (err, updatedDetail) => {      //finally, update user_detail by userid
                if (err) {
                    return res.statu(500).json({ message: 'Error updating user detail' });
                }
                const responseData = {
                    id: user.userid, 
                    username: user.username, 
                    role: user.role, 
                    detail: updatedDetail
                };
                res.status(200).json(responseData);
            });
        });
    });
};