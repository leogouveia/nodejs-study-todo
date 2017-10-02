const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error('Unable to connect to MongoDB')
    }
    console.log('Connected to mongodb')
    // db.collection('Todos').insertOne({
    //     text: 'Smethong to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err)
    //         return console.log('Unable to insert todo', err)
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })
    // db.collection('Users').insertOne({
    //     name: 'Leonardo Gouveia',
    //     age: 33,
    //     location: 'Brasilia - DF - Brazil'
    // }, (err, result) => {
    //     if (err)
    //         console.log('Unable to insert user', err)
    //     console.log(JSON.stringify(result.ops,undefined,2))
    // })
    db.close()
})