# Quick Testing Guide

## ✅ Test Checklist

### 1. Username Display
- [ ] Register a new account
- [ ] Login with credentials
- [ ] Verify "Hi, [Your Name]" appears on landing page
- [ ] Check localStorage for user data

### 2. Dashboard Updates
- [ ] Go to Dashboard
- [ ] Verify totals load from backend
- [ ] Add new income via "Add Income" button
- [ ] Verify Total Income updates instantly
- [ ] Verify Total Balance updates instantly
- [ ] Add new expense via "Add Expense" button
- [ ] Verify Total Expenses updates instantly
- [ ] Verify Total Balance updates again

### 3. Activity Tracking (Backend)
- [ ] Check database for `useractivities` collection
- [ ] Verify LOGIN entry exists with your user ID
- [ ] Verify ADD_INCOME entries exist
- [ ] Verify ADD_EXPENSE entries exist
- [ ] Check IP addresses are logged

### 4. API Endpoints
Test these endpoints with your JWT token:

```bash
# Dashboard Summary
GET http://localhost:5000/api/dashboard
Headers: Authorization: Bearer YOUR_JWT_TOKEN

# Activity History
GET http://localhost:5000/api/activity
Headers: Authorization: Bearer YOUR_JWT_TOKEN

# Activity Stats
GET http://localhost:5000/api/activity/stats
Headers: Authorization: Bearer YOUR_JWT_TOKEN

# User Profile
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Error Handling
- [ ] Try to access protected routes without token (should get 401)
- [ ] Try to access other user's data (should get 403)
- [ ] Add income with invalid data (should show error)
- [ ] Check error messages are user-friendly

### 6. Performance
- [ ] Dashboard loads quickly
- [ ] Adding income/expense is instant
- [ ] No lag on UI updates
- [ ] Database queries are fast

---

## 🐛 Troubleshooting

### Dashboard doesn't update
1. Check browser console for errors
2. Verify JWT token is valid
3. Check backend logs for API errors
4. Verify database connection

### Activity logging not working
1. Check `useractivities` collection exists in MongoDB
2. Verify backend has write permissions
3. Check server logs for errors

### Username not showing
1. Check localStorage for user data
2. Verify login was successful
3. Check JWT token is stored
4. Verify `/api/auth/me` returns user data

---

## 📊 Expected Results

### Dashboard API Response
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000,
    "totalExpense": 30000,
    "balance": 20000,
    "monthlyIncome": 5000,
    "monthlyExpense": 3000,
    "recentTransactions": [...],
    "incomeCount": 10,
    "expenseCount": 15
  }
}
```

### Activity Log Entry
```json
{
  "_id": "...",
  "userId": "...",
  "action": "ADD_INCOME",
  "details": {
    "amount": 5000,
    "source": "Salary",
    "date": "2024-01-15",
    "incomeId": "..."
  },
  "ipAddress": "127.0.0.1",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ✅ Success Criteria

- [x] Username displays on landing page
- [x] Dashboard shows correct totals
- [x] Adding income updates balance instantly
- [x] Adding expense updates balance instantly
- [x] All activities are logged to database
- [x] JWT authentication works
- [x] No console errors
- [x] UI is responsive

---

**Status:** Ready for Testing ✅

