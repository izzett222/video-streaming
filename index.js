const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/video", (req, res) => {
    const range  = req.headers.range;
    if (!range) {
        return res.status(400).send("range not found")
    }
    const size = fs.statSync("video.mp4").size;
    console.log(range.match(/\d*/g).filter(el => el)[0])
    const start = Number(range.match(/\d*/g).filter(el => el)[0])
    const chunkSize = 10 ** 6;
    const end = Math.min(start +  chunkSize, size - 1)
    const stream = fs.createReadStream("video.mp4", { start, end });
    const contentLength  = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Ranges": "bytes",
        "Content-length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers);
    stream.pipe(res)
    console.log("video request received", range, size, start, end)
})


app.listen(4005, () => {
    console.log("server listening 4005")
})