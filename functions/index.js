const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');

admin.initializeApp()

let db = admin.firestore();
let messages = db.collection('messages');

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  let message = req.body.message;
  if (message && message.length <= 36) {
    let data = {
      message: message,
      created_at: new Date()
    }
    messages.add(data)
      .then(docRef => {
        res.json({
          id: docRef.id
        });
        console.log(docRef.id + ": " + message);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  } else {
    console.error("文字数制限");
    res.redirect('/');
  }
})

app.get('/:id', (req, res) => {
  messages.doc(req.params.id).get()
    .then(doc => {
      if (!doc.exists) {
        res.redirect('/');
      } else {
        let message = doc.data().message;
        res.render('game', {
          message: message
        })
        console.log(message);
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
});

app.use(function (req, res, next) {
  res.status(404);
  res.redirect('/');
});

exports.app = functions.https.onRequest(app);