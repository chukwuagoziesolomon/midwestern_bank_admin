# Login Debugging Guide

## Steps to Debug Login Issues

### 1. **Check Backend is Running**
```bash
# In your backend terminal, verify the server is running
python manage.py runserver
# Should show: Starting development server at http://127.0.0.1:8000/
```

### 2. **Check Environment Variable**
```bash
# In browser console, verify API URL is correct:
```
- Open browser DevTools (F12)
- Go to Console tab
- You should see: `🔌 API Base URL: http://localhost:8000/api`

### 3. **Test Backend API Directly**
```bash
# Test signup first
curl -X POST http://localhost:8000/api/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Expected response:
# {"message": "User created successfully", "password": "TestPass123"}

# Test login (before approval - should get 403)
curl -X POST http://localhost:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Expected response:
# {"error": "Your account is not yet approved. Please wait for admin approval."}
```

### 4. **Monitor Frontend Console**
- Open DevTools Console (F12)
- Enter login credentials
- You'll see detailed logs:
  - `🔐 Attempting login with: {email: "..."}`
  - `✅ Login response: {...}`
  - `🎉 Login successful, setting user and redirecting...`

### 5. **Common Issues & Solutions**

#### Issue: "Cannot POST /api/login/"
**Solution:** Backend is not running or API URL is wrong
- Verify backend is running: `python manage.py runserver`
- Check `.env` file has correct URL

#### Issue: "Network Error" or "Failed to fetch"
**Solution:** CORS issue or backend not responding
- Check backend CORS settings in Django
- Verify `http://localhost:3000` (or your frontend port) is allowed

#### Issue: "Account not approved"
**Solution:** This is expected! User hasn't been approved by admin yet
- You need to:
  1. Create an admin account first (or use existing admin)
  2. Admin logs in and approves the new user
  3. Then new user can login

#### Issue: "Invalid password" (401)
**Solution:** Wrong credentials
- Verify email and password are correct
- Check if user exists in backend

#### Issue: Login succeeds but doesn't redirect
**Solution:** `setUser` prop not being passed correctly
- Check React DevTools
- Verify App.jsx is passing `setUser` to Login component
- Check browser console for errors

### 6. **Check Network Requests**
- Open DevTools Network tab (F12 → Network)
- Try to login
- Click the `login/` POST request
- Check:
  - **Request headers:** Should have `Content-Type: application/json`
  - **Request payload:** Email and password
  - **Response status:** Should be 200 for success, 403 for not approved
  - **Response body:** Should contain user data or error message

### 7. **Check Local Storage**
- Open DevTools Console
- Type: `localStorage.getItem('user')`
- Should return user data if login was successful

### 8. **Verify Authentication Flow**
```
User enters email + password
         ↓
Click Login button
         ↓
API call: POST /api/login/
         ↓
Backend checks:
  - User exists? (404 if not)
  - Password correct? (401 if not)
  - Is approved? (403 if not)
         ↓
Response 200 + user data
         ↓
Frontend sets user state
         ↓
Saves to localStorage
         ↓
Navigates to /dashboard
```

### 9. **Test with Admin User**
Make sure you're testing with an approved user:
```bash
# Create a user and approve from backend
python manage.py shell

from accounts.models import User
user = User.objects.create_user(
    email='admin@test.com',
    first_name='Admin',
    last_name='User',
    password='AdminPass123'
)
user.account.is_approved = True
user.account.save()
```

### 10. **Enable Debug Mode**
Add this to your component for more logging:
```javascript
// In Login.jsx handleSubmit
console.log('Full error:', err);
console.log('Response data:', err.response?.data);
console.log('Status code:', err.response?.status);
```

## Quick Checklist

- [ ] Backend running on `http://localhost:8000`
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] Browser console shows correct API URL
- [ ] Test user exists in database
- [ ] Test user is approved (`is_approved = True`)
- [ ] Browser DevTools shows successful 200 response
- [ ] User data appears in localStorage
- [ ] Redirect to /dashboard happens

## Contact Backend Logs

If still not working, check your backend logs:
```bash
# Terminal where Django is running
# Look for POST /api/login/ request
# Any error messages will be printed there
```
