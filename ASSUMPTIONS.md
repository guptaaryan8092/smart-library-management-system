# Project Assumptions and Design Decisions

This document outlines the key assumptions, business rules, and design decisions made during the development of the Smart Library Management System.

## Business Rules

### 1. Book Issue Policy

**Maximum Books Per User:** 3 active issues at a time
- **Rationale:** Prevents hoarding and ensures fair distribution
- **Implementation:** Validated in `issueController.js` before creating new issue

**Maximum Issue Period:** 15 days
- **Rationale:** Standard library policy for short-term loans
- **Implementation:** Validated on both frontend and backend
- **Calculation:** Return date cannot exceed issue date + 15 days

**Duplicate Prevention:** Users cannot issue the same book twice
- **Rationale:** Prevents accidental duplicate issues
- **Implementation:** Database query checks for existing active issue of same book by same user

### 2. Fine Calculation

**Fine Rate:** ₹10 per day for overdue returns
- **Rationale:** Reasonable penalty to encourage timely returns
- **Implementation:** `utils/fineCalculator.js`
- **Formula:** `(days overdue) × ₹10`

**Fine Payment Requirement:** Fines must be paid before completing return
- **Rationale:** Ensures accountability
- **Implementation:** Validated in `payFine` controller
- **Frontend:** Checkbox required when fine > 0

**Grace Period:** None
- **Rationale:** Simplicity in calculation
- **Note:** Fine starts from day 1 after due date

### 3. Membership System

**Membership Types:**
- 6 months
- 1 year
- 2 years

**Membership Number Generation:**
- **Format:** `MEM{timestamp}{random3digits}`
- **Example:** `MEM1770889477045653`
- **Rationale:** Ensures uniqueness
- **Implementation:** Pre-save hook in User model

**Membership Expiry:**
- **Calculation:** Automatic based on membership type
- **Implementation:** Pre-save hook in User model
- **Validation:** Checked before allowing book issue

**Admin Membership:** Admins don't require membership
- **Rationale:** Administrative accounts are permanent
- **Implementation:** `isMembershipActive()` returns true for admins

### 4. User Roles

**Two Roles:**
1. **Admin:** Full system access
2. **User:** Limited to personal operations

**Role-Based Access:**
- **Frontend:** Protected routes with role checking
- **Backend:** Middleware validation on sensitive endpoints
- **Default:** New registrations default to 'user' role

**Admin Privileges:**
- Add/update books and movies
- View all users and issues
- Issue books on behalf of users
- Access all reports

**User Restrictions:**
- Can only view own issues
- Cannot access maintenance features
- Cannot view other users' data

### 5. Book Availability

**Availability Status:** Boolean (available/not available)
- **True:** Book is in library and can be issued
- **False:** Book is currently issued to someone

**Status Updates:**
- Set to `false` when book is issued
- Set to `true` when return is completed (after fine payment)
- **Implementation:** Automatic in issue/return controllers

**Search Functionality:**
- Users can search by title, author, or category
- At least one search field required
- **Rationale:** Prevents empty searches

### 6. Authentication & Security

**JWT Token:**
- **Expiry:** 24 hours
- **Storage:** localStorage on frontend
- **Transmission:** Bearer token in Authorization header

**Password Security:**
- **Hashing:** bcrypt with salt rounds = 10
- **Minimum Length:** 6 characters
- **Implementation:** Pre-save hook in User model

**Rate Limiting:**
- **Auth Routes:** 5 requests per 15 minutes
- **Rationale:** Prevents brute force attacks
- **Implementation:** express-rate-limit middleware

**CORS:**
- **Development:** Allow localhost:5174
- **Production:** Restrict to frontend URL only
- **Credentials:** Enabled for cookie support

### 7. Data Validation

**Required Fields:**

*Book/Movie:*
- Title, Author, Category, Type, Serial Number, Cost

*User:*
- Name, Email, Password
- Membership Type (for users, not admins)

*Issue:*
- Book ID, User ID, Issue Date, Return Date

**Validation Layers:**
1. **Frontend:** Immediate user feedback
2. **Backend:** Security and data integrity
3. **Database:** Schema validation

### 8. Error Handling

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Stack Traces:**
- **Development:** Included in response
- **Production:** Hidden for security

### 9. Report Assumptions

**Master Books/Movies:**
- Shows all items regardless of availability
- Includes availability status indicator

**Active Issues:**
- Shows only currently issued books (status = 'Issued')
- Users see only their own issues
- Admins see all issues

**Overdue Returns:**
- Calculated based on current date vs return date
- Shows estimated fine (not yet paid)
- Sorted by days overdue (descending)

**Memberships Report:**
- **Admin only**
- Shows all users with membership details
- Includes expiry status

### 10. Frontend Assumptions

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required

**Screen Sizes:**
- Optimized for desktop (1024px+)
- Responsive down to tablet (768px)
- Mobile support (basic)

**Navigation:**
- Sidebar navigation for main features
- Breadcrumb-style flow for transactions
- Auto-redirect on authentication changes

### 11. Database Assumptions

**MongoDB Collections:**
- `users` - User accounts and memberships
- `books` - Books and movies catalog
- `issues` - Issue/return transactions

**Indexes:**
- Email (unique) on users
- Serial number (unique) on books
- Membership number (unique, sparse) on users

**Soft Delete:** Not implemented
- **Rationale:** Simplicity
- **Note:** Can be added later if needed

### 12. Performance Assumptions

**Expected Load:**
- Small to medium library (< 10,000 books)
- < 1,000 concurrent users
- **Rationale:** Free tier hosting limits

**Optimization:**
- Database indexes on frequently queried fields
- Pagination not implemented (can be added)
- Caching not implemented (can be added)

### 13. Deployment Assumptions

**Hosting:**
- Backend: Render (free tier)
- Frontend: Vercel (free tier)
- Database: MongoDB Atlas (free tier)

**Limitations:**
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- **Mitigation:** Consider paid tier for production

**Environment:**
- Node.js v16+
- MongoDB 4.4+

### 14. Future Enhancements (Not Implemented)

**Potential Additions:**
- Email notifications for due dates
- Book reservations
- Multiple copies of same book
- Book categories with images
- User profile pictures
- Export reports to PDF/Excel
- Advanced search with filters
- Book recommendations
- Reading history analytics

**Rationale for Exclusion:**
- Scope management
- Time constraints
- Complexity vs benefit
- Can be added incrementally

---

## Technical Decisions

### Why React (not Angular/Vue)?
- Large ecosystem and community
- Excellent documentation
- Vite for fast development
- Hooks for clean state management

### Why Tailwind CSS?
- Utility-first approach
- Fast prototyping
- Consistent design system
- Small production bundle

### Why JWT (not sessions)?
- Stateless authentication
- Scalable across servers
- Mobile-friendly
- Industry standard

### Why MongoDB (not SQL)?
- Flexible schema
- JSON-like documents
- Easy to start
- Free tier on Atlas

### Why Context API (not Redux)?
- Simpler for this scale
- Built into React
- Sufficient for auth state
- Less boilerplate

---

## Constraints

1. **No TypeScript:** As per requirements
2. **No Redux:** Using Context API
3. **No Testing:** Not in scope (can be added)
4. **No CI/CD:** Manual deployment
5. **No Email Service:** No SMTP integration
6. **No File Uploads:** No book cover images
7. **No Pagination:** All data loaded at once
8. **No Caching:** Direct API calls

---

## Notes

- All monetary values in Indian Rupees (₹)
- Dates stored in ISO format
- Timestamps automatic via Mongoose
- All times in server timezone
- No internationalization (i18n)

---

This document should be updated as the project evolves and new decisions are made.
