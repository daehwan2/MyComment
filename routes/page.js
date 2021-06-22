const express = require('express');
const router = express.Router();
const {Post} = require('../models');

router.get('/',async (req,res,next)=>{
    try{
        const posts = await Post.findAll({
            order:[['createdAt','ASC']],
        });
        res.render('main',{
            posts,pass:true
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;