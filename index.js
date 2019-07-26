// implement your API here

const express = require('express');
const db = require('../webapi-i-challenge/data/db');

const server = express();

server.use(express.json());

server.get('/', (request, response) => {
  response.send('Hello World from express!!');
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    /*cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.

cancel the request.
respond with HTTP status code 500 (Server Error).
return the following JSON object: { error: "There was an error while saving the user to the database" }.
*/
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    /*
save the new user the the database.
return HTTP status code 201 (Created).
return the newly created user document.
*/

    db.insert({ name, bio })
      .then(user => {
        res.status(201).json({ success: true, user });
      })
      .catch(err => {
        res.status(500).json({
          success: false,
          err,
          errorMessage: 'Please provide name and bio for the user.'
        });
      });
  }
});
server.get('/api/users', (req, res) => {
  /*
    If there's an error in retrieving the users from the database:
cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The users information could not be retrieved." }.
*/
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.'
      });
    });
});

server.get('/api/users/:id', (req, res) => {
  /*
    If the user with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The user with the specified ID does not exist." }.
If there's an error in retrieving the user from the database:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The user information could not be retrieved." }.
    */
  db.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be retrieved.' });
    });
});

server.delete('/api/users/:id', (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count && count > 0) {
        res.status(200).json({
          message: 'the user was deleted.'
        });
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  } else {
    db.update(req.params.id, req.body)
      .then(user => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({
            message: 'The user with the specified ID does not exist.'
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          errorMessage: 'The user information could not be modified.'
        });
      });
  }
});

server.listen(4000, () => {
  console.log('server listening on port 4000');
});
