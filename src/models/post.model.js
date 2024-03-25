const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { resourceUsage } = require('process');
const prisma = new PrismaClient();
const User = require('../models/user.model');

const Post = function(post) {
    this.id = post.id;
    this.content = post.content;
    this.createdAt = post.createdAt;
    this.modifiedAt = post.modifiedAt;
    this.authorId = post.authorId;
}

Post.create = async (newPost, result) => {
    //Generate a random UUID (v4)
    const uuid = crypto.randomUUID();

    //Hash the UUID with MD5
    const md5hash = crypto.createHash('md5').update(uuid).digest('hex');

    //Use md5hash as the userid in newFiles
    newPost.id = md5hash;

    try {
        const createdPost = await prisma.post.create({
            data: {
                id: newPost.id,
                content: newPost.content,
                createdAt: newPost.createdAt,
                modifiedAt: newPost.modifiedAt,
                authorId: newPost.authorId
            }
        });

        console.log("Created post: ", {id: newPost.id, ...createdPost});

        result(null, createdPost);
    } catch(error) {
        console.error("Error creating user: ", error);
        result(error, null);
    }
}; 

Post.update = async(id, updatePost, result) => {
    const currentDate = new Date();
    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                content: updatePost.content,
                modifiedAt: currentDate
            }
        });

        console.log(`Updated post for id ${id}`);
        result(null, updatedPost);
    } catch(error) {
        console.error("Error updating post: ", error);
        result(error, null);
    }
};

Post.getAll = async(userid, offset, take) => {
    try {
        const post = await prisma.post.findMany({
            where: {
                authorId: userid
            },
            take: parseInt(take), 
            skip: offset
        });

        const userDetail = await User.findUserDetailByIDWithoutCallBack(userid);

        const author = {
            id: userDetail.user.userid,
            username: userDetail.user.username,
            role: userDetail.user.role,
            detail: {
                lname: userDetail.userDetail.lname,
                fname: userDetail.userDetail.fname,
                age: userDetail.userDetail.age,
                email: userDetail.userDetail.email,
                avt: userDetail.userDetail.avt
            }
        };

        const formattedData = post.map(detail => ({
            id: detail.id,
            content: detail.content,
            createdAt: detail.createdAt,
            modifiedAt: detail.modifiedAt,
            author: author
        }));

        return formattedData;
    } catch(error) {
        console.error('Error fetching post: ', error);
        throw new Error('Error fetching post');
    }
};


module.exports = Post;