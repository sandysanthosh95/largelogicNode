const express = require('express')
const app = express()
const port = process.env.PORT || 9000
const mongoose = require('mongoose')
const moment = require('moment')
const router = require('./server/route')
const morgan = require('morgan')
const cors = require('cors')

const URI = "mongodb://localhost/largelogics"

mongoose.connect(URI, {useNewUrlParser: true,useCreateIndex:true})
const connection = mongoose.connection

connection.on("connecting", () => {
    console.log(
        "MongoDB try to connecting!",
        moment().format("YYYY-MM-DD hh:mm")
    );
});

connection.on("connected", () => {
    console.log("MongoDB connected....");
});

connection.on("disconnected", () => {
    console.log("MongoDB disconnected!", moment().format("YYYY-MM-DD hh:mm"));
    setTimeout(function () {
        mongoose.connect(URI, options);
    }, 3000);
});
app.use(express.json())
app.use(cors());
app.use(morgan("dev"));

router(app);

app.listen(port);

