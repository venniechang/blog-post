const express = require('express');
const morgan = require('morgan');
const app = express();
//const blogPostsRouter = require('./blogPostsRouter');
app.use(morgan('common'));
app.use(express.json());

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {blogPost} = require('./models');
//app.use('/blog-posts', blogPostsRouter);

let server;

function runServer(databaseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer(){
  return mongoose.disconnect().then(() => {
    return new promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}


app.get('/posts', (req, res) => {
  blogPost
  .find()
  .then(posts => {res.json(posts.map(post => post.serialize()));
  })
  .catch(
    err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
  });
});

app.get('/posts/:id', (req, res) => {
  blogPost
  .findById(req.params.id)
  .then(post => res.json(post.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

app.post('/posts', (req, res) => {
  const requiredFields = ['content', 'author', 'title'];
  for(let i = 0; i <= requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)){
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  blogPost
    .create({
      content: req.body.content,
      author: req.body.author,
      title: req.body.title,
  })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

app.put('/posts/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (`Request path id (${req.params.id}) and request body id ` + `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updatableFields = ['title', 'author', 'content'];

  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  blogPost
  .findByIdAndUpdate(req.params.id, {$set: toUpdate})
  .then(updatedPost => res.status(204).end())
  .catch(error => res.status(500).json({message: 'Internal server error'}));
});

app.delete('/blog-posts/:id', (req, res) =>{
  blogPost
  .findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleted blog post with id \`${req.params.id}\``);
    res.status(204).end();
  })
  .catch(err => res.status(500).json({message: 'Internal server error'}))
});



if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

