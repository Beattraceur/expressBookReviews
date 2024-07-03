const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: `User: ${username} successfully registered. Now you can login`,
      });
    } else {
      return res
        .status(404)
        .json({ message: `User: ${username} already exists!` });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({
    message:
      'Unable to register user. Please provide a valid username and password',
  });
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   return res.send(JSON.stringify(books, null, 3));
// });

//Simulate delayed books API
const bookPromise = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 3000); //Promise resolves after 3sec
  });
//Async book list
public_users.get('/', async function (req, res) {
  try {
    const bookList = await bookPromise();
    res.send(JSON.stringify(bookList, null, 3));
  } catch (error) {
    console.error(error.toString());
    res.status(500).json({ message: 'Error while fetching booklist' });
  }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const ISBN = req.params.isbn;
//   if (!isNaN(ISBN) && ISBN > 0) {
//     if (!books[ISBN]) {
//       return res
//         .status(400)
//         .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
//     } else {
//       return res.send(JSON.stringify(books[ISBN], null, 3));
//     }
//   } else {
//     return res.status(400).json({ message: 'This is not a valid ISBN number' });
//   }
// });

//ASYNC Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  if (!isNaN(ISBN) && ISBN > 0) {
    try {
      const bookList = await bookPromise();
      if (!bookList[ISBN]) {
        return res
          .status(400)
          .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
      } else {
        return res.send(JSON.stringify(bookList[ISBN], null, 3));
      }
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ message: 'Error while fetching booklist' });
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
  const reqTitle = req.params.title;

  let matchingBooks = {};

  Object.keys(books).forEach((key) => {
    const book = books[key];
    if (book.title === reqTitle) {
      matchingBooks[key] = book;
    }
  });
  if (Object.keys(matchingBooks).length === 0) {
    return res.status(400).json({
      message: `No matching Book with the title: ${reqTitle} was found`,
    });
  } else {
    return res.send(JSON.stringify(matchingBooks, null, 3));
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  if (!isNaN(ISBN) && ISBN > 0) {
    if (!books[ISBN]) {
      return res
        .status(400)
        .json({ message: `none of the Books has the ISBN number: ${ISBN}` });
    } else {
      return res.send(JSON.stringify(books[ISBN].reviews, null, 3));
    }
  } else {
    return res.status(400).json({ message: 'This is not a valid ISBN number' });
  }
});

module.exports.general = public_users;
