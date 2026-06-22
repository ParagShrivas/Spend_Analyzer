# Spend Analyzer

Spend Analyzer is a full-stack personal finance web application that helps users track daily expenses, manage spending, create bill alerts and reminders, and view spending insights through charts and dashboards.

The project includes secure authentication with email OTP verification, forgot-password OTP recovery, password reset confirmation emails, expense management, notifications, and reminder emails.

---

## Features

### Authentication & Security

* User registration with encrypted passwords
* Login using email and password
* Email OTP verification after login
* JWT authentication using HTTP-only cookies
* Forgot password flow with email OTP
* Reset password after OTP verification
* Password changed confirmation email
* OTP expiry protection
* Maximum OTP attempt validation
* Secure password hashing with bcrypt
* Logout functionality

### Expense Management

* Add new expenses
* Edit expenses
* Delete expenses
* View all expense records
* Expense categories
* Expense amount and date tracking
* Pagination support
* Prevent future expense dates
* Total expense calculation

### Dashboard & Analytics

* Total expense overview
* Expense category breakdown
* Pie chart for category-wise expenses
* Monthly expense trend chart
* Recent expenses section
* Spending insights dashboard
* Budget-related overview

### Reminders & Bill Alerts

* Create personal reminders
* Create bill payment alerts
* Add title, category, amount, date, time, and notes
* View upcoming reminders and alerts
* Mark notifications as read
* Delete reminders and alerts
* Email notification when a reminder or bill alert is created
* Due-date email reminders
* Bill amount shown in alert emails

### Profile

* View profile information
* Update name, email, and phone number
* Change password
* Secure logout

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Context API
* CSS
* Font Awesome
* Fetch API

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT
* bcrypt
* cookie-parser
* CORS
* Nodemailer / SMTP email service

---

## Project Structure


Spend-Analyzer/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── expenseController.js
│   │   ├── budgetController.js
│   │   ├── notificationController.js
│   │   └── settingsController.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   ├── expenseModel.js
│   │   ├── budgetModel.js
│   │   ├── notificationModel.js
│   │   └── settingsModel.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── settingsRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── jobs/
│   │   └── notificationScheduler.js
│   │
│   ├── utils/
│   │   ├── sendMail.js
│   │   ├── mailTemplates.js
│   │   └── otpHelper.js
│   │
│   ├── .env
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── css/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

---

## Installation

### 1. Clone the Repository

bash
git clone <your-repository-url>
cd Spend-Analyzer


### 2. Install Backend Dependencies

bash
cd backend
npm install


### 3. Install Frontend Dependencies

bash
cd ../frontend
npm install


---

## Environment Variables

Create a `.env` file inside the `backend` folder.

env
PORT=1500

JWT_SECRET=your_jwt_secret_key

DB_HOST=localhost
DB_PORT=5432
DB_NAME=spend_analyzer
DB_USER=postgres
DB_PASSWORD=your_database_password

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

NODE_ENV=development



Use your actual SMTP configuration based on your `sendMail.js` setup.

---

## Run the Application

### Start Backend

bash
cd backend
npm run dev


Or:

bash
node server.js


Backend runs on:


http://localhost:1500


### Start Frontend

bash
cd frontend
npm start


Frontend runs on:


http://localhost:3000


---

## Database Tables

### `users`

Stores user account information.


user_id
user_name
user_email
user_password
phone
created_at


### `expenses`

Stores expense details.


expense_id
user_id
title
category
amount
expense_date
created_at


### `login_otps`

Stores OTP records for login and forgot-password verification.


user_id
otp_hash
expires_at
attempts
created_at
purpose
is_verified
verified_at
reset_token_hash
reset_token_expires_at


OTP purposes:


login
forgot_password


### `notifications`

Stores reminders and bill alerts.


notification_id
user_id
type
title
category
amount
notify_date
notify_time
note
is_read
created_at


---

## Authentication Flow

### Login With OTP


User enters email and password
        ↓
Password is verified
        ↓
4-digit OTP is generated
        ↓
OTP is sent to user email
        ↓
User enters OTP
        ↓
OTP is verified
        ↓
JWT cookie is created
        ↓
User is redirected to dashboard


### Forgot Password Flow


User clicks Forgot Password
        ↓
User enters registered email
        ↓
Password reset OTP is sent to email
        ↓
User enters OTP
        ↓
OTP is verified
        ↓
Temporary reset token is created
        ↓
User enters new password
        ↓
Password is updated
        ↓
Password changed confirmation email is sent


---

## Main API Routes

### User Routes


POST   /user/register
POST   /user/login
POST   /user/verify-login-otp
POST   /user/forgot-password
POST   /user/verify-forgot-password-otp
POST   /user/reset-password
GET    /user/me
PUT    /user/profile
POST   /user/logout


### Expense Routes


POST    /expense/add
GET     /expense/get
PUT     /expense/update/:id
DELETE  /expense/delete/:id


### Notification Routes


POST    /notification/add
GET     /notification/get
GET     /notification/upcoming
PUT     /notification/read/:id
DELETE  /notification/delete/:id


Adjust endpoint names if your route files use different paths.

---

## Email Notifications

The application sends emails for:

* Login OTP verification
* Forgot password OTP verification
* Password changed successfully
* Reminder created
* Bill alert created
* Upcoming reminder notification
* Upcoming bill payment alert

---

## Security Features

* Passwords are hashed using `bcrypt`
* OTP values are hashed before storing in the database
* OTP expiry is set to 10 minutes
* OTP attempts are limited
* JWT is stored in HTTP-only cookies
* Reset tokens are hashed before storage
* Used forgot-password OTP records are deleted after successful password reset
* Password reset confirmation email helps users detect unauthorized changes

---

## Future Improvements

* Google login
* Dashboard export as PDF
* Expense CSV export
* Dark mode
* Monthly budget warning emails
* Recurring expenses
* Multiple currency support
* Mobile application
* Two-factor authentication settings
* Admin dashboard
* Expense receipt image upload

---

## Author

Built by **Parag Shrivas**

---

## License

This project is created for learning and personal portfolio purposes.
