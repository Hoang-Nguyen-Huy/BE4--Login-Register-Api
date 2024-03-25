const Post = require('../models/post.model');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

exports.update = async(req, res)  => {
    const id = req.params.id;
    const updatePost = {
        content: req.body.content
    };
    Post.update(id, updatePost, (err, updatedPost) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating post '});
        } else {
            return res.status(200).json({ message: 'Update post successfully!' });
        }
    });
};

exports.getAll = async(req, res) => {
    const { page, take } = req.query;
    const userid = req.user.user.userid;

    if (!take || isNaN(parseInt(take))) {
        return res.status(400).json({ message: "take parameter is missing or invalid" });
    }

    // Calculating offset is just to get data from the page and how much to get
    const offset = (page - 1) * take;

    try {
        const posts = await Post.getAll(userid, offset, take);

        //Number of records queried
        const totalRecord = await prisma.post.count();

        //Calculating numbers of needing page
        const totalPage = Math.ceil(totalRecord / take);

        //Determine the previous page
        const prevPage = parseInt(page) > 1 ? parseInt(page) - 1 : null;

        //Determine the next page
        const nextPage = parseInt(page) < totalPage ? parseInt(page) + 1 : null;

        const responseData = {
            page: parseInt(page), 
            take: parseInt(take),
            data: posts,
            totalRecord: totalRecord,
            totalPage: totalPage
        };

        if (nextPage !== null) {
            responseData.nextPage = nextPage;
        }

        if (prevPage !== null) {
            responseData.prevPage = prevPage;
        }

        res.status(200).json(responseData);
    } catch(error) {
        console.error('Error fetching post: ', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
}