const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.get('/',(req,res)=>{
    
    res.render('homepage',{cookies:req.cookies.jwt})
})

router.get('/logout',(req,res)=>{
    
   res.clearCookie('jwt')
    
      res.redirect('/pages')
    
})
module.exports=router