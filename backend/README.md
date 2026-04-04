# EAP Dashboard System

A full-stack **Admin Dashboard System** built with a modern web stack.
It provides user management, order management, activity logs, and role-based access control.

## 🌐 Live Applications

- **Frontend:** https://eap-task.vercel.app
- **Backend API:** https://eap-backend-psi.vercel.app/api/v1

---

# 🧰 Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- TanStack Query (React Query)
- Axios
- Lucide Icons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt Password Hashing

---

# 📦 Project Structure

```
project-root
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
│
├── backend
│   ├── src
│   │   ├── modules
│   │   │   ├── user
│   │   │   ├── order
│   │   │   ├── activity
│   │   │   └── auth
│   │   ├── middleware
│   │   ├── routes
│   │   ├── utils
│   │   └── config
│   │
│   └── server.ts
│
└── README.md
```

---

# 🚀 Features

## Authentication

- JWT Based Authentication
- Login System
- Secure Password Hashing (bcrypt)

## User Management

- Create User
- Update User
- View Users
- Role Based Access

Roles:

- Admin
- Manager
- User

## Dashboard

- Statistics Overview
- Activity Logs
- Order Monitoring

## Orders

- Order listing
- Order status management
- Pagination & filtering

## Activity Logs

Tracks:

- User actions
- System events
- Dashboard activity

---

# ⚙️ Environment Variables

## Backend `.env`

```
NODE_ENV=development
PORT=5000

DATABASE_URL=mongodb+srv://admin:username123@cluster0.reagpra.mongodb.net/?appName=Cluster0

BCRYPT_SALT_ROUNDS=10
```

---

## Frontend `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

# 📡 API Base URL

```
https://eap-backend-psi.vercel.app/api/v1
```

Example endpoint:

```
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
```

---

# 📄 API Modules

## Auth

```
POST /auth/login
POST /auth/register
```

---

## Users

```
GET /users
GET /users/:id
POST /users
PATCH /users/:id
DELETE /users/:id
```

---

## Orders

```
GET /orders
GET /orders/:id
PATCH /orders/:id
```

Query params supported:

```
?page=1
&limit=10
&status=pending
&isActive=true
```

---

## Activity Logs

```
GET /activity-logs
```

Tracks:

- user login
- order updates
- system changes

---

# 🧪 Running Locally

## 1️⃣ Clone the repository

```
git clone https://github.com/your-repo-name/project.git
```

---

## 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env`

```
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_url
BCRYPT_SALT_ROUNDS=10
```

Run server

```
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 3️⃣ Frontend Setup

```
cd frontend
npm install
```

Create `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Run frontend

```
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 📊 Pagination Example

```
GET /orders?page=1&limit=10
```

Response example:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 120
  }
}
```

---

# 🔐 Security

- Password hashing using bcrypt
- JWT authentication
- Role based access control
- Protected API routes

---

# 🧑‍💻 Developer

**Md. Ariful Islam**

Full Stack Developer
Node.js | Next.js | MongoDB | TypeScript

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Contribution

Contributions, issues, and feature requests are welcome.

Feel free to fork the repo and submit pull requests.

---

# 📬 Contact

If you have any questions or suggestions, feel free to reach out.
