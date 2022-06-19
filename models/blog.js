const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const blogSchema = new Schema({
    
    username: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        index:true,
        unique:true
    },
    password: {
        type:String,
        required:true,
        
    }
     
},{timestamps :true});


blogSchema.pre('save',async function(next){
    const salt =await bcrypt.genSalt();
    this.password =await bcrypt.hash(this.password,salt)
    next()
})


const Blog = mongoose.model('Blog',blogSchema); 

module.exports =Blog;