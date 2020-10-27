const { AuthenticationError } = require('apollo-server');
const Post = require('../../Models/Post');
const authCheck = require('../../utils/authCheck');


module.exports = {
  Query:{
    async getPosts(){
      try {
        const posts = await Post.find().sort({createdAt: -1})
        return posts
      } 
      catch (err) {
        throw new Error(err.message)
      }
    },
    async getPost(_, {postId}){
      try {
        const post = await Post.findById(postId)
        if(post){
          return post
        }else{
          throw new Error('Post not found')
        }
      } 
      catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation:{
    async createPost(_, { body }, context){
      const user = authCheck(context)
      console.log('USER', user)
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      const savedPost = await newPost.save()
      return savedPost;
    },
    async deletePost(_, { postId }, context){
      const user = authCheck(context)
      try {
        const post = await Post.findById(postId)
        if(user.username === post.username){
          await post.delete()
          return 'Post deleted successfully'
        }
        else{
          throw new AuthenticationError('Action not allowed')
        }  
      } 
      catch (err) {
        throw new Error(err)
      }
    }
  }
}