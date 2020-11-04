// mongoAtlas = {
//   username: faiz
//   password: TZcPaRJ2ihvOCIKo
// }

const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');

//use lodash
var _ = require('lodash');

//the database
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://faiz:TZcPaRJ2ihvOCIKo@cluster0.uvp4c.mongodb.net/todolistDB?retryWrites=true&w=majority', {
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
  list: String

});

const worksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  list: String

});

const customListNamesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  list: String
});

//compile schema to model
const Item = mongoose.model('Item', itemsSchema);

const Work = mongoose.model('Work', worksSchema);

const customListM = mongoose.model('customList', customListNamesSchema);

//tell our app to use EJS
app.set('view engine', 'ejs');

//tell our app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//tell express serever to use static file called "public" or whatever
app.use(express.static('public'));

//handling get request in root dir
app.get('/', (req, res) => {

  Item.find({}, (err, results) => {
    res.render('list', {
      title: 'ToDo',
      todo: results
    });
  });

});

//handling post request in root dir
app.post('/', (req, res) => {

  if (req.body.list === 'ToDo') {
    const item = new Item({
      name: 'ToDo',
      list: req.body.myInput
    });
a
    item.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.body.myInput + " has been saved!");
        res.redirect('/');
      }
    });
  } else if (req.body.list === 'Work') {
    const work = new Work({
      name: 'Work',
      list: req.body.myInput
    });

    work.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.body.myInput + " has been saved!");
        res.redirect('/work');
      }
    });
  }
  else {
    lowF = _.lowerFirst(req.body.list);
    const customList = new customListM({
      name: lowF,
      list: req.body.myInput
    });

    customList.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(req.body.myInput + " has been saved!");
        res.redirect('/'+lowF);
      }
    });
  }

});

app.get('/work', (req, res) => {

  Work.find({}, (err, results) => {
    res.render('list', {
      title: 'Work',
      todo: results
    });
  });

});

app.get('/:customListName', function(req, res) {

  const customListName = req.params.customListName;
  customListM.find({name: customListName}, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      const upF = _.upperFirst(customListName);
      res.render('list', {
        title: upF,
        todo: results
      });
    }
  });

});

app.post('/delete', (req, res) => {

  if(req.body.customList === 'ToDo') {Item.findByIdAndRemove(req.body.myCheckbox, ({useFindAndModify: false}), () => {
      res.redirect('/');
    });
  }
  else if (req.body.customList === 'Work') {
    Work.findByIdAndRemove(req.body.myCheckbox, ({useFindAndModify: false}), () => {
      res.redirect('/work');
    });
  }
  else{
    customListM.findByIdAndRemove(req.body.myCheckbox, ({useFindAndModify: false}), () => {
      lowF = _.lowerFirst(req.body.customList);
      res.redirect('/'+lowF);
    });
  }

});


//listening port
app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port ' + port);
});
