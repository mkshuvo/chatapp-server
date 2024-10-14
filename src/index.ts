import "reflect-metadata";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user";
import { Message } from "./entities/Message";
import { User } from "./entities/User";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Event Listener for New Connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for message events from clients
  socket.on("send_message", async ({ senderId, receiverId, content }) => {
    // Create a new message in the database
    const sender = await User.findOneBy({ id: senderId });
    const receiver = await User.findOneBy({ id: receiverId });
    if (sender && receiver) {
      const newMessage = Message.create({ sender, receiver, content });
      await newMessage.save();

      // Broadcast the message to the receiver
      io.emit("receive_message", newMessage);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Initialize the Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Define Routes Here
    app.use("/api/users", userRoutes);

    server.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => console.log("Error during Data Source initialization", error));
