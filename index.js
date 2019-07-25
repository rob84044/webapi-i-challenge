// implement your API here

const express = require('express');
const db = require('../webapi-i-challenge/data/db');

const server = express();

server.use(express.json());

server.get('/', (request, response) => {
  response.send('Hello World from express!!');
});

server.get('/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

server.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then((user, id) => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

server.post('/users', (req, res) => {
  const { name, bio } = req.body;

  if ((name)&& (bio)){
     db.insert({ name, bio })
    .then(user => {
      res.status(201).json({ success: true, user });
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        err,
        errorMessage: 'Please provide name and bio for the user.'
      });
    });
});
  }
 

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id).then(deleted => {
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({
        success: false,
        message: 'I cannot find the user you are looking for'
      });
    }
  });
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const userInfo = req.body;
  console.log(userInfo);
  db.update(id, userInfo)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: 'I cannot find the user you are looking for'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ success: false, err });
    });
});

server.listen(4000, () => {
  console.log('server listening on port 4000');
});
