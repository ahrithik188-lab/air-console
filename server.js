const express = require("express");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

app.use(express.static(__dirname));

io.on("connection", (socket) => {

    console.log("User Connected");

    // JOIN ROOM

    socket.on("join-room", (room) => {

        socket.join(room);

        const clients =
        io.sockets.adapter.rooms.get(room);

        const count =
        clients ? clients.size : 0;

        io.to(room).emit(
            "player-count",
            count
        );

        console.log(
            "Joined Room:",
            room
        );

    });

    // CONTROLLER INPUT

    socket.on(
        "controller-move",
        (data) => {

            io.to(data.room).emit(
                "controller-update",
                data.direction
            );

        }
    );

    socket.on("disconnect", () => {

        console.log("User Disconnected");

    });

});

http.listen(3000, () => {

    console.log(
        "Server running on port 3000"
    );

});
