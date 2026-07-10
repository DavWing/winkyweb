# 🔌 Supabase Integration Setup

Your app is now **fully integrated with Supabase** for data persistence!

## ✅ What's Set Up

✅ **Database Created**
- `loans` table with schema
- Sample data pre-loaded (6 loans)
- RLS policies for read/write access

✅ **App Features**
- View loans from Supabase database
- **Edit** loan details (name, amount, rate, due date, status)
- **Delete** loans
- Data persists in database
- Falls back to sample data if Supabase not configured

## 🔐 Setup in Netlify (2 Steps)

### Step 1: Get Supabase API Keys

1. Go to: https://supabase.com/dashboard
2. Select project: **winkyweb-loan-calendar**
3. Go to: **Settings → API**
4. Copy these values:
   - **Project URL** (like `https://nrltzseaaqoxzzsydxbl.supabase.co`)
   - **Anon Key** (the public key)

### Step 2: Add to Netlify Environment

1. Go to your Netlify site: https://app.netlify.com/sites/winkyloan
2. Go to: **Site settings → Build & deploy → Environment**
3. Click: **Add environment variables**
4. Add these two variables:

   ```
   VITE_SUPABASE_URL = https://nrltzseaaqoxzzsydxbl.supabase.co
   VITE_SUPABASE_KEY = [paste-your-anon-key-here]
   ```

5. **Save** - Netlify will auto-rebuild

### Step 3: Re-upload New Zip

1. Download: `winkyweb-supabase.zip`
2. Upload to Netlify (drag & drop or manual upload)
3. **Done!** 🎉

---

## 🎯 How It Works

**With Environment Variables Set:**
- ✅ App loads loans from Supabase database
- ✅ Edit/Delete buttons work and save to database
- ✅ Data syncs across all users
- ✅ Persistent storage

**Without Environment Variables:**
- ✅ App shows sample data
- ✅ Edit/Delete works locally (not saved)
- ✅ Data resets on page refresh

---

## 🧑‍💻 Edit & Delete Features

### Edit Loan
1. Click a date with loans
2. Click **編輯** (Edit) button
3. Modify any field
4. Click **保存** (Save)
5. Changes saved to database

### Delete Loan
1. Click a date with loans
2. Click **刪除** (Delete) button
3. Confirm deletion
4. Loan removed from database

### Add New Loan
Currently, the UI loads existing loans. To add new loans:

**Option 1:** Use Supabase dashboard
- Go to: https://supabase.com/dashboard
- Select your project
- Go to: **SQL Editor**
- Run:
  ```sql
  INSERT INTO loans (name, lender, category, amount, balance, apr, due_date, status)
  VALUES ('Loan Name', 'Lender', 'Category', 500, 5000, 5.5, '2026-08-15', 'unpaid');
  ```

**Option 2:** I can add "Add Loan" UI button (request feature)

---

## 📊 Database Details

**Table:** `loans`

| Column | Type | Example |
|--------|------|---------|
| id | UUID | auto-generated |
| name | VARCHAR | 房屋貸款 |
| lender | VARCHAR | 國泰世華銀行 |
| category | VARCHAR | 房貸 |
| amount | NUMERIC(10,2) | 1850.00 |
| balance | NUMERIC(10,2) | 248000.00 |
| apr | NUMERIC(5,2) | 6.20 |
| due_date | DATE | 2026-07-01 |
| status | VARCHAR | paid / unpaid |
| created_at | TIMESTAMP | auto |
| updated_at | TIMESTAMP | auto |

---

## ✅ Verification

After setting env vars and re-uploading:

1. **Open your site**: https://winkyloan.netlify.app
2. **Check browser console** (F12 → Console)
   - Should show no errors
   - Should show Supabase client connected
3. **Try editing a loan**
   - Click a date with loans
   - Click Edit
   - Change something
   - Click Save
   - Refresh page - changes should persist
4. **Try deleting** (if needed)

---

## 🆘 Troubleshooting

### "Supabase not configured"
- Check env vars are set in Netlify
- Verify spelling: `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`
- Rebuild/redeploy after adding vars

### Edit/Delete doesn't save
- Check browser console for errors
- Verify Supabase API key is correct (anon key, not service key)
- Check RLS policies are enabled
- Try in private/incognito mode

### No loans showing
- Check database table has data:
  - Go to Supabase dashboard
  - Select project
  - Go to SQL Editor
  - Run: `SELECT * FROM loans;`
- Refresh page

### "Cannot find module '@supabase/supabase-js'"
- This is CDN-loaded, should work automatically
- Check network tab for failed imports
- Try clearing cache and hard refresh (Ctrl+Shift+R)

---

## 🚀 Next Steps

Your loan calendar now has:
- ✅ Full data persistence
- ✅ Edit functionality
- ✅ Delete functionality
- ✅ Real-time database sync

**Optional Enhancements:**
- Add payment tracking
- Add payment history
- Add loan categories filter
- Add monthly breakdown
- Export to CSV

Let me know if you need anything else! 📚

---

## Project Details

- **Supabase Project ID:** nrltzseaaqoxzzsydxbl
- **Supabase Dashboard:** https://supabase.com/dashboard/project/nrltzseaaqoxzzsydxbl
- **Netlify Site:** https://app.netlify.com/sites/winkyloan
- **Database Table:** loans
- **Status:** ✅ Ready to use
