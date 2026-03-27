
# LIT-ERA 📚

Welcome to **LIT-ERA**, the official website and application for the Litera Club. This platform is designed to showcase the club's magazines, manage events, and provide comprehensive information and registration guidelines for our Model United Nations (MUN).

## ✨ Features

- **📖 Magazine & Newsletter:** A dedicated section where users can read the latest club newsletters and other literary publications (supports PDF viewing).
- **🏛️ Model United Nations (MUN):** Detailed guidelines, pricing (Individual and Group delegate fees), and important dates (April 21st-22nd) for the upcoming MUN conference.
- **📅 Events:** View and stay updated on the latest events hosted by the Litera Club.
- **📱 Responsive Design:** A fully responsive, modern web interface tailored for both desktop and mobile viewing.

## 🛠️ Tech Stack

This project is built using a modern Full-Stack TypeScript architecture:

### Frontend
- **React.js** (via Vite)
- **TypeScript**
- **Tailwind CSS** (for utility-first, responsive styling)
- **Radix UI** (for accessible UI components)

### Backend
- **Node.js** & **Express**
- **TypeScript**
- **Drizzle ORM** (for type-safe database queries)

### Database & Deployment
- **MySQL** (Relational Database)
- **Railway** (Configured for easy and seamless full-stack deployment)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://www.mysql.com/) database running locally or remotely

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd LIT-ERA-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your required environment variables (especially your MySQL database connection URL). Sample `.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/litera"
   PORT=5000
   ```

### Database Setup

Step 1: Push your Drizzle schema to the MySQL database.
```bash
npm run db:push
```

### Running the Application

To start the development server (which will simultaneously start your Vite frontend and Express backend):
```bash
npm run dev
```
Your application should now be running on `http://localhost:5000` (or whatever port Vite/Express outputs in the terminal).

### Building for Production

To build the project for production deployment:
```bash
npm run build
```

To start the production server:
```bash
npm run start
```

## 🌐 Deployment (Railway)

This repository is optimized for deployment on **Railway**. 
1. Create a MySQL database instance in your Railway project.
2. Link your GitHub repository to a new Railway service.
3. Pass the `DATABASE_URL` and `PORT` to the service environment variables.
4. The application will automatically build using the `npm run build` script and start using the `npm run start` command.

## 🤝 Contributing

Contributions are always welcome! Feel free to open a pull request or add an issue if you have suggestions for improvements or find any bugs.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
```
