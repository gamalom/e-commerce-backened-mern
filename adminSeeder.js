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
const config_1 = require("./src/config/config");
const userModel_1 = __importDefault(require("./src/database/models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const adminSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    const [data] = yield userModel_1.default.findAll({
        where: {
            email: config_1.envConfig.adminEmail
        }
    });
    if (!data) {
        yield userModel_1.default.create({
            username: config_1.envConfig.adminUsername,
            password: bcrypt_1.default.hashSync(config_1.envConfig.adminPassword, 8),
            email: config_1.envConfig.adminEmail,
            role: "admin"
        });
        console.log("Admin seeded !!!");
    }
    else {
        console.log("admin already seeded!!");
    }
});
exports.default = adminSeeder;
