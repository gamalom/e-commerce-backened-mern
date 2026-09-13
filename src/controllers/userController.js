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
const userModel_1 = __importDefault(require("../database/models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../services/generateToken"));
const generateOtp_1 = __importDefault(require("../services/generateOtp"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
const findData_1 = __importDefault(require("../services/findData"));
const sendResponse_1 = __importDefault(require("../services/sendResponse"));
const checkOtpExpiration_1 = __importDefault(require("../services/checkOtpExpiration"));
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //incoming user data receive 
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).json({
                    message: "Please provide username,email,password"
                });
                return;
            }
            // check whether that email already exist or not 
            const [data] = yield userModel_1.default.findAll({
                where: {
                    email: email
                }
            });
            if (data) {
                res.status(400).json({
                    message: "Please try again later !!!"
                });
                return;
            }
            // data --> users table ma insert garne 
            const user = yield userModel_1.default.create({
                username,
                email,
                password: bcrypt_1.default.hashSync(password, 10),
            });
            yield (0, sendMail_1.default)({
                to: email,
                subject: "Registration successfull on Digital Dokaan",
                text: "Welcome to Digital Dokaan, Thank you for registering"
            });
            // await sequelize.query(`INSERT INTO users(id,username,email,password) VALUES (?,?,?,?)`, {
            //     replacements : ['b5a3f20d-6202-4159-abd9-0c33c6f70487', username,email,password], 
            // })
            res.status(201).json({
                message: "User registered successfully",
            });
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // accept incoming data --> email, password
            const { email, password } = req.body; // password - manish --> hash() --> $234234324fjlsdf
            if (!email || !password) {
                res.status(400).json({
                    message: "Please provide email, password"
                });
                return;
            }
            // check email exist or not at first 
            const [user] = yield userModel_1.default.findAll({
                where: {
                    email: email,
                }
            });
            // user --> password --> $234234324fjlsdf
            if (!user) {
                res.status(404).json({
                    message: "No user with that email 😭"
                });
            }
            else {
                // if yes --> email exist -> check password too 
                const isEqual = bcrypt_1.default.compareSync(password, user.password);
                if (!isEqual) {
                    res.status(400).json({
                        message: "Invalid password 😢"
                    });
                }
                else {
                    // if password milyo vane --> token generate(jwt)    
                    const token = (0, generateToken_1.default)(user.id);
                    res.status(200).json({
                        message: "Logged in success 🥰",
                        token
                    });
                }
            }
        });
    }
    static handleForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ message: "Please provide email" });
                return;
            }
            // const [user] = await User.findAll({
            //     where : {
            //         email : email
            //     }
            // })
            const user = yield (0, findData_1.default)(userModel_1.default, email);
            if (!user) {
                res.status(404).json({
                    email: "Email not registered"
                });
                return;
            }
            // otp pathaunu paryo aba, generate otp, mail sent
            const otp = (0, generateOtp_1.default)();
            yield (0, sendMail_1.default)({
                to: email,
                subject: "Digital Dokaan Password Change Request",
                text: `You just request to reset password. Here is your otp, ${otp}`
            });
            user.otp = otp.toString();
            user.otpGeneratedTime = Date.now().toString();
            yield user.save();
            res.status(200).json({
                message: "Password Reset OTP sent!!!!"
            });
        });
    }
    static verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { otp, email } = req.body;
            if (!otp || !email) {
                (0, sendResponse_1.default)(res, 404, "Please provide otp and email");
                return;
            }
            const user = yield (0, findData_1.default)(userModel_1.default, email);
            if (!user) {
                (0, sendResponse_1.default)(res, 404, "No user with that email");
                return;
            }
            // otp verification 
            const [data] = yield userModel_1.default.findAll({
                where: {
                    otp,
                    email
                }
            });
            if (!data) {
                (0, sendResponse_1.default)(res, 404, 'Invalid OTP');
                return;
            }
            const otpGeneratedTime = data.otpGeneratedTime;
            (0, checkOtpExpiration_1.default)(res, otpGeneratedTime, 120000);
        });
    }
    static resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newPassword, confirmPassword, email } = req.body;
            if (!newPassword || !confirmPassword || !email) {
                (0, sendResponse_1.default)(res, 400, 'please provide newPassword,confirmPassword,email,otp');
                return;
            }
            if (newPassword !== confirmPassword) {
                (0, sendResponse_1.default)(res, 400, 'newpassword and confirm password must be same');
                return;
            }
            const user = yield (0, findData_1.default)(userModel_1.default, email);
            if (!user) {
                (0, sendResponse_1.default)(res, 404, 'No email with that user');
            }
            user.password = bcrypt_1.default.hashSync(newPassword, 12);
            yield user.save();
            (0, sendResponse_1.default)(res, 200, "Password reset successfully!!!");
        });
    }
    static fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.findAll({
                attributes: ["id", "username", "email"]
            });
            res.status(200).json({
                message: "Users fetched successfully",
                data: users
            });
        });
    }
    static deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    message: "Please provide Id "
                });
                return;
            }
            yield userModel_1.default.destroy({
                where: {
                    id
                }
            });
            res.status(200).json({
                message: "Users deleted successfully",
            });
        });
    }
}
exports.default = UserController;
