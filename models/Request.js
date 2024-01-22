const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  ename: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  ctype: {
    type: String,
    required: true,
  },
  dAmount: {
    type: Number,
    required: true,
  },
  read:{
    type:Boolean,
    default:false
  }
});

const RequestModel = mongoose.model("RequestModel", requestSchema);

module.exports = RequestModel;
