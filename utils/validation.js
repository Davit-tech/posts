import { validate as uuidValidate } from "uuid";

export const validatePostData = ({ title, author, text }) => {
    const errors = [];
    if (!title || typeof title !== "string" || title.length < 3 || title.length > 100) {
        errors.push("Title must be a string between  and 100 characters.");
    }
    if (!author || typeof author !== "string" || author.length < 1 || author.length > 50) {
        errors.push("Author must be a string between 1 and 50 characters.");
    }
    if (!text || typeof text !== "string" || text.length < 3) {
        errors.push("Text must be a string with at least 10 characters.");
    }
    return errors;
};

export const isValidUUID = (id) => uuidValidate(id);

export const getTodaysPostsCount = (posts, createdAt) => {

    return posts.filter(post => post.createdAt === createdAt).length;
};
