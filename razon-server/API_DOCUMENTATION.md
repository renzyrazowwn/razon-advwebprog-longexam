# Bulldogs Exchange API Documentation

This is the API documentation for **Bulldogs Exchange**, our campus marketplace web app for National University. The backend is made with Node.js, Express and MongoDB, and product images are stored in Cloudinary.

- **Base URL:** `http://localhost:8000/api/v1`
- **Swagger UI:** `http://localhost:8000/api-docs`
- **Postman files:** inside the `postman` folder

---

## Contents

1. [How to Run](#how-to-run)
2. [Authentication](#authentication)
3. [Error Codes](#error-codes)
4. [Users and Auth](#users-and-auth)
5. [Categories](#categories)
6. [Products](#products)
7. [Suppliers](#suppliers)
8. [Carts](#carts)
9. [Orders](#orders)
10. [Reviews](#reviews)
11. [Testing](#testing)

---

## How to Run

```bash
npm install
npm run dev
```

The `.env` file needs: `MONGO_URI`, `PORT`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.

---

## Authentication

Some endpoints need you to be logged in. To do that:

1. Log in using `POST /users/login`
2. Copy the `token` from the response
3. Add it to the request header:

```
Authorization: Bearer <token>
```

There are two roles:

| Role | Description |
|---|---|
| Customer | Default role when you register. Can manage their own profile, cart, orders and reviews. |
| Admin | Can manage everything (users, categories, products, suppliers, orders, reviews). |

In the tables below, the **Access** column means:
- **Public**: no token needed
- **User**: any logged-in user
- **Owner**: only the owner of the data or an Admin
- **Admin**: Admin only

---

## Error Codes

| Code | Meaning |
|---|---|
| 400 | Bad request (missing or invalid data) |
| 401 | No token or the token is invalid/expired |
| 403 | You are logged in but not allowed to do this |
| 404 | Data not found |
| 429 | Too many login attempts |
| 500 | Server error |

Errors are returned like this:

```json
{ "message": "Invalid credentials." }
```

---

## Users and Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Register a new customer |
| POST | `/users/login` | Public | Log in and get a token |
| GET | `/users` | Admin | Get all users |
| POST | `/users` | Admin | Create a user (can be Admin) |
| GET | `/users/:id` | Owner | Get one user |
| PUT | `/users/:id` | Owner | Update a user |
| DELETE | `/users/:id` | Admin | Delete a user |

### Register

`POST /users/register`

Request body:

```json
{
  "firstName": "Juan",
  "lastName": "Santos",
  "phoneNumber": "09171234567",
  "address": "Sampaloc, Manila",
  "email": "juan.santos@gmail.com",
  "password": "secret123"
}
```

Rules: first and last name should be letters only, phone number must be 11 digits, and password must be at least 6 characters.

Success (201):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "6a9a0c1f2b3c4d5e6f708192",
    "firstName": "Juan",
    "lastName": "Santos",
    "email": "juan.santos@gmail.com",
    "role": "Customer"
  }
}
```

Errors:
- `400`: validation error (returns an `errors` array) or `"Email already exists"`

### Login

`POST /users/login`

Request body:

```json
{
  "email": "juan.santos@gmail.com",
  "password": "secret123"
}
```

Success (200):

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "firstName": "Juan",
  "role": "Customer"
}
```

Errors:
- `400`: `"Email and password are required."`, `"User not found."` or `"Invalid credentials."`
- `403`: account is inactive
- `429`: too many failed attempts (the account gets locked for a few minutes)

### Update User

`PUT /users/:id`, where you only send the fields you want to change:

```json
{
  "address": "Quezon City",
  "phoneNumber": "09179876543"
}
```

Success (200): `{ "message": "User updated successfully", "user": { ... } }`

Customers can only view or update their own account, otherwise they get `403`.

---

## Categories

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | Get all categories |
| POST | `/categories` | Admin | Create a category |
| PUT | `/categories/:id` | Admin | Update a category |
| DELETE | `/categories/:id` | Admin | Delete a category |

Request body (create/update):

```json
{
  "categoryName": "School Supplies",
  "description": "Notebooks, pens and other NU supplies"
}
```

- Category name must be unique
- Success: `201` (create), `200` (update/delete)
- Errors: `400` (duplicate or missing field), `404` (not found)

---

## Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | Get all products |
| GET | `/products/:id` | Public | Get one product |
| POST | `/products` | Admin | Create a product |
| PUT | `/products/:id` | Admin | Update a product |
| DELETE | `/products/:id` | Admin | Delete a product |
| POST | `/products/:id/upload-image` | Admin | Upload or replace the product image |

### Get Products

You can add these to the URL to filter the results:

| Query | Example | What it does |
|---|---|---|
| `search` | `?search=hoodie` | Search by name or description |
| `category` | `?category=Apparel & Wearables` | Filter by category name |
| `minPrice` / `maxPrice` | `?minPrice=100&maxPrice=500` | Price range |
| `sort` | `?sort=-price` | Sort (`-` means descending) |
| `page` / `limit` | `?page=1&limit=10` | Pagination |

Success (200):

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "count": 15,
  "page": 1,
  "totalPages": 2,
  "data": [
    {
      "_id": "6a99122eda0066e3595c10dd",
      "productName": "NU Hoodie",
      "description": "Navy hoodie with the NU Bulldogs logo",
      "price": 850,
      "stock": 40,
      "image": "https://res.cloudinary.com/.../bulldogs-exchange/products/abc123.webp",
      "categoryId": { "_id": "6a8d82f607c4638c2db680ee", "categoryName": "Apparel & Wearables" }
    }
  ]
}
```

### Create / Update Product

Use **form-data** in Postman so you can attach the image:

| Field | Type | Required |
|---|---|---|
| productName | text | Yes |
| description | text | Yes |
| price | number | Yes |
| stock | number | Yes |
| categoryId | text | Yes |
| image | file | Yes when creating, optional when updating |

- The image must be JPG, PNG or WEBP and not bigger than 5MB.
- When updating with a new image, the old image is deleted from Cloudinary.
- When a product is deleted, its image is also deleted from Cloudinary.

Errors:
- `400`: `"Image is too large. Maximum file size is 5MB."`, `"Invalid image type..."`, or `"Product image is required..."`
- `404`: `"Product not found."`

### Upload Image

`POST /products/:id/upload-image` with form-data key `image` (file)

Success (200):

```json
{
  "success": true,
  "message": "Product image uploaded successfully.",
  "imageUrl": "https://res.cloudinary.com/.../bulldogs-exchange/products/abc123.webp",
  "publicId": "bulldogs-exchange/products/abc123"
}
```

---

## Suppliers

All supplier endpoints are **Admin only**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/suppliers` | Get all suppliers (can use `?search=` and `?isActive=`) |
| GET | `/suppliers/:id` | Get one supplier |
| POST | `/suppliers` | Create a supplier |
| PUT | `/suppliers/:id` | Update a supplier |
| DELETE | `/suppliers/:id` | Delete a supplier |

Request body (create):

```json
{
  "supplierName": "Manila Shirt Printing Co.",
  "contactPerson": "Ana Lopez",
  "email": "orders@manilashirtprint.ph",
  "phoneNumber": "09201234567",
  "address": "Divisoria, Manila",
  "categoryIds": ["6a8d82f607c4638c2db680ee"]
}
```

- Supplier name must be unique
- Phone number must be 11 digits
- Errors: `400` (`"A supplier with this name already exists."` or invalid data), `404` (`"Supplier not found"`)

---

## Carts

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/carts` | User | Get your carts (Admin sees all) |
| POST | `/carts` | User | Create a cart |
| PUT | `/carts/:id` | Owner | Update a cart |
| DELETE | `/carts/:id` | Owner | Delete a cart |

Request body:

```json
{
  "userId": "6a9a0c1f2b3c4d5e6f708192",
  "products": [
    { "productId": "6a99122eda0066e3595c10dd", "quantity": 2 }
  ],
  "totalPrice": 1700
}
```

- `userId` must be your own id, otherwise you get `403`
- Quantity must be at least 1

---

## Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/orders` | User | Get your orders (Admin sees all) |
| POST | `/orders` | User | Place an order |
| PUT | `/orders/:id` | Admin | Update order status |
| DELETE | `/orders/:id` | Admin | Delete an order |

Request body (place order):

```json
{
  "userId": "6a9a0c1f2b3c4d5e6f708192",
  "products": [
    { "productName": "NU Hoodie", "price": 850, "quantity": 2 }
  ],
  "totalAmount": 1700,
  "shippingAddress": "NU Manila, Sampaloc",
  "paymentMethod": "GCash"
}
```

- Payment method: `Cash on Delivery`, `GCash` or `Credit Card`
- Order status: `Pending` (default), `Processing`, `Shipped`, `Delivered` or `Cancelled`

Update status (Admin):

```json
{ "orderStatus": "Processing" }
```

---

## Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reviews` | Public | Get all reviews |
| POST | `/reviews` | User | Post a review |
| PUT | `/reviews/:id` | Admin | Edit a review |
| DELETE | `/reviews/:id` | Admin | Delete a review |

Request body:

```json
{
  "userId": "6a9a0c1f2b3c4d5e6f708192",
  "productId": "6a99122eda0066e3595c10dd",
  "rating": 5,
  "comment": "Great quality, fits perfectly!"
}
```

- Rating must be from 1 to 5
- You can only post a review using your own `userId`

---

## Testing

### Swagger

1. Run the server and open `http://localhost:8000/api-docs`
2. Use `POST /users/login` and click **Try it out**, then **Execute**
3. Copy the token, click **Authorize**, and paste it
4. Now you can test the other endpoints

### Postman

1. Import the collection and environment from the `postman` folder
2. Select the **Bulldogs Exchange - Local** environment and put your admin email and password
3. Run **Login as Admin** first (the token is saved automatically)
4. Run the whole collection using **Run collection**

The collection has folders for Authentication, Users, Categories, Products, Suppliers, Carts, Orders and Reviews. Each request has tests that check the status code and the response, including error cases like no token (401), wrong role (403) and invalid data (400).