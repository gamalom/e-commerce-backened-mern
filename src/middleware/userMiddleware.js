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
exports.Role = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const userModel_1 = __importDefault(require("../database/models/userModel"));
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Customer"] = "customer";
})(Role || (exports.Role = Role = {}));
class UserMiddleware {
    isUserLoggedIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // receive token 
            const token = req.headers.authorization; // manish
            if (!token) {
                res.status(403).json({
                    message: "Token must be provided"
                });
                return;
            }
            // validate token 
            jsonwebtoken_1.default.verify(token, config_1.envConfig.jwtSecretKey, (err, result) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(403).json({
                        message: "Invalid token !!!"
                    });
                }
                else {
                    //{userId : 123123123}
                    const userData = yield userModel_1.default.findByPk(result.userId); // {email:"",pass:"",role:""}
                    if (!userData) {
                        res.status(404).json({
                            message: "No user with that userId"
                        });
                        return;
                    }
                    req.user = userData;
                    next();
                }
            }));
        });
    }
    accessTo(...roles) {
        return (req, res, next) => {
            var _a;
            let userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
            if (!roles.includes(userRole)) {
                res.status(403).json({
                    message: "You dont have permission haiii!!"
                });
                return;
            }
            next();
        };
    }
}
exports.default = new UserMiddleware;
