const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')
const { UserInputError } = require('apollo-server')
module.exports = {
    Query : {
        getPosts : async () => {
            try{
                const posts = await Post.find().sort({createdAt : -1});
                console.log("POSTSSSSS : ",posts[0])
                return posts;
            } catch{
                throw new Error(err);
            }
            
        },
        getPost : async (_ , { postId} ) => {
            try{
                const post = await Post.findById(postId)
                if(post){
                    return post
                }else{
                    throw new Error("Post not found")
                }
            }catch(err){
                return err
            }
        },

    },
    Mutation : {
        createPost : async (_, { body }, context) => {
            const user = await checkAuth(context)
            if(body.trim() === ''){
                return new Error("post must not be empty");
            }
            const newPost = new Post({ 
                username : user.username, 
                body : body,
                createdAt : new Date().toISOString(),
                user : user.id 
            })
            const post = await newPost.save()
            context.pubsub.publish('NEW_POST', {
                newPost : post
            });
            return post
        },
        deletePost : async (_ , { postId }, context) => {
            const user = await checkAuth(context)
            const post = await Post.findById(postId)
            if(post.username === user.username){
                await post.delete()
                return "Post Deleted Successfully"
            }
            else{
                throw new Error("Not authorized to delete this post")
            }
        },
        likePost : async (_ ,{ postId }, context) => {
            const { username } = await checkAuth(context);
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username);
                }
                else{
                    post.likes.push({
                        username : username,
                        createdAt : new Date().toISOString()
                    });
                }
                await post.save();
                return post
            }else{
                throw new UserInputError("Post not found");
            }
        },
    },
    Subscription : {
        newPost : {
            subscribe : (_, __, { pubsub}) => pubsub.asyncIterator("NEW_POST")
        }
    }
}