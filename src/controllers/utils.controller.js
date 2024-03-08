const User = require('../models/user.model');

exports.update = async (req, res) => {
    const { lname, fname, age, email } = req.body;

    const updateUserDetail = await User.findUserDetailByEmail(email);
    if (!updateUserDetail) {
        return res.status(500).json({ message: 'Error updating user detail' });
    } else {
        const updateUser = await User.findByUserId(updateUserDetail.userid);
        if (!updateUser) {
            return res.status(500).json({ message: 'Error updating user detail' });
        } else {
            User.updateUserDetail(updateUser.userid, { lname, fname, age, email }, (err, updated) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating user detail' });
                }
                const responseData = {
                    id: updateUser.userid, 
                    username: updateUser.username, 
                    role: updateUser.role, 
                    detail: updated
                };
                
                res.status(200).json(responseData);
            });
        }
    }
};

exports.getAll = (req, res) => {
    const { page, take } = req.query;

    // Calculating offset is just to get data from the page and how much to get
    const offset = (page - 1) * take;

    User.getAllUserDetails((err, userDetails) => {
        if (err) {
            return res.status(500).json({message: 'Error fetching user details' });
        }

        // Number of records queried
        const totalRecord = userDetails.length;

        // Calculating numbers of needing page
        const totalPage = Math.ceil(totalRecord / take);

        // Take data for the current page
        const data = userDetails.slice(offset, offset + parseInt(take));

        // Determine the previous page
        const prevPage = parseInt(page) > 1 ? parseInt(page) - 1 : null;

        // Determine the next page
        const nextPage = parseInt(page) < totalPage ? parseInt(page) + 1 : null;

        const responseData = {
            page: parseInt(page), 
            take: parseInt(take),
            data: data, 
            totalRecord: totalRecord,
            totalPage: totalPage
        };

        if (nextPage != null) {
            responseData.nextPage = nextPage;
        }

        if (prevPage != null) {
            responseData.prevPage = prevPage;
        }

        res.status(200).json(responseData);
    });
};