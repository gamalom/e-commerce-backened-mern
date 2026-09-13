"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse_1 = __importDefault(require("./sendResponse"));
const checkOtpExpiration = (res, otpGeneratedTime, thresholdTime) => {
    const currentTime = Date.now();
    if (currentTime - parseInt(otpGeneratedTime) <= thresholdTime) {
        // otp expires vako xainw
        (0, sendResponse_1.default)(res, 200, "Valid OTP, now you can proceed to reset password 😌");
    }
    else {
        //otp expires vayo
        (0, sendResponse_1.default)(res, 403, "OTP expiredd, Sorry try again later 😭!!");
    }
};
exports.default = checkOtpExpiration;
