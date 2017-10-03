const expect = require('expect')
const request = require('supertest')
const {ObjectId} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos, populateTodos, users,  populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err)
                    return done(err)
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((err) => done(err))
            })
    })
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err)
                    return done(err)
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })
    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    })
    it('should return 400 for non-objects ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(400)
            .end(done)
    })
})
describe('DELETE /todos/:id', () => {
    it('should delete todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
            })
            .end((err, res) => {
                if (err)
                    return done(err)
                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).toBeNull()
                    done()
                }).catch((e) => done(e))
            })
    })
    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    })
    it('should return 400 for non-object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(400)
            .end(done)
    })
})
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let id = new ObjectId(todos[0]._id).toHexString()
        let updatedTodo = {
            "text": "Updated Todo",
            "completed": true
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedTodo.text)
                expect(res.body.todo._id).toBe(id)
                expect(res.body.todo.completed).toBeTruthy()
                expect(res.body.todo.completedAt).toBeTruthy()
            })
            .end((err, res) => {
                if (err) 
                    return done(err)
                Todo.findById(id).then((todo) => {
                    expect(todo.completed).toBeTruthy()
                    expect(todo.text).toBe(updatedTodo.text)
                    done()
                }).catch((e) => done(e))
            })
    })
    it('should clear completedAt when todo is not completed', (done) => {
        let id = new ObjectId(todos[1]._id).toHexString()
        let updatedTodo = {
            "text": "Updated Todo2",
            "completed": false
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(updatedTodo)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toBeNull()
                expect(res.body.todo.completed).toBeFalsy()
                expect(res.body.todo._id).toBe(id)
                expect(res.body.todo.text).toBe(updatedTodo.text)
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com'
        var password = '123mnb!'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeDefined()
                expect(res.body._id).toBeDefined()
                expect(res.body.email).toBeDefined()
            })
            .end((err) => {
                if (err)
                    return done(err)
                
                User.findOne({email}).then((user) => {
                    expect(user).toBeDefined()
                    expect(user.password).not.toBe(password)
                    done()
                })
            })
    })

    it('should return validation errors if request invalid', (done) => {
        var invalidEmail = 'example.example.com'
        var password = '123'
        request(app)
            .post('/users')
            .send({invalidEmail,password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.email).toBeDefined()
                expect(res.body.errors.password).toBeDefined()

            })
            .end(done)
    })

    it('should not create user if email in use', (done) => {
        var invalidEmail = users[0].email
        var password = 'password1234'
        request(app)
            .post('/users')
            .send({invalidEmail,password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errors.email).toBeDefined()
            })
            .end(done)
    })
})