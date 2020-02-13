const express = require('express');

const router = express.Router();

const Users = require('./userDb')


router.post('/', validateUser, (req, res) => {
  Users.insert(req.body).then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    res.status(500).json({message: "Error creating user."})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  let { id } = req.params;
  let changes = req.body;
  Users.insert(id, changes).then(user => {
    res.status(200).json(changes);
  })
  .catch(err => {
    res.status(500).json({message: "Post could not be created."})
  })
  })

router.get('/', (req, res) => {
  Users.get().then(users => {
    res.status(200).json(users);
  }).catch(error => {
    res.status(500).json({message: "Error retrieving posts."});
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  let { id } = req.params;
  Users.getUserPosts(id).then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    res.status(500)
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  let { id } = req.params;
  Users.remove(id).then(user => {
    res.status(200).json({message: "User has been nuked."})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  let { id } = req.params;
  let text = req.body;
  Users.update(id, text).then(user => {
    res.status(200).json(text)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: "Error updating the user"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then(user => {
    if(user){
      req.user = user;
      next();
    } else {
      res.status(400).json({message: "Invalid user id"});
      next();
    }
  })
}

function validateUser(req, res, next) {
  let body = req.body;
  if(req.body.name){
    req.user = req.body.name
    next();
  }
  else {
    console.log("POST BODY:", req.body)
    res.status(400).json({message: "Missing required text field"})
  }
}

function validatePost(req, res, next) {
  if(req.body){
    next();
  }
  else {
    console.log("POST BODY:", req.body)
    res.status(400).json({message: "Missing required text field"})
  }
}

module.exports = router;
