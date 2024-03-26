const { MongoClient } = require("mongodb")

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

async function run() {
    try {
        await client.connect();
        
        const db = client.db("hello_world")
        const collection = db.collection("users")

        await collection.insertOne({name: 'Ivan', age: 20});
        await collection.insertMany([{name: 'John', age: 10}, {name: 'Pavel', age: 18}])

        const cursor = await collection.find({age: {$gte: 15}}).toArray()
        console.log(cursor)
    } 
    catch (e) {
        console.log(e)
    }
    finally {
        await client.close()
    }
}


run().catch(console.error)