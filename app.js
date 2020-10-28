const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

//use lodash
var _ = require('lodash');

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
  },
  list: {
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

const customListNamesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  list: {
    type: String,
    required: true
  }
});

//compile schema to model
const Item = mongoose.model('Item', itemsSchema);

const Work = mongoose.model('Work', worksSchema);

const customListM = mongoose.model('customList', customListNamesSchema);

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

  Item.find({}, (err, results) => {
    res.render('list', {
      title: 'ToDo List',
      todo: results,
      customListName: customListName
    });
  });

  // //find documents
  // Item.find({}, (err, results) => {
  //   if (results.length === 0) {
  //     //save those data to database
  //     Item.insertMany(defaultItems, (err) => {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         console.log("Saved!");
  //       }
  //     });
  //     res.redirect('/');
  //   } else {
  //     res.render('list', {
  //       title: 'ToDo List',
  //       todo: results
  //     });
  //   }
  // });
});

//handling post request in root dir
app.post('/', (req, res) => {
  const item = new Item({
    name: 'ToDo',
    list: req.body.myInput
  });

  item.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Saved!");
      res.redirect('/');
    }
  });
});

// //handling get request at work dir
// app.get('/work', (req, res) => {
//
//   Work.find({}, (err, results) => {
//     res.render('list', {
//       title: '',
//       todo: results
//     });
//   });
// });

app.get('/:customListName', function(req, res) {
  customListName = req.params.customListName;
  customListM.find({
    name: customListName
  }, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const upF = _.upperFirst(customListName);
      res.render('list', {
        title: upF,
        todo: results,
        customListName: customListName
      });
    }
  });
});

let customListName = [];

app.post('/:customListName', (req, res) => {
  customListName = req.params.customListName;
  const customList = new customListM({
    name: customListName,
    list: req.body.myInput
  });
  customList.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.myInput + " has been saved!");
      res.redirect(customListName);
    }
  });
});

app.post('/:customListName', (req, res) => {
  customListName = req.params.customListName;
  customListM.findByIdAndRemove(req.body.myCheckbox, ({
    useFindAndModify: false
  }), () => {
    console.log('Deleted!');
    res.redirect(customListName);
  });
});



//listening port
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port ' + port);
});
