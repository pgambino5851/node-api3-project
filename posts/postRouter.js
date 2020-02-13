const express = require('express');

const router = express.Router();

const Posts = require('./postDb')

router.get('/', (req, res) => {
  Posts.get().then(posts => {
    res.status(200).json(posts);
  }).catch(error => {
    res.status(500).json({message: "Error retrieving posts."});
  })
});

router.get('/:id', validatePostId,  (req, res) => {
  res.status(200).json(req.post)
  });


router.delete('/:id', validatePostId, (req, res) => {
  let { id } = req.params;
  Posts.remove(id).then(post => {
    res.status(200).json({message: "the post has been nuked"})
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "Error removing the post"})
  })
});

router.put('/:id', validatePostId,  (req, res) => {
  let { id } = req.params;
  let text = req.body;
  Posts.update(id, text).then(post => {
    res.status(200).json(text)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "Error updating the post"})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id).then(post => {
    if(post){
      req.post = post;
      next();
    } else {
      res.status(400).json({message: "Invalid post id"});
      next();
    }
  })
}

module.exports = router;
