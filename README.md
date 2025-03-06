# E-commerce Store API

This project implements an e-commerce store backend with functionalities for adding items to a cart, checking out, and handling discount codes. It also includes admin APIs for generating discount codes and retrieving purchase statistics.

## Features

- **Add Items to Cart:** Users can add products to their cart.
- **Checkout:** Users can proceed to checkout and place an order.
- **Discount Codes:** Every *n*th order gets a 10% discount coupon.
- **Admin APIs:**
  - Generate a discount code if conditions are met.
  - Retrieve purchase statistics, including total purchases, discount codes, and total discount amount.
- **In-Memory Store:** The API does not persist data in a database; it uses an in-memory store.

## Technology Stack

- **Backend:** NextJs
- **Data Storage:** In-memory store using JavaScript objects
- **API Documentation:** Postman or REST client
- **UI (Optional Stretch Goal):** NextJs

## Base URL

/api

## Authentication

All endpoints requiring user identification expect a `user-id` header.

## Endpoints

### Products

#### Get All Products

GET /api/products
Returns a list of all available products.

### Cart Operations

#### Get Cart

GET /api/cart
Headers:
user-id: string (required)
Returns the current cart for the specified user.

#### Add to Cart

POST /api/cart/add
Headers:
user-id: string (required)
Body:
{
"productId": string (required),
"quantity": number (default: 1)
}
Adds an item to the user's cart.

#### Remove from Cart

POST /api/cart/remove
Headers:
user-id: string (required)
Body:
{
"productId": string (required),
"quantity": number (default: 1)
}
Removes an item from the user's cart.

### Checkout

#### Process Checkout

POST /api/checkout
Headers:
user-id: string (required)
Body:
{
"discountCode": string (optional),
"cartItems": array (required)
}
Processes the checkout for the current cart.

### Discounts

#### Get Available Discount Codes

GET /api/discounts
Returns a list of available discount codes.

#### Generate Discount Code (Admin)

POST /api/admin/discount/generate
Generates a new discount code.

### Admin

#### Get Store Statistics

GET /api/admin/stats
Returns store statistics and metrics.

## Error Responses

All endpoints may return the following error structures:

{
"error": "Error message description",
"details": "Additional error details (development only)"
}

Common HTTP Status Codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized (missing user-id)
- 409: Conflict (cart sync issues)
- 500: Server Error

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/U220053/store_assignment.git
   ```
2. Navigate to the project directory:
   ```sh
   cd store_assignment
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```
4. Start the server:
   ```sh
   pnpm dev
   ```
5. Run unit tests:
   ```sh
   pnpm test
   ```

## Pushing to GitHub

1. Initialize Git (if not already initialized):
   ```sh
   git init
   ```
2. Add remote repository:
   ```sh
   git remote add origin https://github.com/U220053/store_assignment.git
   ```
3. Add files to staging:
   ```sh
   git add .
   ```
4. Commit changes:
   ```sh
   git commit -m "Initial commit"
   ```
5. Push to GitHub:
   ```sh
   git push origin main
   ```
