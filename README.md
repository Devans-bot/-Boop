# 🐒 Boop — Secure Real-Time Chat App (E2EE)

Boop is a **real-time, end-to-end encrypted (E2EE) chat application** built with **MERN + [Socket.IO](http://socket.io/)**, supporting **multi-device encryption**, **friend management**, **ephemeral messaging**, and **image sharing** — all with privacy as a first-class feature.

> 🔐 Messages are encrypted on the client.
> 
> 
> 🚫 The server can never read message content.
> 

---

## 🚀 Features

### 🔐 Security & Privacy

- End-to-End Encryption (AES-256-GCM)
- RSA-OAEP public/private keys per **device**
- Multi-device secure key distribution
- Device revocation support
- Encrypted key recovery (server cannot decrypt messages)
- Ephemeral messages (auto-delete after 24h)

### 💬 Messaging

- 1-to-1 real-time chat ([Socket.IO](http://socket.io/))
- Encrypted text messages
- Image sharing (Cloudinary)
- Message delivery in real time
- Online / offline presence

### 👥 Social

- Friend system
- Friend requests (real-time)
- User search
- User profiles

### ⚙️ App Experience

- Responsive UI (mobile + desktop)
- Emoji support
- Image preview & download
- Theme switching (DaisyUI themes)
- Persistent login with JWT cookies

---

## 🧠 System Architecture

### High-Level Architecture

Client (React)
├─ Zustand State
├─ Web Crypto API
├─ [Socket.IO](http://socket.io/) Client
└─ Encrypted Messages
↓
Server (Node.js + Express)
├─ REST APIs
├─ [Socket.IO](http://socket.io/)
├─ JWT Auth (Cookies)
└─ Encrypted Storage
↓
MongoDB + Cloudinary

---

## 🔐 Encryption Design (E2EE)

### Key Strategy

- **AES-256 key per chat**
- **RSA key pair per device**
- AES key is encrypted:
    - Once per device (RSA)
    - Once for server recovery (AES-GCM with server secret)

### Flow

1. Client generates RSA key pair per device
2. AES key generated when chat starts
3. AES key encrypted for:
    - Each active device
    - Server (for re-encryption only)
4. Messages encrypted client-side using AES
5. Server stores only encrypted payloads

✅ Server cannot decrypt messages

✅ New devices can securely join chats

✅ Revoked devices lose access

---

## 🌐 API Design

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/user/signup` | Register |
| POST | `/api/user/login` | Login |
| POST | `/api/user/logout` | Logout |
| GET | `/api/user/checkauth` | Verify auth |

### Users & Friends

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/user/allfrnds` | Friend list |
| POST | `/api/user/searchuser` | Search users |
| GET | `/api/user/sendrequest/:id` | Send request |
| GET | `/api/user/requests` | Pending requests |
| GET | `/api/user/addfriend/:id` | Add/remove friend |
| GET | `/api/user/userprofile/:id` | Public profile |

### Chat & Messages

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/chat/:chatId` | Fetch messages |
| POST | `/api/chat/send/:chatId` | Send message |
| GET | `/api/chat/users` | Sidebar users |

### Encryption Keys

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/device/registerdevice` | Register device |
| POST | `/api/device/revokedevice` | Revoke device |
| GET | `/api/chat/key/:chatId` | Fetch AES key |
| POST | `/api/chat/key` | Create AES key |

---

## 🗄️ Database Schema

### User

```jsx
User {
  email (unique)
  username (unique)
  password (hashed)
  profilePic
  friends: [UserId]
  friendRequests: [UserId]
  timestamps
}
Message
Message {
  chatId
  senderId
  receiverId
  cipherText
  iv
  image
  createdAt (TTL: 24h)
}
ChatKey
ChatKey {
  chatId
  userA
  userB
  encryptedKeysByDevice: {
    deviceId → RSA(AES_KEY)
  }
  encryptedKeyForServer
}
Device
Device {
  userId
  deviceId
  publicKey
  revoked
  lastSeen
}
⚡ Real-Time (Socket.IO)
Events
receiveMessage

friendRequest:new

friend:update

getOnlineUsers

Presence Tracking
Multiple sockets per user

Real-time online/offline status

Auto cleanup on disconnect

```

📈 Scaling Strategy
Stateless REST APIs

MongoDB indexes on chatId & createdAt

TTL index auto-cleans messages

Horizontal scaling with Socket.IO + Redis adapter

Cloudinary CDN for images

🚧 Bottlenecks & Improvements
Current Limitations
No message pagination

Socket auth trusts client userId

Base64 image upload overhead

Planned Improvements
Cursor-based pagination

JWT verification in socket middleware

Signed image upload URLs

Redis caching for presence & rate limiting

⚖️ Tradeoffs
Decision	Tradeoff
End-to-End Encryption	No server-side search
Ephemeral messages	No chat history
Cookie-based JWT	Needs CSRF protection
Multi-device encryption	Higher complexity
🛠 Tech Stack
Frontend
React

Zustand

Socket.IO Client

Web Crypto API

TailwindCSS + DaisyUI

Backend
Node.js

Express

MongoDB (Mongoose)

Socket.IO

JWT (HTTP-only cookies)

Infra
Cloudinary (images)

MongoDB Atlas

Vite
