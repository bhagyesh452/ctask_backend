const mongoose = require('mongoose');



// Define the schema
const yourSchema = new mongoose.Schema({
  admin_name: {
    type: String,
  },
  admin_password: {
    type: String,
  },
  admin_email:{
    type:String
  }
 
});



// Create the model
const onlyAdminModel= mongoose.model('admin-info', yourSchema);

module.exports = onlyAdminModel;