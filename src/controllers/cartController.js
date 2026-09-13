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
const cartModel_1 = __importDefault(require("../database/models/cartModel"));
const productModel_1 = __importDefault(require("../database/models/productModel"));
const categoryModel_1 = __importDefault(require("../database/models/categoryModel"));
class CartController {
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // userId, productId, quantity 
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId, quantity } = req.body;
            if (!productId || !quantity) {
                res.status(400).json({
                    message: "Please provide productId, quantity"
                });
                return;
            }
            // check if that item already exist on that user cart -- > if --> just qty++ | else insert 
            let userKoCartMaItemAlreadyXa = yield cartModel_1.default.findOne({
                where: {
                    productId,
                    userId
                }
            });
            // select * from cart where productId=? AND userId = ? 
            if (userKoCartMaItemAlreadyXa) {
                // userKoCartMaItemAlreadyXa.quantity = userKoCartMaItemAlreadyXa.quantity + quantity
                userKoCartMaItemAlreadyXa.quantity += quantity;
                yield userKoCartMaItemAlreadyXa.save();
            }
            else {
                yield cartModel_1.default.create({
                    userId,
                    productId,
                    quantity
                });
            }
            const cartData = yield cartModel_1.default.findAll({
                where: {
                    userId
                },
                include: [
                    {
                        model: productModel_1.default,
                        include: [
                            {
                                model: categoryModel_1.default
                            }
                        ]
                    }
                ]
            });
            res.status(200).json({
                message: "Product added to Cart",
                data: cartData
            });
        });
    }
    getMyCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const cartItems = yield cartModel_1.default.findAll({
                where: {
                    userId
                },
                include: [
                    {
                        model: productModel_1.default,
                        attributes: ['id', 'productName', 'productPrice', 'productImageUrl']
                    }
                ]
            });
            if (cartItems.length === 0) {
                res.status(404).json({
                    message: "No items in the cart, its empty "
                });
            }
            else {
                res.status(200).json({
                    message: "Cart items fetched successfully",
                    data: cartItems
                });
            }
        });
    }
    deleteMyCartItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId } = req.params;
            // check if product exist or not 
            const product = yield productModel_1.default.findByPk(productId);
            if (!product) {
                res.status(404).json({
                    message: "No product with that id"
                });
                return;
            }
            yield cartModel_1.default.destroy({
                where: {
                    productId,
                    userId
                }
            });
            res.status(200).json({
                message: "Product from cart deleted successfully"
            });
        });
    }
    updateCartItemQuantity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { productId } = req.params;
            const { quantity } = req.body;
            console.log(productId);
            if (!quantity) {
                res.status(400).json({
                    message: 'Please provide quantity'
                });
                return;
            }
            const cartItem = yield cartModel_1.default.findOne({
                where: {
                    userId,
                    productId
                }
            });
            console.log(cartItem);
            if (!cartItem) {
                res.status(404).json({
                    message: "Cart ma tyo ProductId ko product xainw!!!"
                });
            }
            else {
                cartItem.quantity = quantity;
                yield cartItem.save();
                res.status(200).json({
                    message: "Cart updated!!"
                });
            }
        });
    }
}
exports.default = new CartController();
