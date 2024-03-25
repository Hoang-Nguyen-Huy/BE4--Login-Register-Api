const Post = require('../models/post.model');

exports.post = async (req, res) => {
    const userId = req.user.user.userid;
    const { content } = req.body;
    const createdPost = {
        content: content,
        authorId: userId
    };
    Post.create(createdPost, (err, newPost) => {
        if (err) {
            console.error("Error creating post: ", err);
            return res.status(400).json({ message: 'Created post failed!!' });
        }
        return res.status(201).json({ message: 'Create post successfully!' });
    });
};