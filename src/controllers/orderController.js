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
const orderModel_1 = __importDefault(require("../database/models/orderModel"));
const orderDetails_1 = __importDefault(require("../database/models/orderDetails"));
const types_1 = require("../globals/types");
const paymentModel_1 = __importDefault(require("../database/models/paymentModel"));
const axios_1 = __importDefault(require("axios"));
const cartModel_1 = __importDefault(require("../database/models/cartModel"));
const productModel_1 = __importDefault(require("../database/models/productModel"));
const categoryModel_1 = __importDefault(require("../database/models/categoryModel"));
class OrderWithPaymentId extends orderModel_1.default {
}
class OrderController {
    static createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { phoneNumber, firstName, lastName, email, city, addressLine, state, zipCode, totalAmount, paymentMethod, } = req.body;
            const products = req.body.products;
            console.log(req.body);
            if (!phoneNumber ||
                !city ||
                !addressLine ||
                !state ||
                !zipCode ||
                !totalAmount ||
                products.length == 0 ||
                !firstName ||
                !lastName ||
                !email) {
                res.status(400).json({
                    message: "Please provide phoneNumber,shippingAddress,totalAmount,products",
                });
                return;
            }
            // for order
            const paymentData = yield paymentModel_1.default.create({
                paymentMethod: paymentMethod,
            });
            const orderData = yield orderModel_1.default.create({
                phoneNumber,
                city,
                state,
                zipCode,
                addressLine,
                totalAmount,
                userId,
                firstName,
                lastName,
                email,
                paymentId: paymentData.id,
            });
            // for orderDetails - use for...of to properly await each operation
            for (const product of products) {
                yield orderDetails_1.default.create({
                    quantity: product.productQty,
                    productId: product.productId,
                    orderId: orderData.id,
                });
                yield cartModel_1.default.destroy({
                    where: {
                        productId: product.productId,
                        userId: userId,
                    },
                });
            }
            // Fetch the complete order with payment details to send to frontend
            const completeOrder = yield orderModel_1.default.findByPk(orderData.id, {
                attributes: ["totalAmount", "id", "orderStatus"],
                include: {
                    model: paymentModel_1.default,
                    attributes: ["paymentMethod", "paymentStatus"],
                },
            });
            // for payment
            if (paymentMethod == types_1.PaymentMethod.Khalti) {
                // khalti logic
                const khaltiData = {
                    return_url: "http://localhost:5173/",
                    website_url: "http://localhost:5173/",
                    amount: totalAmount * 100,
                    purchase_order_id: orderData.id,
                    purchase_order_name: "order_" + orderData.id,
                };
                const response = yield axios_1.default.post("https://a.khalti.com/api/v2/epayment/initiate/", khaltiData, {
                    headers: {
                        Authorization: "Key b71142e3f4fd4da8acccd01c8975be38",
                    },
                });
                const khaltiResponse = response.data;
                paymentData.pidx = khaltiResponse.pidx;
                paymentData.save();
                res.status(200).json({
                    message: "Order created successfully",
                    url: khaltiResponse.payment_url,
                    pidx: khaltiResponse.pidx,
                    data: completeOrder,
                });
            }
            else if (paymentMethod == types_1.PaymentMethod.Esewa) {
            }
            else {
                res.status(200).json({
                    message: "Order created successfully",
                    data: completeOrder,
                });
            }
        });
    }
    static verifyTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pidx } = req.body;
            if (!pidx) {
                res.status(400).json({
                    message: "Please provide pidx",
                });
                return;
            }
            const response = yield axios_1.default.post("https://a.khalti.com/api/v2/epayment/lookup/", {
                pidx: pidx,
            }, {
                headers: {
                    Authorization: "Key 1ddf3f6935cc4d56b227e997caa1a1b4",
                },
            });
            const data = response.data;
            if (data.status === "Completed") {
                yield paymentModel_1.default.update({ paymentStatus: types_1.PaymentStatus.Paid }, {
                    where: {
                        pidx: pidx,
                    },
                });
                res.status(200).json({
                    message: "Payment verified successfully !!",
                });
            }
            else {
                res.status(200).json({
                    message: "Payment not verified or cancelled",
                });
            }
        });
    }
    static fetchMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orders = yield orderModel_1.default.findAll({
                where: {
                    userId,
                },
                attributes: ["totalAmount", "id", "orderStatus"],
                include: {
                    model: paymentModel_1.default,
                    attributes: ["paymentMethod", "paymentStatus"],
                },
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: orders,
                });
            }
            else {
                res.status(404).json({
                    message: "No order found",
                    data: [],
                });
            }
        });
    }
    static fetchAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield orderModel_1.default.findAll({
                attributes: ["totalAmount", "id", "orderStatus"],
                include: {
                    model: paymentModel_1.default,
                    attributes: ["paymentMethod", "paymentStatus"],
                },
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: orders,
                });
            }
            else {
                res.status(404).json({
                    message: "No order found",
                    data: [],
                });
            }
        });
    }
    static fetchMyOrderDetail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const orderId = req.params.id;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orders = yield orderDetails_1.default.findAll({
                where: {
                    orderId,
                },
                include: [
                    {
                        model: orderModel_1.default,
                        include: [
                            {
                                model: paymentModel_1.default,
                                attributes: ["paymentMethod", "paymentStatus"],
                            },
                        ],
                        attributes: [
                            "orderStatus",
                            "AddressLine",
                            "City",
                            "State",
                            "totalAmount",
                            "phoneNumber",
                            "firstName",
                            "lastName",
                            "userId",
                        ],
                    },
                    {
                        model: productModel_1.default,
                        include: [
                            {
                                model: categoryModel_1.default,
                            },
                        ],
                        attributes: ["productImageUrl", "productName", "productPrice"],
                    },
                ],
            });
            if (orders.length > 0) {
                res.status(200).json({
                    message: "Order fetched successfully",
                    data: orders,
                });
            }
            else {
                res.status(404).json({
                    message: "No order found",
                    data: [],
                });
            }
        });
    }
    static cancelMyOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const orderId = req.params.id;
            const [order] = yield orderModel_1.default.findAll({
                where: {
                    userId: userId,
                    id: orderId,
                },
            });
            if (!order) {
                res.status(400).json({
                    message: "No order with that Id",
                });
                return;
            }
            // check order status
            if (order.orderStatus === types_1.OrderStatus.Ontheway ||
                order.orderStatus === types_1.OrderStatus.Preparation) {
                res.status(403).json({
                    message: "You cannot cancelled order, it is on the way or preparation mode",
                });
                return;
            }
            yield orderModel_1.default.update({ orderStatus: types_1.OrderStatus.Cancelled }, {
                where: {
                    id: orderId,
                },
            });
            res.status(200).json({
                message: "Order cancelled successfully",
            });
        });
    }
    static changeOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const { orderStatus } = req.body;
            if (!orderId || !orderStatus) {
                res.status(400).json({
                    message: "Please provide orderId and orderStatus",
                });
            }
            yield orderModel_1.default.update({ orderStatus: orderStatus }, {
                where: {
                    id: orderId,
                },
            });
            res.status(200).json({
                message: "Order status updated successfully",
            });
        });
    }
    static deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id;
            const order = (yield orderModel_1.default.findByPk(orderId));
            const paymentId = order === null || order === void 0 ? void 0 : order.paymentId;
            if (!order) {
                res.status(404).json({
                    message: "You dont have that orderId order",
                });
                return;
            }
            yield orderDetails_1.default.destroy({
                where: {
                    orderId: orderId,
                },
            });
            yield paymentModel_1.default.destroy({
                where: {
                    id: paymentId,
                },
            });
            yield orderModel_1.default.destroy({
                where: {
                    id: orderId,
                },
            });
            res.status(200).json({
                message: "Order delete successfully",
            });
        });
    }
}
exports.default = OrderController;
