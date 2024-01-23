const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  "Company Name": {
    type: String,
    unique:true,
  },
  "Company Number": {
    type: Number,
   

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
    type:String,
    default:"Not Alloted"
  },
  AssignDate: {
    type: Date
  }, 
  Status:{
    type:String,
    default:"Untouched"
  },
  Remarks:{
    type:String,
    default:"No Remarks Added"
  }
  
});

const CompanyModel = mongoose.model('newCdata', CompanySchema);

module.exports = CompanyModel;
