# API Testing Guide - Smart Library Management System

This file contains ready-to-use API requests for testing all endpoints. You can use these with Postman, Thunder Client, or any REST client.

## Base URL
```
http://localhost:5000
```

---

## 1️⃣ AUTHENTICATION

### Register Admin
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@library.com",
  "password": "admin123",
  "role": "admin"
}
```

### Register User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "membershipType": "1year"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@library.com",
  "password": "admin123"
}
```
**Save the token from the response!**

---

## 2️⃣ BOOK MANAGEMENT

### Create Book (Admin Only)
```http
POST http://localhost:5000/api/books
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "1984",
  "author": "George Orwell",
  "category": "Fiction",
  "type": "Book",
  "serialNo": "BK001",
  "cost": 450
}
```

### Create Movie (Admin Only)
```http
POST http://localhost:5000/api/books
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "The Shawshank Redemption",
  "author": "Frank Darabont",
  "category": "Drama",
  "type": "Movie",
  "serialNo": "MV001",
  "cost": 250
}
```

### Get All Books
```http
GET http://localhost:5000/api/books
Authorization: Bearer YOUR_TOKEN
```

### Get Available Books Only
```http
GET http://localhost:5000/api/books/available
Authorization: Bearer YOUR_TOKEN
```

### Update Book (Admin Only)
```http
PUT http://localhost:5000/api/books/BOOK_ID_HERE
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "cost": 500,
  "isAvailable": true
}
```

---

## 3️⃣ ISSUE SYSTEM

### Issue a Book
```http
POST http://localhost:5000/api/issues
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

{
  "bookId": "BOOK_ID_HERE",
  "issueDate": "2026-02-11",
  "returnDate": "2026-02-20"
}
```

### Return Book (On Time - No Fine)
```http
POST http://localhost:5000/api/issues/return/ISSUE_ID_HERE
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

{
  "actualReturnDate": "2026-02-20"
}
```

### Return Book (Late - With Fine)
```http
POST http://localhost:5000/api/issues/return/ISSUE_ID_HERE
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

{
  "actualReturnDate": "2026-02-25"
}
```
**This should calculate fine: 5 days late = ₹50**

### Pay Fine
```http
POST http://localhost:5000/api/issues/payfine/ISSUE_ID_HERE
Authorization: Bearer YOUR_USER_TOKEN
```

### Get User's Issues
```http
GET http://localhost:5000/api/issues/user/USER_ID_HERE
Authorization: Bearer YOUR_USER_TOKEN
```

---

## 4️⃣ REPORTS

### Get All Books Report
```http
GET http://localhost:5000/api/reports/books
Authorization: Bearer YOUR_TOKEN
```

### Get All Movies Report
```http
GET http://localhost:5000/api/reports/movies
Authorization: Bearer YOUR_TOKEN
```

### Get Memberships (Admin Only)
```http
GET http://localhost:5000/api/reports/memberships
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Get Active Issues
```http
GET http://localhost:5000/api/reports/active-issues
Authorization: Bearer YOUR_TOKEN
```

### Get Overdue Issues
```http
GET http://localhost:5000/api/reports/overdue
Authorization: Bearer YOUR_TOKEN
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Happy Path
1. Register a user
2. Login to get token
3. Create books as admin
4. Issue a book
5. Return on time (no fine)
6. Pay fine (completes return)

### Scenario 2: Late Return
1. Issue a book with returnDate in the past
2. Return with actualReturnDate > returnDate
3. Verify fine is calculated (₹10/day)
4. Pay fine
5. Verify book becomes available

### Scenario 3: Validation Tests
1. Try issuing 4th book (should fail - max 3 limit)
2. Try issuing unavailable book (should fail)
3. Try issuing with expired membership (should fail)
4. Try issuing with returnDate > 15 days (should fail)
5. Try creating book as user (should fail - admin only)

### Scenario 4: Security Tests
1. Try accessing protected routes without token (should fail)
2. Try viewing another user's issues as regular user (should fail)
3. Try creating book as regular user (should fail)
4. Verify admin can access all data

---

## 📝 NOTES

- Replace `YOUR_TOKEN`, `YOUR_ADMIN_TOKEN`, `YOUR_USER_TOKEN` with actual JWT tokens
- Replace `BOOK_ID_HERE`, `ISSUE_ID_HERE`, `USER_ID_HERE` with actual MongoDB ObjectIDs
- All dates should be in `YYYY-MM-DD` format
- Token is returned in the `data.token` field of auth responses
- Fine calculation: (actualReturnDate - returnDate) × ₹10 per day

---

## ✅ Expected Responses

### Success Response Format
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🚀 Quick Testing Flow

1. **Start MongoDB:** `mongod`
2. **Start Server:** `cd server && npm run dev`
3. **Register Admin:** Use register endpoint with `"role": "admin"`
4. **Register User:** Use register endpoint with `"membershipType": "1year"`
5. **Login Both:** Save both tokens
6. **Create Books:** Use admin token
7. **Issue Books:** Use user token
8. **Test All Features:** Follow scenarios above

Happy Testing! 🎉
