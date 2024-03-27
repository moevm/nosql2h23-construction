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

async function mongoFindMaterial(id){
    return MaterialModel.findById(id).lean()
} 

module.exports = { mongoGetMaterials, mongoFindMaterial}