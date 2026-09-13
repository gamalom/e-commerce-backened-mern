"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (fn) => {
    return (req, res) => {
        fn(req, res).catch((err) => {
            console.log(err);
            res.status(500).json({
                message: "Internal error",
                errorMessage: err.message
            });
            return;
        });
    };
};
exports.default = errorHandler;
