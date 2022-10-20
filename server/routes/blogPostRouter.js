import express from 'express';
import {AddBlog, editBlog, allPost, allPostByCategories, allCategoriesPost, GetPostsCreatedByPagination, PostById} from '../controllers/blogPostController.js';


const blogPostRouter = express.Router();

blogPostRouter.post('/create-post', AddBlog);
blogPostRouter.get('/all-post-pagination', GetPostsCreatedByPagination);
blogPostRouter.get('/edit', editBlog);
blogPostRouter.get('/all-post', allPost);
blogPostRouter.get('/all-post/categories', allCategoriesPost);
blogPostRouter.get('/post/bycategories', allPostByCategories);
blogPostRouter.get('/post/byId', PostById);


export default blogPostRouter;