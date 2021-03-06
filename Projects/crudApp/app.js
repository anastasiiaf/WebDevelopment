// https://www.youtube.com/watch?v=CyTWPr_WwdI - MongoDB tutorial
// Git source : https://github.com/noobcoder1137/Todo_Rest_CRUD_Application_JQuery_FetchAPI/blob/master/app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Joi = require('joi');
const db = require('./db');

const collection = 'todos';
const app = express();

// creates schema for data validation
const schema = Joi.object().keys({
  todo: Joi.string().required(),
});

//parses json data sent by the user
app.use(bodyParser.json());

// serve static html to user
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// get todos from database and send them as json
app.get('/getToDos', (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, documents) => {
      if (err) {
        console.log(err);
      } else {
        console.log(documents);
        res.json(documents);
      }
    });
});

// update todo entry in database
app.put('/:id', (req, res) => {
  const todoID = req.params.id;
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      },
    );
});

// create todo
app.post('/', (req, res) => {
  const userInput = req.body;

  Joi.validate(userInput, schema, (err, result) => {
    if (err) {
      const error = new Error('Invalid Input');
      error.status = 400;
      next(error);
    } else {
      db.getDB()
        .collection(collection)
        .insertOne(userInput, (err, result) => {
          if (err) {
            const error = new Error('Failed to insert ToDo');
            error.status = 400;
            next(error);
          } else {
            res.json({
              result: result,
              document: result.ops[0],
              msg: 'Inserted ToDo',
              error: null,
            });
          }
        });
    }
  });
});

// delete todo from database
app.delete('/:id', (req, res) => {
  const todoID = req.params.id;

  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(todoID) }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
});

// handling error
app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: { message: err.message },
  });
});

db.connect((err) => {
  if (err) {
    console.log('Unable to connect to database');
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log('Connected to database');
    });
  }
});
