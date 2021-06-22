const express = require('express');

const {Post} = require('../models');

const router = express.Router();

router.post('/',async (req,res,next)=>{
    try{
        const post = await Post.create({
            content : req.body.content,
            name: req.body.name,
            password: req.body.password,
        });
        res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports=router;