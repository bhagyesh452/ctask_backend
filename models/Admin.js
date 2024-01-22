const mongoose = require('mongoose');



// Define the schema
const yourSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  number: {
    type: String,
  },
  ename: {
    type: String,
  },
  jdate: {
    type: Date,
  },
  password: {
    type: String,
  },
  designation:{
    type: String
  }
});



// Create the model
const adminModel = mongoose.model('newemployeeinfos', yourSchema);

module.exports = adminModel;