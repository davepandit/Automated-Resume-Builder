# Automated Resume Builder

A modern web application that helps users create professional resumes with AI-powered sugggestions and content generation, multiple templates, and easy customization options.

## Features
- **User Management** (with proper validation)
  - Secure authentication
  - Save multiple resumes
  - Edit saved resumes

- **AI-Powered Suggestions and Content Generation**
  - Auto-generate professional summaries and descriptions
  - Smart content suggestions for skills and experiences
  
  **Rich Customization**
  - Customizable sections (Experience, Education, Skills, Projects)
  - Theme color selection
  - Dynamic rating system for skills
  - Rich text editing support

  **Multiple Resume Templates**
  - 4 professionally designed templates
  - Real-time preview while editing
  - ATS-friendly layouts

- **Export Options**
  - Download as PDF
  - Export as Word document


## 🛠️ Tech Stack

### Frontend
- React + Vite
- Redux Toolkit for state management
- Tailwind CSS for styling
- Clerk for authentication
- React Router for navigation

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email services

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Automated-Resume-Builder-SE.git
cd Automated-Resume-Builder-SE
```

2. Install Backend Dependencies
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies
```bash
cd Frontend
npm install
```

4. Set up environment variables

Backend (.env):
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Frontend (.env.local):
```env
VITE_APP_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

5. Start the servers

Backend:
```bash
cd Backend
npm run dev
```

Frontend:
```bash
cd Frontend
npm run dev
```

## 📝 Project Structure

```
├── Frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   └── Services/      # API services
│
├── Backend/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── middleware/    # Custom middleware
```

## 👥 Team Members

- Student-1 Debajyoti Pandit (231IT020)
- Student-2 Laxminarayan Sahu (231IT035)
- Student-3 NaveenKumar (231IT042)


## 🎓 Academic Context

This project was developed as part of the Software Engineering (IT303) course at NITK - Department of Information Technology.