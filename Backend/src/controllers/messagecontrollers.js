
import Message from "../models/messagemodel.js"
import User from "../models/usermodel.js"
import cloudinary from "../utils/cloudinary.js"
import { getReceiverSocketId, io } from "../utils/socket.js"

export const getusersforsidebar=async(req,res)=>{
    try {
        const loggedinuser=req.user._id
        const users=await User.find({_id:{$ne:loggedinuser}}).select("-password")

        res.json(users)  
    } catch (error) {
        console.log(error)
    }
}

export const getmessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const [a, b] = chatId.split("_");
    const normalizedChatId = [a, b].sort().join("_");

    const messages = await Message.find({ chatId: normalizedChatId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};


export const sendmessages = async (req, res) => {
  try {
    const {chatId}=req.params
    const myId = req.user._id.toString();
    const [a, b] = chatId.split("_");

    if (myId !== a && myId !== b) {
  return res.status(403).json({ message: "Invalid chat access" });
    }

    const normalizedChatId = [a, b].sort().join("_");
    const receiverId = myId === a ? b : a;
    const senderId = myId;
    let imageUrl = null;

    if (req.body.image) {
      const upload = await cloudinary.uploader.upload(req.body.image, {
        folder: "chat-images",
      });
      imageUrl = upload.secure_url;
    }

    const message = await Message.create({
      chatId:normalizedChatId,
      senderId,
      receiverId,
      cipherText: req.body.cipherText || null,
      iv: req.body.iv || null,
      image: imageUrl,
    });

  const receiverSocketIds = getReceiverSocketId(receiverId);

  if (receiverSocketIds && receiverSocketIds.length > 0) {
  receiverSocketIds.forEach((socketId) => {
    io.to(socketId).emit("receiveMessage", message);
  });
}

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
