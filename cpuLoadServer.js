/**
 * Created by JackDan9 on 2018/4/26.
 */
let express = require("express");
let app = express();
let server = require("http").createServer(app);
let io = require("socket.io").listen(server);
let os = require("os");
let osUtils = require("os-utils");
let interval = -1;
let currCPU = 0;

app.use(express.static(__dirname));

server.listen(8080);

io.sockets.on('connection', function () { //连接事件
    if (interval < 0) {
        interval = setInterval(function () {
            let freeMem = os.freemem();
            let totalMem = os.totalmem();
            io.sockets.emit("cpuUpdate", {
                cpuUsage: currCPU * 100.0,
                freeMem: freeMem,
                totalMem: totalMem,
                usedMem: totalMem - freeMem
            });
            // }, 10); // 每隔10毫秒取系统数据
        }, 1000);// 每隔1秒获取系统数据
    }
});

function updateCPU() {
    setTimeout(function () {
        osUtils.cpuUsage(function (value) {
            currCPU = value;

            updateCPU();
        });
    }, 0);
}

updateCPU();
console.log("Server is working!");
