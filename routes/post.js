import express from 'express';
import postController from "../controllers/postController.js";

const router = express.Router();

router.get("/addPost", postController.getAddPost);
router.post("/addPost", postController.addPost);
router.get("/posts", postController.getPosts);
router.get("/posts/:id", postController.getPost);
router.get("/posts/:id/edit", postController.getEditPost);
router.put("/posts/:id/edit", postController.editPost);

router.delete("/posts/:id", postController.deletePost);


export default router;
