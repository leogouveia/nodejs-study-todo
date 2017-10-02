require('./config/config')


const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()
const port = process.env.PORT;

app.use(bodyParser.json())

// POST /todos
app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

// GET /todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectId.isValid(id))
        return res.status(400).send('Id is not valid')

    Todo.findById(id).then((todo) => {
        if (!todo) 
            return res.status(404).send()
        res.send({todo})
    }).catch((e) => {
        res.status(400).send(e)
    })

})

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectId.isValid(id))
        return res.status(400).send('Id is not valid')

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) 
            return res.status(404).send()

        res.send({todo})
        }).catch((e) => {
            res.status(400).send(e)
        })
})

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectId.isValid(id))
        return res.status(400).send()
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if(!todo)
            return res.status(404).send()
        
            res.send({todo})
    }).catch((e) => res.send(400).send())
})

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        console.log(token)
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        console.log("Error: ", e)
        res.status(400).send(e)
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})


module.exports = {app}