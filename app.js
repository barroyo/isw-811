const express = require("express");
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/todo-api");
const app = express();
const Task = require("../todo-api-express/models/taskModel");
const basicAuth = require('express-basic-auth')
const {
  base64decode
} = require('nodejs-base64');

const {
  postMethod,
  getMethod
} = require("./controllers/todoController.js");
const cors = require("cors");

const bodyParser = require("body-parser");

// check for cors
app.use(cors());

// custom basic authentication
app.use(function (req, res, next) {
  if (req.headers["authorization"]) {
    const authBase64 = req.headers['authorization'].split(' ');
    const userPass = base64decode(authBase64[1]);
    const user = userPass.split(':')[0];
    const password = userPass.split(':')[1];

    //
    if (user === 'admin' && password == '1234') {
      next();
      return;
    }
  }
  res.status(401);
  res.send({
    error: "Unauthorized "
  });
});

// using basic auth
// app.use(basicAuth({
//   users: {
//     'admin': '1234',
//     'user1': 'supersecret1',
//     'user2': 'supersecret2',
//   }
// }));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// // app.set('view engine', 'pug');
// // // this is where we can put the public contents like css and js files
// // app.use(express.static(__dirname + '/public'));

// // app.get('/', (request, response) => {
// //     //connect to db and get data
// //     response.render('index', {
// //         title: 'Main Title',
// //         content: 'The content of the page'
// //     })
// // });

// app.get('/tasks', (request, response) => {
//     //connect to db and get data
//     Task.find(function(err, tasks){
//         if(err) {
//             response.send(err);
//         }
//         response.render('index', {
//             title: 'Tasks',
//             content: JSON.stringify(tasks)
//         })
//     });
// });

// handle the routes
app.get("/api/tasks", getMethod);
app.post("/api/tasks", postMethod);

// handle 404
app.use(function (req, res, next) {
  res.status(404);
  res.send({
    error: "Not found"
  });
  return;
});

app.listen(3000, () => console.log("TODO API is listening on port 3000!"));