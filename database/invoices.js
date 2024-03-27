const mongoose = require('mongoose') 

const Invoice = new mongoose.Schema({
    type: String, 
    creation: String,
    author: String,
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
});

const InvoiceModel = mongoose.model("Invoices", Invoice);

async function mongoGetInvoices(){
  return InvoiceModel.find({}).lean();
}

async function mongoGetInvoicesMaterials(){
    return InvoiceModel.aggregate([
        {
            $unwind: "$contain" 
          },
          {
            $group: {
              _id: null,
              material_ids: { $addToSet: "$contain.material_id" }
            }
          },
          
          {
            $lookup: {
              from: "materials", 
              localField: "material_ids",
              foreignField: "_id",
              as: "materials"
            }
          },
          
          {
            $unwind: "$materials" 
          },

          {
            $project: {
              _id: 0, 
              material_id: "$materials._id",
              name: "$materials.name"
              
            }
          }
        ]);
}

async function mongoFindInvoice(id){
  return InvoiceModel.findById(id);
}

async function mongoAddInvoice(data){
  await InvoiceModel.insertMany([data]);
}

async function mongoDeleteInvoice(id){
  await InvoiceModel.deleteOne({_id: id});
}

module.exports = {mongoGetInvoices, mongoGetInvoicesMaterials, mongoFindInvoice, mongoAddInvoice, mongoDeleteInvoice}