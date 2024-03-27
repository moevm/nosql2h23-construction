const mongoose = require('mongoose') 

const Material = new mongoose.Schema({
    name: String,
    type: String,
    quantity: [Number],
    unity: String,
    creation: String,
    description: String
});

const MaterialModel = mongoose.model("Materials", Material);

async function mongoGetMaterials(){
    return await MaterialModel.find({}).lean();
}

async function mongoUseMaterialsPositions(id, qty){
    MaterialModel.updateOne(
        {"_id": id},
        {$inc: {[`quantity.${0}`]: qty}}
        )
        .then(result => {console.log(`Upd doc`);})
        .catch(error => {console.error(`Err`)});
}

async function mongoUseMaterialsStock(id, qty){
    MaterialModel.updateOne(
        {"_id": id},
        {$inc: {[`quantity.${1}`]: qty}}
        )
        .then(result => {console.log(`Upd doc`);})
        .catch(error => {console.error(`Err`)});
}


async function mongoAddMaterial(material){
    MaterialModel.insertMany([{
        name: material.name,
        type: material.type,
        unity: material.unit,
        quantity: [0, 0],
        description: material.description
    }]).then((result) => {
        console.log("result: ", result);
    })
}

async function mongoFindMaterial(id){
    return MaterialModel.findById(id).lean()
} 

module.exports = { mongoGetMaterials, mongoFindMaterial, mongoAddMaterial, mongoUseMaterialsPositions, mongoUseMaterialsStock}