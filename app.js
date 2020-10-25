const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

//the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//make a connection to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("Connected to the Server");
});

//make a new schema
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }

});

const worksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }

});

//compile schema to model
const Item = mongoose.model('Item', itemsSchema);

const Work = mongoose.model('Work', worksSchema);

//create some data to save in database
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new List"
});

const item3 = new Item({
  name: "<-- Hit this to delete a List"
});

const defaultItems = [item1, item2, item3];

//tell our app to use EJS
app.set('view engine', 'ejs');

//tell our app to use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//tell express serever to use static file called "public" or whatever
app.use(express.static('public'));

//handling get request in root dir
app.get('/', (req, res) => {
  let today = new Date();
  currentDay = today.getDay();
  let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  let day = today.toLocaleDateString('id-ID', options);

  //find documents
  Item.find({}, (err, results) => {
    if (results.length === 0) {
      //save those data to database
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved!");
        }
      });
      res.redirect('/');
    } else {
      res.render('list', {
        title: 'ToDo List',
        todo: results
      });
    }
  });
});

//handling post request in root dir
app.post('/', (req, res) => {
  console.log(req.body.list);
  if (req.body.list === 'ToDo') {
    const item = new Item({
      name: req.body.myInput
    });

    item.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Saved!");
      }
    });
    res.redirect('/');
  }
  else{
    const work = new Work({
      name: req.body.myInput
    });

    work.save((err) => {
      if(err){
        console.log(err);
      }
      else{
        console.log('Saved!');
      }
    });
    res.redirect('/work');
  }
});

//handling get request at work dir
app.get('/work', (req, res) => {

  Work.find({}, (err, results) => {
    res.render('list', {
      title: 'Work List',
      todo: results
    });
  });
});

//listening port
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port ' + port);
});
