const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean true when username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  // code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: 'Username or password is missing' });
  }
  //User authentication
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 30 * 60 } //Token valid for 30min
    );

    // Use session storage for token and username
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send(`Hello ${username}, you are logged in`);
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  const user = req.session.authorization.username;
  const review = req.body.review;
  if (!isNaN(ISBN) && ISBN > 0) {
    if (!books[ISBN]) {
      return res
        .status(400)
        .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
    } else {
      if (!review) {
        return res.status(401).send(`Your review is ${review}`);
      }
      if (review.length < 5) {
        return res.status(402).send(`Your review is too short: ${review}`);
      }
      //If the current user has written a review to this book in the past... then it will be updated
      //otherwise it posts the new review to the books review object
      books[ISBN].reviews[user] = review;
      return res.status(200).send(`Hello ${user}, thanks for your review`);
    }
  } else {
    return res.status(400).json({ message: 'This is not a valid ISBN number' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  const user = req.session.authorization.username;
  if (!isNaN(ISBN) && ISBN > 0) {
    if (!books[ISBN]) {
      return res
        .status(400)
        .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
    } else {
      if (!books[ISBN].reviews[user]) {
        return res
          .status(404)
          .json({ message: 'There is no review to be deleted' });
      }
      res.status(200).json({
        message: `Your review [ ${books[ISBN].reviews[user]} ] was deleted`,
      });
      delete books[ISBN].reviews[user];
    }
  } else {
    return res.status(400).json({ message: 'This is not a valid ISBN number' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
