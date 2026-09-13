"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = __importDefault(require("../controllers/orderController"));
const userMiddleware_1 = __importStar(require("../middleware/userMiddleware"));
const errorHandler_1 = __importDefault(require("../services/errorHandler"));
const router = express_1.default.Router();
router.route("/").post(userMiddleware_1.default.isUserLoggedIn, (0, errorHandler_1.default)(orderController_1.default.createOrder)).get(userMiddleware_1.default.isUserLoggedIn, (0, errorHandler_1.default)(orderController_1.default.fetchMyOrders));
router.route("/all").get(userMiddleware_1.default.isUserLoggedIn, userMiddleware_1.default.accessTo(userMiddleware_1.Role.Admin), (0, errorHandler_1.default)(orderController_1.default.fetchAllOrders));
router.route("/verify-pidx").post(userMiddleware_1.default.isUserLoggedIn, (0, errorHandler_1.default)(orderController_1.default.verifyTransaction));
router.route("/admin/change-status/:id").patch(userMiddleware_1.default.isUserLoggedIn, userMiddleware_1.default.accessTo(userMiddleware_1.Role.Admin), (0, errorHandler_1.default)(orderController_1.default.changeOrderStatus));
router.route("/admin/delete-order/:id").post(userMiddleware_1.default.isUserLoggedIn, userMiddleware_1.default.accessTo(userMiddleware_1.Role.Admin), (0, errorHandler_1.default)(orderController_1.default.deleteOrder));
router.route("/cancel-order/:id").patch(userMiddleware_1.default.isUserLoggedIn, userMiddleware_1.default.accessTo(userMiddleware_1.Role.Customer), (0, errorHandler_1.default)(orderController_1.default.cancelMyOrder));
router.route("/:id").get(userMiddleware_1.default.isUserLoggedIn, (0, errorHandler_1.default)(orderController_1.default.fetchMyOrderDetail));
exports.default = router;
