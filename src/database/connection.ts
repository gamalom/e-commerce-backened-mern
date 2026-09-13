import { Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import User from "./models/userModel";
import Order from "./models/orderModel";
import Payment from "./models/paymentModel";
import OrderDetails from "./models/orderDetails";
import Cart from "./models/cartModel";

// 1. Single Sequelize instance combining Supabase SSL options and sequelize-typescript models
const sequelize = new Sequelize(envConfig.connectionString as string, {
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
export const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false, alter: false });
    console.log("Database Synced !!");
  } catch (error) {
    console.error("Sync Error:", error);
    throw error;
  }
};

// 4. Model Relationships
// Category X Product (A category has many products)
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// User X Order
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

// Payment X Order
Payment.hasOne(Order, { foreignKey: "paymentId" });
Order.belongsTo(Payment, { foreignKey: "paymentId" });

// Order X OrderDetails (An order has many order items/details)
Order.hasMany(OrderDetails, { foreignKey: "orderId" });
OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

// Product X OrderDetails
Product.hasMany(OrderDetails, { foreignKey: "productId" });
OrderDetails.belongsTo(Product, { foreignKey: "productId" });

// Cart X User
Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

// Cart X Product
Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

export default sequelize;
