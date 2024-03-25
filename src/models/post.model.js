const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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


module.exports = Post;