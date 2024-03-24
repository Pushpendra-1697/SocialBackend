const express = require("express");
const app = express();
const { connection } = require("./Configs/Config");
require("dotenv").config();
const cors = require("cors");
const { roomRouter } = require("./Routes/rooms.route");
const PORT = process.env.PORT || 3000; //defined port 8000 (default 3000) excluding 27017 (reserved port by Mongod);

//Inbuilt middlewares;
app.use(express.text());
app.use(express.json());
app.use(cors());

//Landing/default route;
app.get("/", async (req, res) => {
    const ip = req.ip;
    console.log(ip);
    res.send("Welcome in Ecommerce-API App😊!!!");
});

app.use('/rooms', roomRouter);


//server code for start or live my server at defined port;
app.listen(PORT, async () => {
    try {
        await connection;
        console.log("connected to DB");
    } catch (e) {
        console.log({ message: e.message });
    }
    console.log(`Server is running at port ${PORT}`);
});

