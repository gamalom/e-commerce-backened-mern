Nodejs
HOW to run this backend

1. clone the project
2. npm install to installing dependency
3. npm run dev
4. all of the project is now ready to go

Extra
Node-schedule (do it in app.ts)
Documentation

1. Save all of the files in postman
2. In collection go to view document
3. Publish the document`
   errorHandler
4. Copy paste the errhandler
5. Then in router wrap them for all the controller

Day1
1 npm init -y ()
2 npm install express dotenv
3 npm i -D typescript ts-node
4 npm i -D @types/express
5 server.js for listen and import the app
6 npx tsc --init
7 npm I -D nodemon
8 script “dev”: “nodemon server.ts”

Day 2

1.  supabase.com -> project setup -> connection => direct 2. npm i sequelize-typescript pg 3. Import Sequelize so its class need instance of that 4. sequelize.authenticate().then(()).catch(()) 5. Import in app.ts
    Day 3 1. import {Table,Column,Model,DataType} from 'sequelize-typescript' 2. @Table({tableName : "users", modelName : "User", timestamps : true}) 3. Ts config decorators 4. Table name is for the database name and modelName is for our project to do something in database 5. class User extends Model{ 6. @Column({ primaryKey : true, type : DataType.UUID, defaultValue : DataType.UUIDV4 }) declare id:string 7. export default User
    Day 4 1. import User from "../database/models/userModel";
    For the controller 1. class UserController{ 2. static async register(req:Request,res:Response){ 3. //incoming user data receive 4. const {username,email,password} = req.body 5. if(!username || !email || !password){ 6. res.status(400).json({ 7. message : "Please provide username,email,password" 8. }) 9. return 10. const user = await User.create({ 11. username, 12. email, 13. password : bcrypt.hashSync(password,10), 14.  
     15. }) 16. export default UserController
    For the route 1. import UserController from '../controllers/userController' 2. router.route("/users/:id").delete(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin), errorHandler( UserController.deleteUser)) 3. export default router 4. Inject this in the app.ts 5. app.use("/api/auth",userRoute)

Day 5
Password hashing 1. npm i bcrypt and -D @types/bcrypt 2. password : bcrypt.hashSync(password,10),

Day 6 (login)
Accept incoming data
Const {email, username }= req.body
Const user = user.findAll({
Where email:email})
Check email exist
Find and findbyid (array, objects)
if(user.length == 0 )
Check password exist next
Bcrypt.compareSync(password, user[0].password)
Generate token 1. npm i jsonwebtoken 2. generateToken in services 3. import jwt from 'jsonwebtoken' 4. import { envConfig } from '../config/config' 5. 6. const generateToken = (userId : string)=>{ 7. // token generate (jwt) 8. const token = jwt.sign({userId : userId},envConfig.jwtSecretKey as string,{ 9. expiresIn : envConfig.jwtExpiresIn 10. }) 11. return token 12. } 13. 14. export default generateToken

1. Day 7(Forgot password)
   1. Check the email if exist
   2. Then generate the opt
   3. Then Send it to the email
   4. Nodemailer
   5. In password : give it to the appPassword

Day 8(verify and reset password)

1. Const {otp, email} = req.body
2. Check the email
3. Verify the otp
4. Check for the otp expire
5. Generate the otp
6. Otp generator in service
   After the verify go to the reset page ie done by frontend
7. Const {newPassword, confirmPassword,email}= req.body
8. If satisfy hash the password
9. Then boolean the otp as false so it cannot be use again

Day 9(admin seeder)

1. Env for admin(email, pass, username)
2. On seeder.ts create admin if that email not exist
3. Call on the before to the database call ie on app.listen

Day 10(product category model, middleware for logincheck)

1.  Same as above for seed category
2.  addCategory
3.  getCategory
4.  Delete
    middleware
5.  Isloggedin=> done by the token help=>comes in req.headers.authorization=>if found => jwt.verify(token, jetSecretKey,async()=>{
6.  Error else (success ma user ko id auxa teslas pathaune ie req.userId= result.userId)}
7.  Next() for the middleware to travel through
8.  route
9.  router.route("/").post(userMiddleware.isUserLoggedIn,userMiddleware.accessTo(Role.Admin),upload.single("productImage"),
10. errorHandler(productController.createProduct)).get(productController.getAllProducts)
    Day 11(middleware more revision for admin check)
11. restrictTo(…roles) spread operator its in array
12. Use data from the login middleware ie req.user.roles. roles is what we need from id of that token
13. Main logic is roles.include(user.roles)
    Day 12(product controller)
14. In product we need the category id for this we need to link the id of category into the product
15. Category.hasOne(Product,{foreignKey:'categoryId'})
16. Product.belongsTo(Category,{foreignKey:'categoryId'})
17. Upper 2 and 3 need to write in the connection.ts so that the product database has the id of category
18. createProduct same as other but since image is present so it come In req.file
19. Const filename = req.file? req.file.filename : dummyPhoto so img is set
20. On create pass this filename in image placeholder
    Day 13(multer, join of database name as category)
21. Copy the multer.ts from services
22. In route import the {multer, storage}
23. Use object ie upload in eg for manipulation
24. Now in route use upload for single or array of image to handle
    category
25. async getAllProducts(req:Request,res:Response) : Promise<void>{
26.         const datas = await Product.findAll({
27.             include : [
28.                 {
29.                     model : Category,
30.                     attributes : ['id','categoryName']
31.                 }
32.             ]
33.         })
34.         res.status(200).json({
35.             message : "Products fetched successfully",
36.             data : datas
37.         })
        }
    Day 14(order)
38. Order model with id status amount
39. Orderdetail model id number
40. Paymentmodel
41. Now make the foreign key for above details
    Day 15(Khalti)
42. Sign In as merchant
43. Login
44. In setting go to the live secret key
45. Need axis as it need to call the api from backend
46. Have the database in order with pidx to store the id
47.
48.         const data = {
49.           return_url : "http://localhost:5173/",
50.           website_url : "http://localhost:5173/",
51.           amount : totalAmount * 100,
52.           purchase_order_id : orderData.id,
53.           purchase_order_name : "order_" + orderData.id
54.         }
55.        const response =  await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
56.           headers : {
57.             Authorization : "Key b71142e3f4fd4da8acccd01c8975be38”.    {b7} live key
58.           }
59.         })
60. const khaltiResponse = response.data
61.       paymentData.pidx = khaltiResponse.pidx
62.       paymentData.save()
63. res.status(200).json({
64.         message : "Order created successfully",
65.         url : khaltiResponse.payment_url,
66.         pidx : khaltiResponse.pidx,
67.         data
68.
69.       })
70. Now to verify if the transaction take place we use it in the controller ie is verifyTransaction (can be copy paste )
    Day 16(cart)
71. In the art we need the userid product id and quantity and for the pk use id
72. Then in create time there is problem of duplicate so to solve this if the product id exist is check
73. Other are same
    Day 17(socket.io). Emit for passing on for gain
74. npm I socket.io
75. Import in the server or app
76. Make the app as server for class instance as const server = app.listen(PORT,()=>{console.log()})
77. Then const io = new serverr(server)
78. io.on(‘connection’ ,()=>{console.log(hello world)})
79. Req.header is same as socket.handsake.auth for check in token comes
80. Addtoonlineid copy paste so if some is online who is connect to the socket and not a admin is add in array eg Addtoonlineid(socketId, userId, roles)
    then after knowing user online then when admin change order then
81. From frontend it send order id , userid , status and trigger event
82. New event as update listen by. Frontend if it happen then check if that user exist then io.to(userid.socketid). But in real its change in database
