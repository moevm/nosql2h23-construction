const mongoose = require('mongoose')
const moment   = require('moment')

const Statistics = new mongoose.Schema({
    date: Date,
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        require: true  
    },

    contain: [
    {
        _id: false,
        material_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Materials",
            require: true
        },
        quantity:{
            type: Number,
            require: true
        },
    }
]
})

const StatisticsModel = mongoose.model("Statistics", Statistics);

async function mongoAddStatistics(date, person, contain){

    console.log("DATE IS : ", date)

    StatisticsModel.insertMany([
        {   date: new Date(date),
            person: person,
            contain: contain
        }
    ]).then(console.log("Inserted materials used is done !"))
}

async function mongoQueryUsageHistoric(material_id){
    let answer = await StatisticsModel.aggregate([
        {
            $match:{
                "contain.material_id": new mongoose.Types.ObjectId(material_id)
            }
        },
        {
            $unwind: "$contain"
        },

        {
            $lookup: {
                from: "users",
                localField: "person",
                foreignField: "_id",
                as: "person"
            }
        },

        {
            $unwind: "$person"
        },

        {
            $project:{
                _id: 0,
                person: "$person.username",
                role: "$person.role",
                date: "$date"
            }
        },

        {
            $group: {
                _id: { person: "$person", role: "$role", date: "$date" },
                count: { $sum: 1 } // To count occurrences of each distinct document
              }
        },
        
        {
            $project: {
                _id: 0, // Exclude _id field from the output
                person: "$_id.person",
                role: "$_id.role",
                date: "$_id.date",
            }
        },

        {
            $sort: {
                "date" : 1,
                "person": 1
            }
        }
    ])

    return answer
}

async function mongoQueryUsageYear(material_id){
    
    let endDate = new Date();
    let startDate = moment().subtract(1, 'years').toDate();

    console.log(startDate)
    console.log(endDate)

    let store = await StatisticsModel.aggregate([
        {
            $match: {
                "contain.material_id": new mongoose.Types.ObjectId(material_id),
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $unwind: "$contain"
        },
        {
            $group: {
                _id: "$date",
                totalUsage: { $sum: "$contain.quantity" }
            }
        },

        {
            $sort: {
                _id: 1
            }
        }
       
        
    ]);
       
    // console.log(store) 

    var data = []
    store.forEach((element) => {data.push(element.totalUsage)})
    //console.log(data)
    return data
}


async function mongoQueryUsagePerson(material_id){
    const store = await StatisticsModel.aggregate([

        {
            $match: {
                "contain.material_id": new mongoose.Types.ObjectId(material_id)
            }
        },
    
        {
            $unwind: "$contain"
        },
        {
            $group: {
                _id: "$person",
                totalQuantity: { $sum: "$contain.quantity" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "worker"
            }
        },
        {
            $unwind: "$worker"
        },
        {
            $project: {
                _id: 0,
                worker_id: "$worker._id",
                worker_username: "$worker.username",
                totalQuantity: 1
            }
        }
    ]);
    
    // console.log(store) 

    var data = []
    store.forEach((element) => {data.push({label: element.worker_username, data: element.totalQuantity})})
    return JSON.stringify(data)
}

module.exports = {
    mongoQueryUsageYear,
    mongoQueryUsagePerson,
    mongoQueryUsageHistoric,
    mongoAddStatistics
}