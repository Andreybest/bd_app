var express = require('express');
var app = express();
const path = require('path');
var bodyParser = require('body-parser')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : '22_03_2019_bd'
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
    connection.query('SELECT * FROM студенты', function (error, results, fields) {
        if (error) throw error;
        //console.log("lol");
        // connected!
        //console.log(results);
      });
  });

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/html/index.html'));
});

app.get('/students', function (req, res) {
  connection.query('SELECT * FROM студенты', function (error, results, fields) {
    if (error) throw error;
    // connected!
    res.send(results);
  });
});

app.get('/register_info', function (req, res) {
  let info = {};
  connection.query('SELECT * FROM льготы', function (error, results, fields) {
    if (error) throw error;
    // connected!
    info.socials = results;
    connection.query('SELECT * FROM комнаты', function (error, results) {
        if (error) throw error;
        info.rooms = results.length;
        res.send(info);
    });
  });
});

app.get('/register', function (req, res) {
    res.sendFile(path.join(__dirname+'/html/register.html'));
});

app.post("/register_student", urlencodedParser, function(req, res) {
    //console.log(req.body);
    let query = connection.query("INSERT INTO студенты (ФИО, Год_рождения, Пол, Адрес, Группа, Код_льготы, №_паспорта, №_комнаты) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
    [
        req.body.full_name,
        parseInt(req.body.year),
        req.body.sex,
        req.body.street,
        req.body.group,
        req.body.social,
        req.body.passport_num,
        parseInt(req.body.room_num)
    ],
    function (error, results, fields) {
      if (error) {
        res.redirect("/error");
        console.log(error);
      }
      else {
          //console.log(fields);
          res.redirect("/");
      }
    }
    );
    console.log(query.sql);
    //res.send('You sent the name "' + req.body.full_name + '".');
})

app.get("/error", function(req, res) {
  res.sendFile(path.join(__dirname+'/html/error.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


// Last working version.
// Last edit: 22.03.2019 15:56;