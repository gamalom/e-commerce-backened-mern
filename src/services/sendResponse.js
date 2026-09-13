"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusNumber, message, data = []) => {
    res.status(statusNumber).json({
        message,
        data: data.length > 0 ? data : null
    });
};
exports.default = sendResponse;
