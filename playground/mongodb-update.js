const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error('Unable to connect to MongoDB')
    }
    console.log('Connected to mongodb')
    //updateMany
    //updateOne
    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('59d18938c67c8733258851ba')
    // }, {
    //     $set: {
    //        completed: false 
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // })
    db.collection('Users').insertOne({
        name: 'Andrew',
        age: 25,
        location: 'Philadelphia'
    }).then((user) => console.log(user))
    db.collection('Users').findOneAndUpdate({
        name: 'Andrew'
    }, {
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((user) => console.log(user))
    db.close()
})