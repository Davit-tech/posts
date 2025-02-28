import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";
import {validatePostData, isValidUUID, getTodaysPostsCount} from '../utils/validation.js';

const postFile = "./post.json";

export default {
    getPosts: async (req, res) => {
        const title = "Posts";
        let posts;

        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            posts = [];
        }

        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.render("posts", {posts, title});
    },

    getPost: async (req, res) => {
        const {id} = req.params;
        if (!isValidUUID(id)) {
            res.status(400).send("Invalid post ID.");
            return;
        }

        let posts;
        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            posts = [];
        }

        const post = posts.find(post => post.id === id);
        if (post) {
            res.render("post", {post});
        } else {
            res.status(404).send("Post not found");
        }
    },

    getAddPost: async (req, res) => {
        res.render("addPost");
    },

    addPost: async (req, res) => {
        const {title, author, text} = req.body;
        console.log('Form data:', req.body);

        let posts = [];
        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
        }


        const createdAt = new Date().toISOString().split('T')[0];
        const todaysPostsCount = getTodaysPostsCount(posts, createdAt);
        if (todaysPostsCount >= 5) {
            res.status(400).send("You cannot create more than 5 posts in a day.");
            return;
        }


        const errors = validatePostData({title, author, text});
        if (errors.length > 0) {
            console.log('Validation errors:', errors);
            res.status(400).render("addPost", {errors});
            return;
        }


        const userId = uuidv4();
        const newPost = {id: userId, title, author, text, createdAt};

        posts.push(newPost);

        try {
            await fs.writeFile(postFile, JSON.stringify(posts, null, 2), "utf8");
            res.redirect("/posts");
        } catch (err) {
            console.error("Error saving post:", err);
            res.status(500).send("Error saving post");
        }
    },

    editPost: async (req, res) => {
        const {title, author, text} = req.body;
        const {id} = req.params;

        if (!isValidUUID(id)) {
            res.status(400).send("Invalid post ID.");
            return;
        }

        let posts = [];
        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            res.status(500).send("Error reading posts file");
            return;
        }

        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex === -1) {
            res.status(404).send("Post not found");
            return;
        }


        const errors = validatePostData({title, author, text});
        if (errors.length > 0) {
            console.log('Validation errors:', errors);
            res.status(400).render("editPost", {errors});
            return;
        }

        posts[postIndex] = {...posts[postIndex], title, author, text};

        try {
            await fs.writeFile(postFile, JSON.stringify(posts, null, 2), "utf8");
            res.redirect(`/posts/${id}`);
        } catch (err) {
            console.error("Error saving post:", err);
            res.status(500).send("Error saving post");
        }
    },

    getEditPost: async (req, res) => {
        const {id} = req.params;
        if (!isValidUUID(id)) {
            res.status(400).send("Invalid post ID.");
            return;
        }

        let posts = [];
        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            res.status(500).send("Error reading posts file");
            return;
        }

        const post = posts.find(post => post.id === id);
        if (post) {
            res.render("editPost", {post});
        } else {
            res.status(404).send("Post not found");
        }
    },

    deletePost: async (req, res) => {
        const {id} = req.params;
        if (!isValidUUID(id)) {
            res.status(400).send("Invalid post ID.");
            return;
        }

        let posts = [];
        try {
            const data = await fs.readFile(postFile, "utf8");
            posts = JSON.parse(data);
        } catch (error) {
            console.log("Error reading posts file:", error);
            res.status(500).send("Error reading posts file");
            return;
        }

        posts = posts.filter(post => post.id !== id);

        try {
            await fs.writeFile(postFile, JSON.stringify(posts, null, 2), "utf8");
            res.sendStatus(204);
        } catch (err) {
            console.error("Error deleting post:", err);
            res.status(500).send("Error deleting post");
        }
    }
};
