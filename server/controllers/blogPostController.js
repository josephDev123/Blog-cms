import {Post} from '../models/Blog.js';
import {wrap}  from './asyncWrapper.js'

export const AddBlog = (req, res)=>{
   const post = req.body;
  
    const createPost = new Post({
        creator: post.creator,
        title: post.title,
        image_link: post.image_link,
        content: post.content,
        category: post.categories,
        storage_ref: post.imageRefInFirebase
    })

    createPost.save(error=>{
        return error ? res.json({'message': 'Post fails'}):res.json({'message': 'post submitted successfully'})
    })   

}


export const GetPostsCreatedByPagination = async (req, res)=>{
    try{
        const page = parseInt(req.query.query);

        const limit = 3;
        const skip = (page - 1) * limit;
        //fetch post counts
        // const counts = await Post.countDocuments();
        // const postCounts = await counts;
        //fetch post by pagiantion
        const paginatePosts = await Post.find({}, null , {skip:skip, limit:limit});
        const finalpaginatePost = await paginatePosts;
        return res.json(finalpaginatePost);
        }catch(e){
        res.json(e.message);
    }
}

export const editBlogPost = async (req, res)=>{
    const id = req.params.id;
    const {storage_ref, firebaseImage_link, title, category, blogPost} = req.body;
    // console.log(title, category, post, creator, image_link)

    try{
        const post = await Post.updateOne( {_id:id}, 
           {
              $set:{
                // 'creator':creator,
                'storage_ref':storage_ref,
                'title':title,
                'image_link':firebaseImage_link,
                'content':blogPost,
                'category':category
            
              }
             }
     );
        res.status(200).json({message:'success'});
       
    }catch(error){
        res.status(400).json({'error':error.message})
        console.log('sorry')
    }
}
 
export const allPost = (req, res)=>{
    res.json('all post');
}

//fetch category  column from post
export const allCategoriesPost = async (req, res)=>{
    try{
        const limit = req.query.id;
        const Blog = await Post.find().limit(limit);
        res.send(Blog);
        
    }catch(error){
        res.send(error.message);
    }

}


//query db by category || empty query
export const allPostByCategories = wrap( async (req, res)=>{
  
        const {body} = req.body;
        if(body){
            const skip = req.query.query * 5
            console.log( req.query.query)
            const limit = 5;
            const posts =  await Post.find( {"category":body}, null, {skip:skip, limit:limit});
            res.send(posts);
        }else{
            const skip = req.query.query * 5
            const limit = 5;
            const posts =  await Post.find({skip:skip, limit:limit});
            res.send(posts);
        }
})

//query db by post id
export const PostById = async (req, res)=>{
    try {
        const id = req.query.query;
        if(id){
            const post =  await Post.find( {"_id":id}, null);
            res.send(post);
        }
        
    } catch (error) {
        res.send(error.message);
    }
}

export async function getAllPostsOfCurrentAuthUser(req, res){
    try {
        const user = req.headers.currentuser;
        // console.log(user)
        const skip = parseInt(req.query.query)* 5;
        // console.log(skip)
        const getUserPost = await Post.find({creator:user}, null, {skip, limit:5});
         res.status(200).json({'data':getUserPost})
        // console.log(getUserPost)
        res.end() 
    } catch (error) {
        res.status(500).json({'error':error.message})
    }
    
}


export async function deleteBlogPost(req, res){
    const {id} = req.params;
  
    try{
    const blogPost = await Post.deleteOne({_id:id});
    if(blogPost.acknowledged === true){
        // console.log(blogPost)
        res.status(200).send('success');
    }
    }catch(err){
        res.status(400).json({error:true});
    }

}


