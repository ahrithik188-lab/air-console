const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    socket.on("join-room", (room) => {

        socket.join(room);

        players[socket.id] = room;

        const count =
            io.sockets.adapter.rooms.get(room)?.size || 0;

        io.to(room).emit("player-count", count);

        console.log(socket.id + " joined " + room);

    });

    socket.on("controller-move", (direction) => {

        const room = players[socket.id];

        if(room){

            socket.to(room).emit(
                "controller-update",
                direction
            );

        }

    });

    socket.on("disconnect", () => {

        const room = players[socket.id];

        delete players[socket.id];

        if(room){

            const count =
                io.sockets.adapter.rooms.get(room)?.size || 0;

            io.to(room).emit("player-count", count);

        }

        console.log("Disconnected");

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log("Server running");

});
