const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken') 
const bcrypt = require('bcryptjs')

const maxAge= 60 *60 * 24
const createToken = (id)=>{
  return jwt.sign({id},'It is secret',{expiresIn:maxAge})
}

router.get('/register',(req,res)=>{
  
  res.render('index',{ 
    report:null,
    user:null,
    cookies:req.cookies.jwt
    });
})


router.get('/login',(req,res)=>{
  
  if(!req.cookies.jwt) res.render('login',{report:null,user:true,cookies:req.cookies.jwt});
  else res.redirect('/pages/')
})

router.post('/register',async(req,res)=>{
  
  console.log(req.body)
     const {username,email}= req.body;

    const user =await Blog.findOne({email}) 
    const name =await Blog.findOne({username}) 
    if(name){
      return res.render('index',{
        report:'Username is already exists',
        user:name,
        cookies:req.cookies.jwt
      })
     }
   else if(user) {return res.render('index',{
      report:'Email is already exists',
      user:user,
      cookies:req.cookies.jwt
    })}
    
    const blog = new Blog(req.body);

    blog.save()
    .then(result => console.log(result))
    .catch(err => console.log(err))
    req.session.isAuth=true
    res.redirect(`/success/${blog._id}#connect`);

});


router.post('/login',async(req,res)=>{
    const {username,password} = req.body;
    const user =await Blog.findOne({username})
    if(!user) 
      return res.render('login',{report:"This user does not exist",user:user,cookies:req.cookies.jwt});
     else{  const auth = await bcrypt.compare(password,user.password)
        if(auth){
           
            const token = createToken(user._id)
            res.cookie('jwt',token,{httpOnly:true ,maxAge:maxAge*1000})
             req.session.isAuth=true
          
              res.redirect(`/success/${user._id}#connect`);
        }
        else res.render('login',{report:"Password is wrong",user:auth,cookies:req.cookies.jwt});
    }
      
});


module.exports = router

