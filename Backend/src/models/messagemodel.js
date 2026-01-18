import mongoose from "mongoose"

const messageschema= new mongoose.Schema({
    chatId: {
  type: String,
  required: true,
  index: true
},
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    image:{
        type:String,
        default:null,
    },
   cipherText:{
    type:String,
   },
   iv:{
    type:String,
   },

},{
    timestamps:true
})

messageschema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 }
);

const Message=mongoose.model("Message",messageschema)

export default Message;