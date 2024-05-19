/**
 * @swagger
 *  /api/v1/superAdmin/company/companies:
 *    get:
 *     tags:
 *        - Company List
 *     summary: Get All Company list
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - in: query
 *           name: keyword
 *           schema:
 *             type: string
 *         - in: query
 *           name: pageNumber
 *           schema:
 *             type:number
 *     responses:
 *        '200':
 *             description: Successfully Fetched The List Of Company
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */

/**
* @swagger
*  /api/v1/superAdmin/company:
*    get:
*     tags:
*        - Company List
*     summary: Get Company Details by customer_no
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: customer_no
*           schema:
*             type: string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Company
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/company/save:
*    post:
*     tags:
*        - Company List
*     summary: Add/Edit New/Existing Company to the list, type 0 for create, type 1 for update, type 2 for delete
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               type:
*                        type: number
*               Name:
*                        type: string
*               ABN:
*                        type: number
*               E-Mail:
*                        type: string
*               Phone No_:
*                        type: number
*               Address:
*                        type: string
*               Address 2:
*                        type: string
*               Home Page:
*                        type: string
*               Currency Code:
*                        type: string
*               Customer Group Code:
*                        type: string
*               Customer Type:
*                        type: number
*               Website Payment Type:
*                        type: number
*               Minimum Order Fee:
*                        type: string
*               Primary Color:
*                        type: string
*               Secondary Color:
*                        type: string
*               bannerImage:
*                        type: string
*               logoImage:
*                        type: string
*     responses:
*        '200':
*             description: New Company Added Successfully.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
 * @swagger
 *  /api/v1/user/save:
 *    post:
 *     tags:
 *        - User
 *     summary: Add/Edit/Delete User For Company Portal & Super Admin, type 0 for create, type 1 for update, type 2 for delete and customer number value logged in company No_
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                        type: string
 *               first_name:
 *                        type: string
 *               last_name:
 *                        type: string
 *               customer_no:
 *                        type: string
 *               role:
 *                        type: number
 *               mobile:
 *                        type: number
 *               email:
 *                        type: string
 *               locations:
 *                        type: string
 *               profileimage:
 *                        type: string
 *               credit_issued:
 *                        type: string
 *               type:
 *                        type: number
 *               folderType:
 *                        type: number
 *     responses:
 *        '200':
 *             description: New User Added Successfully.
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */

/**
* @swagger
*  /api/v1/user/users:
*    get:
*     tags:
*        - User
*     summary: Get All User list
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of User
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/user/userCredit/add:
*    post:
*     tags:
*        - User
*     summary: Add Credits to Company/Staff User
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               userid:
*                        type: number
*               credit_issued:
*                        type: number
*               expiry_date:
*                        type: string
*     responses:
*        '200':
*             description: User Credit Added Successfully.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/location/locations:
*    get:
*     tags:
*        - Locations
*     summary: Get All Child Company list
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type: number
*         - in: query
*           name: Customer Group
*           schema:
*             type: string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Location
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/location/save:
*    post:
*     tags:
*        - Locations
*     summary: Add/Edit New/Existing Location to the list
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               Name:
*                        type: string
*               ABN:
*                        type: number
*               E-Mail:
*                        type: string
*               Phone No_:
*                        type: number
*               Address:
*                        type: string
*               Address 2:
*                        type: string
*               Home Page:
*                        type: string
*               Currency Id:
*                        type: string
*               Customer Group:
*                        type: string
*               Customer Group Code:
*                        type: string
*               Customer Type:
*                        type: string
*               Primary Color:
*                        type: string
*               Secondary Color:
*                        type: string
*               Company Banner Image:
*                        type: string
*               Company Logo:
*                        type: string
*     responses:
*        '200':
*             description: New Location Added Successfully.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/salesOrder/locationPurchase:
*    get:
*     tags:
*        - Purchase History
*     summary: Get Location/Company wise purchased history list
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/auth/login:
*    post:
*     tags:
*        - Authenication
*     summary: Authentication Token by user details
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               username:
*                        type: string
*               password:
*                        type: string
*     responses:
*        '200':
*             description: Authenication Successful.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

//  /**
//  * @swagger
//  *   /productList/getAllProducts:
//  *    get:
//  *     tags:
//  *        - Product list 
//  *     summary: Get All Products
//  *     produces:
//  *         - application/json
//  *     consumes:
//  *         - application/json
//  *     components:
//  *           securitySchemes:
//  *           bearerAuth:            # arbitrary name for the security scheme
//  *           type: object
//  *           scheme: bearer
//  *           bearerFormat: JWT 
//  *     security:
//  *           - bearerAuth: []
//  *     responses:
//  *        '200':
//  *             description: Successfully Fetched the all products.
//  *        '401':
//  *             description: Failed to fetch the productlist.
//  *        '500':
//  *             description: Internal Server Error
//  *     
//  */
// /**
//  * @swagger
//  *   /productList/getProductDetails:
//  *    post:
//  *     tags:
//  *        - Product list 
//  *     summary: Get Products Details
//  *     produces:
//  *         - application/json
//  *     consumes:
//  *         - application/json
//  *     components:
//  *           securitySchemes:
//  *           bearerAuth:
//  *           schema:
//  *           type: object
//  *           scheme: bearer
//  *           bearerFormat: JWT 
//  *     security:
//  *           - bearerAuth: []
//  *     parameters:
//  *           - name : body
//  *             in: body
//  *             type: object
//  *             properties:
//  *               No_:
//  *                    type: string
//  *     responses:
//  *        '200':
//  *             description: Successfully Fetched Product Details.
//  *        '401':
//  *             description: Failed to fetch the Product.
//  *        '500':
//  *             description: Internal Server Error
//  *     
//  */
// /**
//  * @swagger
//  *   /categories/getCategories:
//  *    post:
//  *     tags:
//  *        - Category list 
//  *     summary: Get Category Details
//  *     produces:
//  *         - application/json
//  *     consumes:
//  *         - application/json
//  *     components:
//  *           securitySchemes:
//  *           bearerAuth:
//  *           schema:
//  *           type: object
//  *           scheme: bearer
//  *           bearerFormat: JWT 
//  *     security:
//  *           - bearerAuth: []
//  *     parameters:
//  *           - name : body
//  *             in: body
//  *             type: object
//  *             properties:
//  *               Parent Category:
//  *                    type: string
//  *     responses:
//  *        '200':
//  *             description: Successfully Fetched Category Details.
//  *        '401':
//  *             description: Failed to fetch the Category List.
//  *        '500':
//  *             description: Internal Server Error
//  *     
//  */

/**
* @swagger
*  /api/v1/companyPortal/cart/save:
*    post:
*     tags:
*        - Cart
*     summary: Add product to the cart, type 0 for create, type 1 for update, type 2 for delete
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               item_code:
*                        type: string
*               item_name:
*                        type: string
*               item_image:
*                        type: string
*               size:
*                        type: number
*               color:
*                        type: string
*               quantity:
*                        type: string
*               unit_price:
*                        type: string
*               cost_price:
*                        type: string
*               stock:
*                        type: number
*               ship_now:
*                        type: number
*               back_order:
*                        type: number
*               currency_code:
*                        type: string
*               converted_value:
*                        type: string
*               total_ex_gst:
*                        type: string
*               status:
*                        type: number
*               type:
*                        type: number
*     responses:
*        '200':
*             description: Product Added in Cart Successfully.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/cart/summary:
*    get:
*     tags:
*        - Cart
*     summary: Get Cart Details
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     responses:
*        '200':
*             description: Successfully Fetched The List Of orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/orders/placeOrder:
*    post:
*     tags:
*        - Orders
*     summary: Place Order, cart_summary object will contain (sub_total,shipping, tax, grand_total,grand_total_inc_tax)
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               Sell-to Customer No_:
*                        type: string
*               Bill-to Customer No_:
*                        type: string
*               Bill-to Name:
*                        type: string
*               Bill-to Name 2:
*                        type: string
*               Bill-to Address:
*                        type: string
*               Bill-to Address 2:
*                        type: string
*               Bill-to City:
*                        type: string
*               Bill-to Contact:
*                        type: string
*               Ship-to Name:
*                        type: string
*               Ship-to Name 2:
*                        type: string
*               Ship-to Address:
*                        type: string
*               Ship-to Address 2:
*                        type: string
*               Ship-to City:
*                        type: string
*               Ship-to Contact:
*                        type: string
*               Last Posting No_:
*                        type: string
*               Last Prepayment No_:
*                        type: string
*               VAT Registration No_:
*                        type: number
*               Currency Cod:
*                        type: string
*               Sell-to Customer Name:
*                        type: string
*               Sell-to Customer Name 2:
*                        type: string
*               Sell-to Address:
*                        type: string
*               Sell-to Address 2:
*                        type: string
*               Sell-to City:
*                        type: string
*               Sell-to Contact:
*                        type: string
*               Bill-to Post Code:
*                        type: number
*               Bill-to County:
*                        type: string
*               Bill-to Country_Region Code:
*                        type: string
*               Sell-to Post Code:
*                        type: number
*               Sell-to County:
*                        type: string
*               Sell-to Country_Region Code:
*                        type: string
*               Ship-to Post Code:
*                        type: number
*               Ship-to County:
*                        type: string
*               Ship-to Country_Region Code:
*                        type: string
*               Ship-to Phone No:
*                        type: number
*               Sell-to Phone No_:
*                        type: number
*               Sell-to E-Mail:
*                        type: string
*               Contact E-mail:
*                        type: string
*               new_shipping:
*                        type: number
*               cart_summary:
*                        type: object
*     responses:
*        '200':
*             description: Successfully Fetched The List Of orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*   /api/v1/companyPortal/cart/checkQtyAndShip:
*    post:
*     tags:
*        - Cart
*     summary: Get Checkout Details
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     components:
*           securitySchemes:
*           bearerAuth:
*           schema:
*           type: object
*           scheme: bearer
*           bearerFormat: JWT
*     security:
*           - bearerAuth: []
*     parameters:
*           - name : body
*             in: body
*             type: object
*             properties:
*               Item_No:
*                    type: string
*               buyQty:
*                    type: integer
*               currency:
*                    type: string
*     responses:
*        '200':
*             description: Successfully Retrived the Cart Details.
*        '401':
*             description: Failed to Retrived the Cart Details.
*        '500':
*             description: Internal Server Error
*
*/


 /**
 * @swagger
 *  /api/v1/companyPortal/category/getAllCategories:
 *    get:
 *     tags:
 *        - Category
 *     summary: Get All Category list
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - in: query
 *           name: keyword
 *           schema:
 *             type: string
 *         - in: query
 *           name: customer_no
 *           schema:
 *             type:string
 *     responses:
 *        '200':
 *             description: Successfully Fetched The List Of Category
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */
/**
 * @swagger
 *  /api/v1/companyPortal/category/getAllSubCategories:
 *    get:
 *     tags:
 *        - Category
 *     summary: Get All Sub Category list
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - in: query
 *           name: customer_no
 *           schema:
 *             type: string
 *         - in: query
 *           name: category
 *           schema:
 *             type:string
 *     responses:
 *        '200':
 *             description: Successfully Fetched The List Of SubCategory
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */
/**
 * @swagger
 *  /api/v1/companyPortal/product/getProductByCategory:
 *    get:
 *     tags:
 *        - Product
 *     summary: Get All Products By Category
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - in: query
 *           name: customer_no
 *           schema:
 *             type:string
 *         - in: query
 *           name: category
 *           schema:
 *             type:string
 *         - in: query
 *           name: subcategory
 *           schema:
 *             type:string
 *         - in: query
 *           name: keyword
 *           schema:
 *             type: string
 *         - in: query
 *           name: sortByOrder
 *           schema:
 *             type:string
 *         - in: query
 *           name: sortByColumn
 *           schema:
 *             type:string
 *     responses:
 *        '200':
 *             description: Successfully Fetched The List Of Products
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */


/**
* @swagger
*  /api/v1/companyPortal/product/getProductDetail:
*    get:
*     tags:
*        - Product
*     summary: Get Products Detail
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: customer_no
*           schema:
*             type:string
*         - in: query
*           name: item_no
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Products
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/product/getSimilarProduct:
*    get:
*     tags:
*        - Product
*     summary: Get Similar Product
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: customer_no
*           schema:
*             type:string
*         - in: query
*           name: item_no
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Similar Products
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/
/**
* @swagger
*  /api/v1/companyPortal/product/getPopularProduct:
*    get:
*     tags:
*        - Product
*     summary: Get Popular Product
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: customer_no
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Popular Popular
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/
/**
 * @swagger
 *  /api/v1/companyPortal/product/securePayment:
 *    post:
 *     tags:
 *        - Secure Payment
 *     summary: Secure Payment
 *     produces:
 *         - application/json
 *     consumes:
 *         - application/json
 *     parameters:
 *         - in: body
 *           name: customer_no
 *           schema:
 *             type:string
 *         - in: body
 *           name: order_amount
 *           schema:
 *             type:string
 *         - in: body
 *           name: card_Number
 *           schema:
 *             type:string
 *         - in: body
 *           name: expiration_Month
 *           schema:
 *             type:string
 *         - in: body
 *           name: expiration_Year
 *           schema:
 *             type:string
 *         - in: body
 *           name: security_code
 *           schema:
 *             type:string
 *     responses:
 *        '200':
 *             description: Successfully Fetched The List Of Popular Popular
 *        '401':
 *             description: Unauthorized
 *        '500':
 *             description: Internal Server Error
 */

/**
* @swagger
*  /api/v1/superAdmin/inventory/inventories:
*    get:
*     tags:
*        - Inventory
*     summary: Get All Inventory list
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Inventories
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/inventory/inventories:
*    get:
*     tags:
*        - Inventories
*     summary: Get Inventories/Stocks Details
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: Product WebSite Code
*           schema:
*             type: number
*     responses:
*        '200':
*             description: Successfully Fetched The Details Of Inventories/Stocks
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/product/productHistory:
*    get:
*     tags:
*        - Product
*     summary: Get History of a product  based on Item_no
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*         - in: query
*           name: item_no
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Products
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
 * @swagger
 * /api/v1/auth/resetPasswordMail:
 *   post:
 *     tags:
 *       - Authenication
 *     name: Forgot Password Mail
 *     summary: "Send Password Reset Mail: Type: email"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       'Notes':
 *         description: You have to pass only 1 parameter (email)
 *       '200':
 *         description: Mail Sent successfully
 *       '401':
 *         description: User Not Found, Unauthorized
 *       '403':
 *         description: Not Found
 */

 /**
 * @swagger
 * /api/v1/auth/setPassword:
 *   post:
 *     tags:
 *       - Authenication
 *     name: Set New Password
 *     summary: "Change Password"
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             access_token:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       'Notes':
 *         description: You have to pass only 2 parameter (email and password)
 *       '200':
 *         description: Password Changed successfully
 *       '401':
 *         description: User Not Found, Unauthorized
 *       '403':
 *         description: Not Found
 */

 /**
* @swagger
*  /api/v1/superAdmin/salesOrder/locationPurchase:
*    get:
*     tags:
*        - Orders
*     summary: Get All Order Based on locations
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Order
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

 /**
* @swagger
*  /api/v1/superAdmin/orders/pending:
*    get:
*     tags:
*        - Orders
*     summary: Get All Pending Orders
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*         - in: query
*           name: orderDate
*           schema:
*             type: date
*         - in: query
*           name: sortBy
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Pending Orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/orders/wareHouse:
*    get:
*     tags:
*        - Orders
*     summary: Get All  Orders With Warehouse
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Warehouse Orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/orders/completed:
*    get:
*     tags:
*        - Orders
*     summary: Get The List of all Completed Orders
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: keyword
*           schema:
*             type: string
*         - in: query
*           name: pageNumber
*           schema:
*             type:number
*         - in: query
*           name: orderDate
*           schema:
*             type: date
*         - in: query
*           name: sortBy
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Completed Orders
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/orders/order:
*    get:
*     tags:
*        - Orders
*     summary: Get The Details of Single Order
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: orderNo
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The List Of Single Order
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/order/invoice:
*    get:
*     tags:
*        - Orders
*     summary: Get The Invoice of Single Order
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: orderNo
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The Invoice Of Single Order
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/order/SalesInvoice:
*    get:
*     tags:
*        - Orders
*     summary: Get The Invoice of Sales Order
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: orderNo
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The Invoice Of Sales Order
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/order/completedOrder:
*    get:
*     tags:
*        - Orders
*     summary: Get The Details Completed Order by Order no
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: orderNo
*           schema:
*             type:number
*     responses:
*        '200':
*             description: Successfully Fetched The Details Completed Order by Order no
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/order/completedOrderCount:
*    get:
*     tags:
*        - Orders
*     summary: Get The Count Completed Order
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     responses:
*        '200':
*             description: Successfully Fetched The Count Completed Order
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/inventory/dashboard:
*    get:
*     tags:
*        - Orders
*     summary: Get The Dashboard details for inventory
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     responses:
*        '200':
*             description: Successfully Fetched The Dashboard Data
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/superAdmin/contactUs:
*    post:
*     tags:
*        - Contact Us
*     summary: Send mail to support(Contact)
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - name: body
*           in: body
*           schema:
*             type: object
*             properties:
*               firstname:
*                        type: string
*               lastname:
*                        type: string
*               email:
*                        type: string
*               mobile:
*                        type: number
*               message:
*                        type: string
*     responses:
*        '200':
*             description: Email Sent Successfully.
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/

/**
* @swagger
*  /api/v1/companyPortal/cart/emptyCart:
*    delete:
*     tags:
*        - Cart
*     summary: Delete all item in the cart based on Customer_No
*     produces:
*         - application/json
*     consumes:
*         - application/json
*     parameters:
*         - in: query
*           name: customer_no
*           schema:
*             type:string
*     responses:
*        '200':
*             description: Successfully Deleted the item from cart
*        '401':
*             description: Unauthorized
*        '500':
*             description: Internal Server Error
*/




