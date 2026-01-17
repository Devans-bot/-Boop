import {Server } from"socket.io"
import http from "http"
import express from "express"


const app=express()
const server=http.createServer(app)


const io=new Server(server,{
    cors:{
        origin:true,
        credentials:true,
    },
});


const userSocketMap={}

export {userSocketMap}

io.on("connection",(socket)=>{

    const userId = socket.handshake?.auth?.userId;

if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }

    userSocketMap[userId].add(socket.id);


io.emit("getOnlineUsers", Object.keys(userSocketMap));

socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  if (userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
       if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });


});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId]  ? Array.from(userSocketMap[receiverId]) : [];;
};



export {io,app,server}