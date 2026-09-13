"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminSeeder_1 = __importDefault(require("./adminSeeder"));
const app_1 = __importDefault(require("./src/app"));
const config_1 = require("./src/config/config");
const categoryController_1 = __importDefault(require("./src/controllers/categoryController"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("./src/database/models/userModel"));
const orderModel_1 = __importDefault(require("./src/database/models/orderModel"));
const connection_1 = require("./src/database/connection");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = config_1.envConfig.port || 4000;
        // Wait for database to sync before starting server
        try {
            yield (0, connection_1.syncDatabase)();
        }
        catch (error) {
            console.error("Failed to sync database:", error);
            process.exit(1);
        }
        const server = app_1.default.listen(port, () => {
            categoryController_1.default.seedCategory();
            console.log(`Server has started at port [${port}]`);
            (0, adminSeeder_1.default)();
        });
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: ["http://localhost:5173", "*"],
            },
        });
        let onlineUsers = [];
        let addToOnlineUsers = (socketId, userId, role) => {
            onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
            onlineUsers.push({ socketId, userId, role });
        };
        io.on("connection", (socket) => {
            console.log("connected");
            const { token } = socket.handshake.auth; // jwt token
            console.log(token, "TOKEN");
            if (token) {
                jsonwebtoken_1.default.verify(token, config_1.envConfig.jwtSecretKey, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        socket.emit("error", err);
                    }
                    else {
                        const userData = yield userModel_1.default.findByPk(result.userId); // {email:"",pass:"",role:""}
                        if (!userData) {
                            socket.emit("error", "No user found with that token");
                            return;
                        }
                        // userID grab garnu paryo
                        // 2, 2, customer
                        console.log(socket.id, result.userId, userData.role);
                        addToOnlineUsers(socket.id, result.userId, userData.role);
                        console.log(onlineUsers);
                    }
                }));
            }
            else {
                console.log("triggered");
                socket.emit("error", "Please provide token");
            }
            console.log(onlineUsers);
            socket.on("updateOrderStatus", (data) => __awaiter(this, void 0, void 0, function* () {
                const { status, orderId, userId } = data;
                console.log(data, "USS");
                console.log(status, orderId);
                const findUser = onlineUsers.find((user) => user.userId == userId); // {socketId,userId, role}
                yield orderModel_1.default.update({
                    orderStatus: status,
                }, {
                    where: {
                        id: orderId,
                    },
                });
                if (findUser) {
                    console.log(findUser.socketId, "FS");
                    io.to(findUser.socketId).emit("statusUpdated", data);
                }
                else {
                    socket.emit("error", "User is not online!!");
                }
            }));
        });
    });
}
startServer();
