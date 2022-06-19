const express = require('express');
const  mongoose = require('mongoose');
const app = express();
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const Blog = require('./models/blog');
const router = require('./routes/add-blog');
const router2 = require('./routes/account');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')

//const dbURI = 'mongodb+srv://user:test1234@cluster1.4t8qv.mongodb.net/tutorial?retryWrites=true&w=majority';
const dbURI = 'mongodb://localhost:27017/session';

mongoose.connect(dbURI,{ useNewUrlParser: true ,useUnifiedTopology: true ,useCreateIndex:true})
.then(result => console.log('connect'))
.catch(err=>console.log(err));

app.set('view engine','ejs')


app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 
  },
  store: new MongoDBStore({
    uri: dbURI,
    collection: 'mySessions'
  }),
  resave: true,
  saveUninitialized: false
}));

app.use(cookieParser())
 app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/routes',router);
app.use('/pages',router2);

const middleWare = async(req,res) =>{
  
  const token = req.cookies.jwt 
 
  if(token){
    jwt.verify(token,'It is secret',async(err,result)=>{
      if(err) res.redirect('/routes/login')
      else{
        const _find = await Blog.findById(result.id)
        res.locals.findName = _find.username
        res.render('logout',{cookies:req.cookies.jwt})
      }
    })
  }
  else{
    res.redirect('/pages')
  }
  
}

app.get('/add',(req,res)=>{
    Blog.find()
    .then(respond=> res.send(respond))
    .catch(err => console.log(err))
});

app.get('/success/:id',middleWare)


app.listen(3000,()=>{
   
});