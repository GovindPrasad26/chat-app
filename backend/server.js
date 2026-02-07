require('dotenv').config();
const nodemailer = require("nodemailer");

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require("bcryptjs");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const http = require("http");
const socketio = require('socket.io');
const UAParser = require("ua-parser-js");
const compression = require("compression");


const app = express();
const PORT = 5000;
const secret_key = process.env.JWT_SECRET;


app.use(cors());
app.use(express.json());
app.use(compression());

const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// MongoDB setup
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "userAuth";
let db, usersCollection;

async function connectDB() {
  await client.connect();
  db = client.db(dbName);
  usersCollection = db.collection("users");
  console.log("Connected to MongoDB");
}
connectDB();

// Simple token verification middleware
const verifytoken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, message: "No token" });
  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) return res.status(401).json({ ok: false, message: "Invalid token" });
    req.userdata = decoded;
    next();
  });
};

// ---------------- SOCKET.IO ----------------
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined room ${chatId}`);
  });

  socket.on("sendMessage", async (data) => {
    const { chatID, senderId, senderName, text, time } = data;
    if (!chatID || !senderId || !text) return;

    const messageObj = { senderId, senderName, text, time, chatID };

    try {
      // Save to DB
      await db.collection("chats").updateOne(
        { _id: new ObjectId(chatID) },
        { $push: { messages: messageObj }, $set: { updatedAt: new Date() } }
      );

      // Emit to room
      io.to(chatID).emit("receiveMessage", messageObj);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// ---------------- REST ROUTES ----------------
// Fetch all users except logged-in
app.get("/expectloggeduser", verifytoken, async (req, res) => {
  const loggedInUserId = req.userdata.id;
  const users = await usersCollection
    .find({ _id: { $ne: new ObjectId(loggedInUserId) } })
    .project({ password: 0 })
    .toArray();
  res.json({ ok: true, result: users });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new random password (8 characters)
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log("Generated new password:", newPassword);
console.log("Hashed password:", hashedPassword);

    // Update the new password in the database
    await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Setup Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rajeshkilladi96@gmail.com", // 👉 your sender Gmail
        pass: "lklg cuzq bvie nauv",   // 👉 Gmail App Password
      },
    });

    // Email content
    const mailOptions = {
      from: "yourgmail@gmail.com", // sender
      to: email,                   // recipient
      subject: "Your New Password",
      html: `
        <h3>Hello ${user.firstName || "User"},</h3>
        <p>Your password has been reset successfully.</p>
        <p>Your new password is: <b>${newPassword}</b></p>
        <p>You can log in using this password and change it later.</p>
        <br>
        <p>Best regards,<br><b>Your App Team</b></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "New password sent to your email successfully!" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, email, password, phone } = req.body;

  if (!firstName || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      email,
      password: hashedPassword,
      phone,
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email and password are required" });
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ ok: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, message: "Invalid password" });
    }

    // 🔍 USER AGENT INFO
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const loginInfo = {
      browser: `${ua.browser.name || "Unknown"} ${ua.browser.version || ""}`,
      os: `${ua.os.name || "Unknown"} ${ua.os.version || ""}`,
      deviceType: ua.device.type || "desktop", // mobile | tablet | desktop
      deviceModel: ua.device.model || "Unknown",
      deviceVendor: ua.device.vendor || "Unknown",
      ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      loginAt: new Date(),
    };

    console.log("Login device info:", loginInfo);

    // 🔐 JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
    };

    const token = jwt.sign(payload, secret_key, { expiresIn: "24h" });

    // 🧾 OPTIONAL: Save login log to DB
    await db.collection("login_logs").insertOne({
      userId: user._id,
      email: user.email,
      status: "success",
      ...loginInfo,
    });

    res.json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

// Create or fetch chat
app.post("/chatcreate", verifytoken, async (req, res) => {
  const { selectedUserId } = req.body;
  const loggedUserId = req.userdata.id;

  let chat = await db.collection("chats").findOne({
    users: { $all: [loggedUserId, selectedUserId] }
  });

  if (chat) return res.json({ ok: true, chat });

  const newChat = {
    users: [loggedUserId, selectedUserId],
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await db.collection("chats").insertOne(newChat);
  res.status(201).json({ ok: true, chat: result.ops[0] });
});
// GET linked devices (Updated to match your verifytoken middleware)
app.get("/account/devices", verifytoken, async (req, res) => {
  try {
    const userId = new ObjectId(req.userdata.id); // Convert string ID to MongoDB ObjectId

    const devices = await db
      .collection("login_logs")
      .find({ userId: userId, status: "success" })
      .sort({ loginAt: -1 })
      .toArray();

    res.json({
      ok: true,
      total: devices.length,
      devices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// db.login_logs.find().pretty()
