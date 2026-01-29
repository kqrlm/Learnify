# 🎓 Learnify System - Complete Modules Documentation

## 📋 Table of Contents
1. [Backend Modules](#backend-modules)
2. [Frontend Modules](#frontend-modules)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Configuration](#configuration)

---

## 🔧 Backend Modules

### **Server Setup** (`server/server.js`)
- Express server initialization
- CORS middleware configuration
- MongoDB connection
- Route registration
- Port: 3000 (default)

```javascript
// Routes Registered:
- GET / → Server health check
- /api/user → User routes
- /api/chat → Chat routes
```

---

## 🛣️ Backend Routes & Controllers

### **1. USER MODULE** (`/api/user`)

#### **File:** `server/routes/userRoute.js`

| Endpoint | Method | Auth | Controller | Purpose |
|----------|--------|------|-----------|---------|
| `/register` | POST | ✗ | `registerUser()` | Create new user account |
| `/login` | POST | ✗ | `loginUser()` | Authenticate user |
| `/data` | GET | ✓ | `getUser()` | Fetch authenticated user profile |

#### **Controller:** `server/controllers/userController.js`

**Exports:**
- `registerUser(req, res)` - Register new user with email & password (bcrypt hashing)
- `loginUser(req, res)` - Authenticate and return JWT token
- `getUser(req, res)` - Get authenticated user data
- `generateToken(id)` - Generate 30-day JWT token

**Security Features:**
- Bcryptjs password hashing (10 salt rounds)
- JWT token generation
- Duplicate email check

---

### **2. CHAT MODULE** (`/api/chat`)

#### **File:** `server/routes/chatRoutes.js`

| Endpoint | Method | Auth | Controller | Purpose |
|----------|--------|------|-----------|---------|
| `/create` | GET | ✓ | `createChat()` | Create new chat |
| `/get` | GET | ✓ | `getChats()` | Fetch user's chats |
| `/delete` | POST | ✓ | `deleteChat()` | Delete specific chat |
| `/text` | POST | ✓ | `textMessageController()` | Send text message to AI |
| `/image` | POST | ✓ | `imageMessageController()` | Generate AI image |

#### **Controllers:** `server/controllers/chatController.js`

**Exports:**
- `createChat(req, res)` - Creates new chat with empty messages array
- `getChats(req, res)` - Fetches all user chats sorted by updatedAt DESC
- `deleteChat(req, res)` - Deletes chat if it belongs to user

#### **Controllers:** `server/controllers/messageController.js`

**Exports:**
- `textMessageController(req, res)`
  - Receives: `{chatId, prompt}`
  - Calls Gemini 2.0 Flash API
  - Saves messages to MongoDB
  - Returns AI response with timestamp

- `imageMessageController(req, res)`
  - Receives: `{chatId, prompt}`
  - Generates image via Gemini
  - Returns image URL and metadata
  - Saves to chat messages

---

## 🛡️ Middleware

### **Authentication Middleware** (`server/middlewares/auth.js`)

**Function:** `protect(req, res, next)`
- Extracts Bearer token from Authorization header
- Verifies JWT signature
- Validates token expiration
- Attaches user object to request
- Returns 401 if token invalid/missing

**Token Format:** `Authorization: Bearer <JWT_TOKEN>`

---

## ⚙️ Configuration Files

### **Database Config** (`server/configs/db.js`)
```javascript
- Mongoose connection
- Connection event listeners
- URI: mongodb+srv://karl:karlo2008@cluster0.pltfrpe.mongodb.net/learnify
- Auto-retry on failure
```

### **AI API Config** (`server/configs/openai.js`)
```javascript
- OpenAI client (Gemini compatible)
- Base URL: generativelanguage.googleapis.com/v1beta/openai/
- API Key: process.env.GEMINI_API_KEY
- Model: gemini-2.0-flash
```

---

## 📦 Database Models

### **1. User Model** (`server/models/User.js`)
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt hashed, required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### **2. Chat Model** (`server/models/Chat.js`)
```javascript
{
  userId: String (ref: User._id, required),
  userName: String (required),
  name: String (required, default: "New Chat"),
  messages: [
    {
      role: String (user|assistant),
      content: String,
      isImage: Boolean,
      isPublished: Boolean (default: false),
      timestamp: Number,
      isWebSearch: Boolean (for future),
      sources: Array (for future)
    }
  ],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🎨 Frontend Modules

### **Entry Point** (`client/src/main.jsx`)
- React DOM render
- App component mounting
- CSS imports

### **Root Component** (`client/src/App.jsx`)
- React Router setup
- Routes: `/login`, `/`
- Protected route logic
- Menu toggle for mobile
- Toaster for notifications

**Routes:**
```javascript
Route "/" 
  ├─ Authenticated: Sidebar + ChatBox
  └─ Not Authenticated: Redirect to /login

Route "/login"
  └─ Login/Register page
```

---

## 🎯 Context Management

### **AppContext** (`client/src/context/AppContext.jsx`)

**State Variables:**
```javascript
{
  user: User object | null,
  chats: Chat[],
  selectedChat: Chat | null,
  theme: 'light' | 'dark',
  token: JWT string | null,
  loadingUser: Boolean,
}
```

**Exported Functions:**
- `fetchUser(tokenParam?)` - Fetch user profile from API
- `fetchUserChats(autoCreate=true)` - Get all user chats, auto-create first if none
- `createNewChat()` - Create new chat and refetch
- `logout()` - Clear state, remove token, redirect to login
- `setUser(user)` - Update user state
- `setChat(chats)` - Update chats state
- `setSelectedChat(chat)` - Set active chat
- `setTheme(theme)` - Toggle dark/light mode
- `setToken(token)` - Set JWT token

**Effects:**
1. Fetch user when token changes
2. Fetch chats when user logs in
3. Toggle dark mode class on document
4. Save theme to localStorage

---

## 📱 Frontend Components

### **1. Sidebar Component** (`client/src/components/Sidebar.jsx`)

**Props:**
- `isMenuOpen: Boolean`
- `setIsMenuOpen: Function`

**Features:**
- Logo display
- New Chat button
- Chat list with search
- Chat deletion with confirmation
- Dark mode toggle
- User account section
- Logout button
- Mobile menu close button

**State:**
- `search: String` - Filter chats

**Styling:**
- Tailwind CSS
- Dark mode support
- Responsive (md breakpoint)

---

### **2. ChatBox Component** (`client/src/components/ChatBox.jsx`)

**Features:**
- Message display area
- Auto-scroll to latest message
- Message input field
- Mode toggle (text/image)
- Send button
- Loading indicator
- Empty chat state

**State:**
- `messages: Message[]`
- `loading: Boolean`
- `prompt: String`
- `mode: 'text' | 'image'`

**Handlers:**
- `onSubmit()` - Send message to API
- `useEffect()` - Load chat messages

---

### **3. Message Component** (`client/src/components/Message.jsx`)

**Props:**
- `message: Message object`

**Displays:**
- User/Assistant role styling
- Text or image content
- Timestamp
- Source links (for web search)

---

### **4. Loading Component** (`client/src/pages/Loading.jsx`)

**Purpose:**
- Show loading spinner while checking auth
- Displayed while `loadingUser: true`

---

### **5. Login Page** (`client/src/pages/login.jsx`)

**Features:**
- Toggle between Login/Register
- Form validation
- Error handling
- Toast notifications
- JWT token storage
- Redirect to home on success

**Form Fields:**
- Register: name, email, password
- Login: email, password

---

## 🔌 HTTP Client Setup

### **Axios Configuration**

**Base URL:** `import.meta.env.VITE_SERVER_URL`
- Defaults to: `http://localhost:3000`

**Default Headers:**
```javascript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 📡 API Request/Response Patterns

### **Standard Response Format:**

**Success:**
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Success message"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔐 Authentication Flow

```
1. User enters email/password
   ↓
2. POST /api/user/register or /api/user/login
   ↓
3. Backend validates credentials
   ↓
4. Generate JWT token (expires in 30 days)
   ↓
5. Return token to frontend
   ↓
6. Store token in localStorage
   ↓
7. Set axios default Authorization header
   ↓
8. Fetch user data with token
   ↓
9. Update AppContext with user object
   ↓
10. Redirect to home page
```

---

## 🔄 Chat Lifecycle

```
1. User clicks "New Chat"
   ↓
2. POST /api/chat/create (auto-creates first chat on login)
   ↓
3. Chat document created in MongoDB
   ↓
4. Chat appears in Sidebar
   ↓
5. User selects chat → loads messages
   ↓
6. User types prompt and clicks Send
   ↓
7. POST /api/chat/text or /api/chat/image
   ↓
8. Server calls Gemini AI API
   ↓
9. AI response saved to messages array
   ↓
10. Response displayed in ChatBox
   ↓
11. Chat updatedAt timestamp updated
   ↓
12. Chat moves to top of list (sorted by updatedAt DESC)
```

---

## 📊 Message Lifecycle

```
User Input → ChatBox → API (/api/chat/text or /image)
    ↓
Server receives prompt
    ↓
Find Chat by ID and UserID
    ↓
Add user message to messages array
    ↓
Call Gemini API with message
    ↓
Get AI response
    ↓
Add AI message to messages array
    ↓
Save Chat document
    ↓
Send reply back to frontend
    ↓
Update ChatBox state
    ↓
Render messages
```

---

## 🌙 Theme System

**Storage:** `localStorage.theme`
**Classes:** `document.documentElement.classList`
**Values:** `'light'` | `'dark'`

**Tailwind Integration:**
```css
dark: /* Applied when theme === 'dark' */
```

---

## 📄 Assets & Constants

### **Assets File** (`client/src/assets/assets.js`)

**Contains:**
- Icon imports (menu, close, bin, logout, theme, etc.)
- Dummy user data (for reference)
- Dummy chat data (for development)
- Dummy plans (pricing tiers)

---

## 🔌 Environment Variables

### **Frontend** (`.env`)
```
VITE_SERVER_URL=http://localhost:3000
```

### **Backend** (`.env`)
```
PORT=3000
MONGODB_URI=mongodb+srv://karl:karlo2008@cluster0.pltfrpe.mongodb.net/learnify?retryWrites=true&w=majority
JWT_SECRET=learn_secret
GEMINI_API_KEY=<your-api-key>
```

---

## 📦 Dependencies

### **Backend**
- `express` - Server framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT generation/verification
- `bcryptjs` - Password hashing
- `openai` - Gemini API client (compatible)
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### **Frontend**
- `react` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-hot-toast` - Notifications
- `moment` - Timestamp formatting
- `tailwindcss` - Styling
- `vite` - Build tool

---

## 🚀 Module Usage Flow

```
┌─────────────────────┐
│   Login/Register    │
├─────────────────────┤
│ → POST /api/user/*  │
│ ← JWT Token         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  AppContext Setup   │
├─────────────────────┤
│ Store Token         │
│ Fetch User Data     │
│ Load Chats          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Chat Interface     │
├─────────────────────┤
│ Sidebar: Chat List  │
│ ChatBox: Messages   │
│ Input: Prompt       │
└──────────┬──────────┘
           │
           ├─→ POST /api/chat/text
           │   └→ Gemini AI Response
           │
           ├─→ POST /api/chat/image
           │   └→ Image Generation
           │
           └─→ POST /api/chat/delete
               └→ Remove Chat
```

---

## 🔄 Data Flow Summary

```
User Action (typing, clicking)
    ↓
React Component Handler
    ↓
AppContext Function Call
    ↓
Axios HTTP Request
    ↓
Express Route Handler
    ↓
Auth Middleware Check
    ↓
Controller Logic
    ↓
MongoDB Query/Update
    ↓
Response Sent to Frontend
    ↓
State Updated via AppContext
    ↓
Component Re-renders
    ↓
UI Updated with New Data
```

---

## 🎨 Styling System

**CSS Framework:** Tailwind CSS v4.1.17

**Color Scheme:**
- Primary: Purple (#7c3aed)
- Dark Mode: #000000, #242124
- Accent: Purple (#80609f)

**Responsive Design:**
- Mobile First
- `md:` breakpoint for tablet+
- `max-md:` for mobile-only styles

---

## 📝 Notes

### **Current Status:**
✅ User Authentication (Register, Login, Logout)
✅ Chat Management (Create, Read, Delete)
✅ AI Text Responses (Gemini 2.0 Flash)
✅ AI Image Generation (Gemini)
✅ Dark Mode Toggle
✅ Message Persistence
✅ User Data Isolation

### **Future Modules (Ready to Add):**
⏳ Notepad Module (Note creation, search, export)
⏳ Web Search Module (Real-time information retrieval)
⏳ Credits System (Usage tracking, pricing plans)
⏳ Chat History Export (PDF, JSON)
⏳ User Preferences (Language, Model selection)
⏳ Sharing Module (Share chats with users)
⏳ Analytics Dashboard (Usage statistics)

---

**Last Updated:** January 24, 2026
**System Version:** 1.0
**Author:** Learnify Development Team
