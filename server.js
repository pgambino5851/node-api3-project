const express = require('express');

const server = express();

server.use(express.json());

const postRouter = require("./posts/postRouter")

const userRouter = require("./users/userRouter")

server.use("/api/posts", logger, postRouter)

server.use("/api/users", logger, userRouter)

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const date = new Date();
  let formattedDate = date.toISOString()
  console.log(`${req.method} Request to ${req.originalUrl} at ${formattedDate}`)
  next();
}

module.exports = server;
