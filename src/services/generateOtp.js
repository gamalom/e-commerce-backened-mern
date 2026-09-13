"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateOtp = () => {
    return Math.floor(Math.floor(10000 * Math.random()));
};
exports.default = generateOtp;
