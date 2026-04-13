# Pune Vidyarthi Griha's College of Engineering & SS Dhamankar Institute of Management Chatbot - Troubleshooting Guide

## Issue: Textbox queries not working but tag buttons work

### **Root Cause Analysis:**
- **Tag buttons** use `/direct/{intent}` endpoint which works directly with predefined intents
- **Textbox queries** use `/query/{text}` endpoint which requires natural language processing

### **Quick Fix Steps:**

#### 1. **Start the Backend Server**
```bash
# Option 1: Start main backend (with ML)
cd backend
python main.py

# Option 2: Start simple backend (without ML dependencies)
cd backend
python simple_server.py

# Option 3: Use the startup script
python start_backend.py
```

#### 2. **Test Backend Connection**
```bash
# Test if backend is running
python test_backend.py

# Or manually test in browser:
# http://localhost:8000/health
# http://localhost:8000/direct/welcomegreeting
# http://localhost:8000/query/hello
```

#### 3. **Check Browser Console**
- Open browser Developer Tools (F12)
- Go to Console tab
- Type a message in chatbot
- Look for error messages or network failures

### **Common Issues & Solutions:**

#### **Issue 1: Backend Not Running**
**Symptoms:** Network errors, connection refused
**Solution:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### **Issue 2: CORS Errors**
**Symptoms:** CORS policy errors in browser console
**Solution:** Backend already configured for localhost:3000

#### **Issue 3: Missing Dependencies**
**Symptoms:** Import errors, module not found
**Solution:**
```bash
cd backend
pip install fastapi uvicorn autocorrect
```

#### **Issue 4: ML Interpreter Issues**
**Symptoms:** Query endpoint returns errors
**Solution:** Use simple server instead:
```bash
cd backend
python simple_server.py
```

### **Backend Endpoints:**

#### **Working Endpoints:**
- `GET /health` - Health check
- `GET /direct/{intent}` - Direct intent access (used by tag buttons)
- `GET /query/{text}` - Natural language query (used by textbox)

#### **Test URLs:**
- http://localhost:8000/health
- http://localhost:8000/direct/welcomegreeting
- http://localhost:8000/query/hello
- http://localhost:8000/query/about%20college

### **Frontend Debug Steps:**

#### **Enable Debug Logs:**
The frontend now includes console.log statements to help debug:
- Query being sent
- Response received
- Any errors

#### **Check Network Tab:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Type a message in chatbot
4. Check if request is sent and what response is received

### **Expected Behavior:**
1. User types "hello" in textbox
2. Frontend sends GET request to `/query/hello`
3. Backend processes query and returns response
4. Frontend displays response in chat

### **Current Status:**
✅ **Tag buttons working** - Direct intent access works
❌ **Textbox queries failing** - Query processing needs backend running

### **Quick Test:**
1. Start backend: `cd backend && python simple_server.py`
2. Open frontend: http://localhost:3000
3. Type "hello" in chatbot textbox
4. Should receive welcome message

### **If Still Not Working:**
1. Check if backend is running on port 8000
2. Check browser console for errors
3. Verify network requests in Developer Tools
4. Try using simple_server.py instead of main.py
5. Check if all dependencies are installed

### **Contact Support:**
If issues persist, provide:
- Browser console errors
- Network tab screenshots
- Backend terminal output
- Operating system and browser version