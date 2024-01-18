const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique:true,
  },
  "Company Number": {
    type: Number,
    unique:true,

  },
  "Company Email": {
    type: String,
    

  },
  "Company Incorporation Date  ": {
    type: Date,
   

  },
  City: {
    type: String,
    

  },
  State: {
    type: String,
    

  },
  ename:{
    type:String
  },
  AssignDate: {
    type: Date
  }, 
  Status:{
    type:String,
    default:"Not Picked Up"
  },
  Remarks:{
    type:String
  }
  
});

const CompanyModel = mongoose.model('newCdata', CompanySchema);

module.exports = CompanyModel;
