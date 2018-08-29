const express = require('express');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1:27017/todo-api');
const Task = require('./models/taskModel');
const app = express();
// const cors = require('cors');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cors());


app.set('view engine', 'pug');
// this is where we can put the public contents like css and js files
app.use(express.static(__dirname + '/public'));


app.get('/', (request, response) => {
    //connect to db and get data
    response.render('index', {
        title: 'Main Title',
        content: 'The content of the page'
    })
});

app.get('/tasks', (request, response) => {
    //connect to db and get data
    Task.find(function(err, tasks){
        if(err) {
            response.send(err);
        }
        response.render('index', {
            title: 'Tasks',
            content: JSON.stringify(tasks)
        })
    });
});

app.get('/api/tasks', (req, res) => {
    Task.find(function(err, tasks){
        if(err) {
            res.send(err);
        }
        res.json(tasks);
    });
});


app.post('/api/tasks', (req, res) => {
    var task = new Task();

    task.title = req.body.title;
    task.detail = req.body.detail;

    task.save(function(err){
        if(err) {
            res.status(422);
            res.json({error: err});
        }
        res.status(201);
        res.json(task);
    });
});

// handle 404
app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});


app.listen(3000, () => console.log('TODO API is listening on port 3000!'));