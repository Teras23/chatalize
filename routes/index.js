let express = require('express');
let fs = require('fs');
let path = require('path');
let router = express.Router();

const messagesFolder = 'messages';

/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readdir(messagesFolder, (err, files) => {
    files.forEach(file => {
      readChat(file)
    });
    res.render('index', { title: 'Express', files: files});
  });
});

router.get('/chat/:chatName', (req, res) => {
  console.log(req.params);
  res.render('chat', { test: req.params['chatName'] });
});

function readChat(folder) {
  fs.readFile(path.join(messagesFolder, folder, 'message.json'), 'utf-8', (err, file) => {
    console.log(file);
  });
}

module.exports = router;
