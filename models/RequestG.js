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
  },
  assigned:{
    type:Boolean,
    default:false
  },
  cTime:{
    type:String,
  },
  cDate:{
    type:String
  }
});

const RequestGModel = mongoose.model("RequestGModel", requestSchema);

module.exports = RequestGModel;
