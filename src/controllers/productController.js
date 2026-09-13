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
const productModel_1 = __importDefault(require("../database/models/productModel"));
const categoryModel_1 = __importDefault(require("../database/models/categoryModel"));
class ProductController {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { productName, productDescription, productPrice, productTotalStock, discount, categoryId, } = req.body;
            const filename = req.file
                ? req.file.filename
                : "https://weimaracademy.org/wp-content/uploads/2021/08/dummy-user.png";
            if (!productName ||
                !productDescription ||
                !productPrice ||
                !productTotalStock ||
                !categoryId) {
                res.status(400).json({
                    message: "Please provide productName,productDescription,productPrice,productTotalStock,discount,categoryId",
                });
                return;
            }
            const product = yield productModel_1.default.create({
                productName,
                productDescription,
                productPrice,
                productTotalStock,
                discount: discount || 0,
                categoryId: categoryId,
                productImageUrl: filename,
            });
            res.status(200).json({
                message: "Product created successfully",
                data: product,
            });
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield productModel_1.default.findAll({
                include: [
                    {
                        model: categoryModel_1.default,
                        attributes: ["id", "categoryName"],
                    },
                ],
            });
            res.status(200).json({
                message: "Products fetched successfully",
                data: datas,
            });
        });
    }
    getSingleProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const [datas] = yield productModel_1.default.findAll({
                where: {
                    id: id,
                },
                include: [
                    {
                        model: categoryModel_1.default,
                        attributes: ["id", "categoryName"],
                    },
                ],
            });
            res.status(200).json({
                message: "Products fetched successfully",
                data: datas,
            });
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const datas = yield productModel_1.default.findAll({
                where: {
                    id: id,
                },
            });
            if (datas.length === 0) {
                res.status(404).json({
                    message: "No product with that id",
                });
            }
            else {
                yield productModel_1.default.destroy({
                    where: {
                        id: id,
                    },
                });
                res.status(200).json({
                    message: "Products deleted successfully",
                    data: datas,
                });
            }
        });
    }
}
exports.default = new ProductController();
