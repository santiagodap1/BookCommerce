# BookCommerce 📚

A premium, modern e-commerce application for browsing and purchasing books. Built with a robust **NestJS** backend and a responsive **React** frontend, featuring a sleek glassmorphism design.

## 📸 Screenshots


- Home
  <img width="1728" height="963" alt="image" src="https://github.com/user-attachments/assets/edac5123-a08e-4574-b47c-081d4ec0c91f" />
  <img width="1728" height="959" alt="image" src="https://github.com/user-attachments/assets/7f9d0809-a893-428f-8cf5-e0d89620ed2d" />



- Details
  <img width="1728" height="964" alt="image" src="https://github.com/user-attachments/assets/79997aee-8d99-4e56-aed4-08712027af76" />


- Cart
  <img width="1728" height="964" alt="image" src="https://github.com/user-attachments/assets/1928339b-44a4-4ac1-b9ae-04ffdbb7aa07" />


- Account
  <img width="1728" height="963" alt="image" src="https://github.com/user-attachments/assets/5cf47215-00de-41f5-a87f-2dd42974d91b" />
  <img width="1728" height="965" alt="image" src="https://github.com/user-attachments/assets/389e4e21-3418-4875-8033-f7b7d32a0337" />



- Checkout
  <img width="1728" height="959" alt="image" src="https://github.com/user-attachments/assets/4ad5d30e-63a8-48b2-9d0d-b868e4d985d7" />

- About us
  <img width="1728" height="961" alt="image" src="https://github.com/user-attachments/assets/10f1e278-4000-4909-8afb-99fbe8e3322e" />


- Contact
 <img width="1728" height="960" alt="image" src="https://github.com/user-attachments/assets/87a40195-2f86-4350-a8a3-46b9eb476e5d" />


- API
  <img width="1728" height="962" alt="image" src="https://github.com/user-attachments/assets/b36a2160-bf3f-469d-970f-85c0cee8501d" />



- Register/Log in
  <img width="1728" height="962" alt="image" src="https://github.com/user-attachments/assets/09d00023-0104-404f-bc5d-3c8c9f4f188e" />


## 🚀 Features

### Frontend (Client)
-   **Modern UI/UX**: Dark theme with glassmorphism effects, smooth animations, and responsive layout.
-   **Book Discovery**:
    -   **Home**: Featured collections, "Team Picks", and real-time search powered by Open Library.
    -   **Book Details**: Rich book information, author details, and subjects.
-   **Shopping Experience**:
    -   **Cart Drawer**: Slide-out cart with real-time updates and "click-outside" closing.
    -   **Checkout**: Streamlined process with address management and order summary.
-   **Authentication & Accounts**:
    -   **Auth Modal**: Seamless Login and Registration tabs.
    -   **User Dashboard**: Manage shipping addresses and view order history.
-   **Mobile Responsive**: Fully optimized for mobile devices with a collapsible sidebar and adaptive grids.

### Backend (Server)
-   **Framework**: Built with **NestJS** for scalability and maintainability.
-   **Database**: **PostgreSQL** with **TypeORM** for data management.
-   **Authentication**: Secure JWT-based authentication using Passport.js.
-   **API**: RESTful endpoints for Users, Books, Orders, and Addresses.

---

## 🛠️ Tech Stack

### Frontend
-   **React 18** + **Vite**
-   **TypeScript**
-   **CSS3** (Custom Properties, Flexbox/Grid, Glassmorphism)
-   **React Router DOM**
-   **Context API** (State Management)
-   **Lucide React** (Icons)

### Backend
-   **NestJS**
-   **TypeScript**
-   **PostgreSQL**
-   **TypeORM**
-   **Passport / JWT**

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   **Node.js** (v16 or higher)
-   **npm** or **yarn**
-   **PostgreSQL** database installed and running.

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

**Environment Configuration:**
Create a `.env` file in the `backend` root (copy from `.env.example` if available) and configure your database connection:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_DATABASE=bookcommerce_db
JWT_SECRET=your_jwt_secret
```

Run database migrations (if applicable) or seed the database:
```bash
npm run migration:run
# or
npm run db:seed
```

Start the development server:
```bash
npm run start:dev
```
*The backend server should now be running on `http://localhost:3000` (or your configured port).*

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
*The frontend application should now be accessible at `http://localhost:5173`.*

---

## 📂 Project Structure

### Frontend (`/frontend`)
-   `src/components`: Reusable UI components (`layout`, `ui`, `auth`).
-   `src/pages`: Application pages (`home`, `book`, `checkout`, `account`, etc.).
-   `src/context`: Global state management (`AuthContext`, `CartContext`).
-   `src/services`: API integration services.
-   `src/hooks`: Custom React hooks.

### Backend (`/backend`)
-   `src/modules`: Feature modules (Users, Books, Orders, Auth).
-   `src/database`: Database configuration, entities, and migrations.
-   `src/auth`: Authentication strategies and guards.

---

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

