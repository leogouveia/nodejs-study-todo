const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        throw new Error('Unable to connect to MongoDB')
    }
    console.log('Connected to mongodb')
    db.collection('Todos').find({
        _id: new ObjectID('59d185beb9eeea27dca78034')
    }).toArray().then((docs) => {
        console.log('Todos')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count: ${count}`)
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })
    db.close()
})