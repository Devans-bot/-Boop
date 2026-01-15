import express from 'express'
import { Isauth } from '../utils/isauth.js'
import { getmessages, getusersforsidebar, sendmessages } from '../controllers/messagecontrollers.js'
import Message from '../models/messagemodel.js'

const router=express.Router()

router.get("/users",Isauth,getusersforsidebar)
router.post("/send/:chatId",Isauth,sendmessages)
router.get("/:chatId",Isauth,getmessages)

export default router