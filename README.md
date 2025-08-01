# Team Task Tracker

A full-stack MERN application for team task management with role-based access control.

## Features

- **User Authentication**: Separate registration and login for Admin and User roles
- **Role-based Access**: Different dashboards and permissions for Admin and User
- **Task Management**: Create, edit, delete, and assign tasks
- **Task Status Tracking**: To Do, In Progress, Done
- **Priority Levels**: Low, Medium, High
- **Responsive UI**: Modern design with Tailwind CSS
- **Real-time Updates**: Live task status updates

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas + Mongoose
- **Authentication**: JWT + bcrypt
- **State Management**: React Context API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd team-task-tracker
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Environment Configuration

#### Backend Configuration
Edit `backend/config.env`:
```env
PORT=5007
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/team-task-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.

### 4. Start the application

#### Development (both frontend and backend)
```bash
npm run dev
```

#### Or start separately:

**Backend (Port 5007)**
```bash
npm run server
```

**Frontend (Port 3005)**
```bash
npm run client
```

### 5. Access the application
- Frontend: http://localhost:3005
- Backend API: http://localhost:5007

## API Endpoints

### Authentication
- `POST /api/auth/admin/register` - Register Admin
- `POST /api/auth/admin/login` - Login Admin
- `POST /api/auth/user/register` - Register User
- `POST /api/auth/user/login` - Login User
- `GET /api/auth/me` - Get current user

### Tasks
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks` - Get all tasks (Admin only)
- `GET /api/tasks/my` - Get user's tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)

## Usage

### Admin Features
1. **Register/Login**: Create an admin account or login
2. **Dashboard**: View all tasks with statistics
3. **Create Tasks**: Assign tasks to users with priority and due dates
4. **Manage Tasks**: Edit, delete, and reassign tasks
5. **User Management**: View all registered users

### User Features
1. **Register/Login**: Create a user account or login
2. **Dashboard**: View assigned tasks with personal statistics
3. **Update Status**: Change task status (To Do → In Progress → Done)
4. **Task Management**: View and update assigned tasks

## Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/User),
  timestamps: true
}
```

### Task Schema
```javascript
{
  title: String,
  description: String,
  assignedTo: ObjectId (ref: User),
  status: String (To Do/In Progress/Done),
  priority: String (Low/Medium/High),
  dueDate: Date,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization middleware
- Input validation and sanitization
- CORS configuration

## Deployment

### Frontend (Vercel)
1. Build the frontend: `npm run build`
2. Deploy to Vercel with the build output

### Backend (Render/Heroku)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API base URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License #   f u l l s t a c k - t a s k _ t r a c k e r  
 