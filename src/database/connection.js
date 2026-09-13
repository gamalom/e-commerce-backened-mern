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
exports.syncDatabase = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config/config");
const productModel_1 = __importDefault(require("./models/productModel"));
const categoryModel_1 = __importDefault(require("./models/categoryModel"));
const userModel_1 = __importDefault(require("./models/userModel"));
const orderModel_1 = __importDefault(require("./models/orderModel"));
const paymentModel_1 = __importDefault(require("./models/paymentModel"));
const orderDetails_1 = __importDefault(require("./models/orderDetails"));
const cartModel_1 = __importDefault(require("./models/cartModel"));
// 1. Single Sequelize instance combining Supabase SSL options and sequelize-typescript models
const sequelize = new sequelize_typescript_1.Sequelize(config_1.envConfig.connectionString, {
    dialect: "postgres",
    models: [__dirname + "/models"], // or you can pass [Product, Category, User, Order, Payment, OrderDetails, Cart]
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // Required for Supabase connections
        },
    },
    logging: false, // Set to console.log if you want to see raw SQL queries
});
// 2. Test Connection
sequelize
    .authenticate()
    .then(() => {
    console.log("Connected to Database successfully! 😀");
})
    .catch((err) => {
    console.error("Database connection error 😝 : ", err);
});
// 3. Database Sync Function
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.sync({ force: false, alter: false });
        console.log("Database Synced !!");
    }
    catch (error) {
        console.error("Sync Error:", error);
        throw error;
    }
});
exports.syncDatabase = syncDatabase;
// 4. Model Relationships
// Category X Product (A category has many products)
categoryModel_1.default.hasMany(productModel_1.default, { foreignKey: "categoryId" });
productModel_1.default.belongsTo(categoryModel_1.default, { foreignKey: "categoryId" });
// User X Order
userModel_1.default.hasMany(orderModel_1.default, { foreignKey: "userId" });
orderModel_1.default.belongsTo(userModel_1.default, { foreignKey: "userId" });
// Payment X Order
paymentModel_1.default.hasOne(orderModel_1.default, { foreignKey: "paymentId" });
orderModel_1.default.belongsTo(paymentModel_1.default, { foreignKey: "paymentId" });
// Order X OrderDetails (An order has many order items/details)
orderModel_1.default.hasMany(orderDetails_1.default, { foreignKey: "orderId" });
orderDetails_1.default.belongsTo(orderModel_1.default, { foreignKey: "orderId" });
// Product X OrderDetails
productModel_1.default.hasMany(orderDetails_1.default, { foreignKey: "productId" });
orderDetails_1.default.belongsTo(productModel_1.default, { foreignKey: "productId" });
// Cart X User
cartModel_1.default.belongsTo(userModel_1.default, { foreignKey: "userId" });
userModel_1.default.hasOne(cartModel_1.default, { foreignKey: "userId" });
// Cart X Product
cartModel_1.default.belongsTo(productModel_1.default, { foreignKey: "productId" });
productModel_1.default.hasMany(cartModel_1.default, { foreignKey: "productId" });
exports.default = sequelize;
