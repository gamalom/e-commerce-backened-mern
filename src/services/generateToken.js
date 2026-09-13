"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const generateToken = (userId) => {
    // token generate (jwt)
    const token = jsonwebtoken_1.default.sign({ userId: userId }, config_1.envConfig.jwtSecretKey, {
        expiresIn: config_1.envConfig.jwtExpiresIn
    });
    return token;
};
exports.default = generateToken;
