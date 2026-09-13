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
const categoryModel_1 = __importDefault(require("../database/models/categoryModel"));
/*
electronics, grocies, foods
seed mathi ko data ,

custom categories
delete , fetch, update
*/
class CategoryController {
    constructor() {
        this.categoryData = [
            {
                categoryName: "Electronics"
            },
            {
                categoryName: "Groceries"
            },
            {
                categoryName: "Foods"
            }
        ];
    }
    seedCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield categoryModel_1.default.findAll();
            if (datas.length === 0) {
                yield categoryModel_1.default.bulkCreate(this.categoryData);
                console.log("Categories seeded successfully");
            }
            else {
                console.log("Categories already seeded");
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const { categoryName } = req.body;
            if (!categoryName) {
                res.status(400).json({
                    message: "Please provide categoryName"
                });
                return;
            }
            const category = yield categoryModel_1.default.create({
                categoryName
            });
            res.status(200).json({
                message: "Category created successfully ",
                data: category
            });
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield categoryModel_1.default.findAll();
            res.status(200).json({
                messagage: "fetched categories",
                data
            });
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    message: "Please provide id to delete"
                });
                return;
            }
            const data = yield categoryModel_1.default.findAll({
                where: {
                    id: id
                }
            }); // array return 
            // const data = await Category.findByPk(id) // object return 
            if (data.length === 0) {
                res.status(404).json({
                    message: "No category with that id"
                });
            }
            else {
                yield categoryModel_1.default.destroy({
                    where: {
                        id
                    }
                });
                res.status(200).json({
                    message: "category deleted successfully"
                });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { categoryName } = req.body;
            if (!id || !categoryName) {
                res.status(400).json({
                    message: "Please provide id, categoryName to update"
                });
                return;
            }
            const data = yield categoryModel_1.default.findAll({
                where: {
                    id: id
                }
            }); // array return 
            // const data = await Category.findByPk(id) // object return 
            if (data.length === 0) {
                res.status(404).json({
                    message: "No category with that id"
                });
            }
            else {
                yield categoryModel_1.default.update({
                    categoryName: categoryName
                }, {
                    where: {
                        id
                    }
                });
                res.status(200).json({
                    message: "Category updated successfully"
                });
            }
        });
    }
}
exports.default = new CategoryController;
