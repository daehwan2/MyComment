const express = require('express');

const { Post } = require('../models');
const router = express.Router();

router.post('/:id', (req, res, next) => {
    Post.findOne({ wehre: { id: req.params.id } })
        .then(async (post) => {
            if (post.password === req.body.password) {
                try {
                    const result = await Post.destroy({ where: { id: req.params.id } });
                    res.json(result);
                } catch (err) {
                    console.error(err);
                    next(err);
                }
            } else {
                try{
                    const posts = await Post.findAll({
                        order:[['createdAt','ASC']],
                    });
                    res.render('main',{
                        posts,pass:false
                    });
                }catch(err){
                    console.error(err);
                    next(err);
                }
            }
        })
        .catch((err) => {
            console.error(err);
            next(err);
        });
});
module.exports = router;