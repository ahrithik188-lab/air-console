const express = require("express");

const app = express();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

// SERVE ALL FILES

app.use(express.static(__dirname));

// HOME PAGE

app.get("/", (req, res) => {

    res.sendFile(__dirname + "/index.html");

});

// SOCKET CONNECTION

io.on("connection", (socket) => {

    console.log("✅ User Connected");

    // JOIN ROOM

    socket.on("join-room", (room) => {

        socket.join(room);

        console.log(
            "🎮 Joined Room:",
            room
        );

        // PLAYER COUNT

        const clients =
        io.sockets.adapter.rooms.get(room);

        const count =
        clients ? clients.size : 0;

        io.to(room).emit(
            "player-count",
            count
        );

    });

    // CONTROLLER MOVEMENT

    socket.on(
        "controller-move",
        (data) => {

            io.to(data.room).emit(
                "controller-update",
                data.direction
            );

        }
    );

    // DISCONNECT

    socket.on("disconnect", () => {

        console.log(
            "❌ User Disconnected"
        );

    });

});

// PORT

const PORT =
process.env.PORT || 3000;

http.listen(PORT, () => {

    console.log(
        "🚀 Server Running On Port " +
        PORT
    );

});
