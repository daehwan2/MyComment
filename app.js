const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config();
const pageRouter = require('./routes/page');
const postRouter = require('./routes/post');
const deleteRouter = require('./routes/delete');
const editRouter = require('./routes/edit');
const {sequelize} = require('./models');
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();
app.set('port',process.env.PORT || 8001);
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});

sequelize.sync({force:false})
.then(()=>{
    console.log('데이터베이스 연결 성공');
})
.catch((err)=>{
    console.error(err);
});
if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'));
    app.use(helmet({contentSecurityPolicy:false}));
    app.use(hpp());
}else{
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption ={
    resave:false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
};
if(process.env.NODE_ENV === 'production'){
    sessionOption.proxy = true;
    //sessionOption.cookie.secure=true;
}
app.use(session(sessionOption));

app.use('/',pageRouter);
app.use('/post',postRouter);
app.use('/delete',deleteRouter);
app.use('/edit',editRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url}라우터가 없습니다.`);
    error.status =404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
});

app.use((err,req,res,next)=>{
    res.locals.message=err.message;
    res.locals.error= process.env.NODE_ENV !== 'production' ? err:{};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
});