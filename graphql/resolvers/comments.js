const Post = require('../../models/Post')
const checkAuth = require('../../utils/checkAuth')
const {UserInputError, AuthenticationError} = require('apollo-server')
const posts = require('./posts')


module.exports = {
    Mutation : {
        createComment : async (_, { postId, body }, context) => {
            const { username } = await checkAuth(context)
            const post = await Post.findById(postId)
            if(post){
                post.comments.unshift({
                    body : body,
                    username : username,
                    createdAt : new Date().toISOString()
                })
                const result = post.save()
                return result
            }
            else{
                throw new UserInputError("Post not found ", {
                    errors : {
                        comment : "Post not found"
                    }
                })
            }
        },
        deleteComment : async (_, {postId, commentId},context) => {
            const { username }= await checkAuth(context)
            const post = await Post.findById(postId)
            if(post){
                const commentIndex = post.comments.findIndex((c) => c.id === commentId )
                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return post
                }else throw new AuthenticationError("Not authorized to delete this post")
            }else{
                throw new UserInputError("Post not found")
            }
        }
    }
}