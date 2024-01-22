const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  ename: {
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

const RequestGModel = mongoose.model("RequestGModel", requestSchema);

module.exports = RequestGModel;
