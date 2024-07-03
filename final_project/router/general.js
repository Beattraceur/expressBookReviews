const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  if (!isNaN(ISBN) && ISBN > 0) {
    if (!books[ISBN]) {
      return res
        .status(400)
        .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
    } else {
      return res.send(JSON.stringify(books[ISBN], null, 3));
    }
  } else {
    return res.status(400).json({ message: 'This is not a valid ISBN number' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const reqAuthor = req.params.author;

  let matchingBooks = {};

  Object.keys(books).forEach((key) => {
    const book = books[key];
    if (book.author === reqAuthor) {
      matchingBooks[key] = book;
    }
  });
  if (Object.keys(matchingBooks).length === 0) {
    return res.status(400).json({
      message: `No matching Book with the author: ${reqAuthor} was found`,
    });
  } else {
    return res.send(JSON.stringify(matchingBooks, null, 3));
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
