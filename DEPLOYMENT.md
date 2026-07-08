# Winkyweb - Loan Calendar Deployment

## 🚀 Project Overview

This is a loan calendar web application built with vanilla JavaScript and Vite, deployed on Netlify with Supabase for backend storage.

## 📦 Services Setup

### Supabase Project
- **Project Name**: winkyweb-loan-calendar
- **Project ID**: nrltzseaaqoxzzsydxbl
- **Region**: Asia Pacific (Singapore)
- **Organization**: spontanus31-del's Org
- **Status**: ACTIVE_HEALTHY

**Features Available**:
- PostgreSQL Database
- Real-time subscriptions
- RESTful API
- Authentication
- Storage

### Netlify Project
- **Project Name**: winkyweb-loan-calendar
- **Site ID**: 1dcf385e-2fea-409a-b4e9-46b63059e5d3
- **Live URL**: https://winkyweb-loan-calendar.netlify.app
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:3000` with hot module reloading.

## 📋 Application Features

### Loan Calendar
- **Interactive Monthly Calendar**: Navigate between months to view loan payment schedules
- **At-a-Glance Summary**:
  - Total outstanding debt across all loans
  - Next payment due information with color-coded status
- **Color-Coded Status**:
  - 🔴 Red (#B5573F): Overdue payments
  - 🟡 Gray (#9C9C94): Pending payments
  - 🟢 Green (#7C8B6F): Paid
- **Detailed Loan Modal**: Click any date with loans to see:
  - Loan name and category
  - Payment amount due
  - Outstanding balance
  - Interest rate (APR)
  - Lending institution
  - Payment status

### Sample Data
The app comes with sample loans for demonstration:
1. 房屋貸款 (Home Loan) - Cathay United Bank
2. 中信信用卡 (Credit Card) - Chinatrust
3. 汽車貸款 (Auto Loan) - RoseLoan
4. 個人信貸 (Personal Loan) - King's Bank
5. 台新信用卡 (Credit Card) - Taishin Bank
6. 學生貸款 (Student Loan) - Ministry of Education

## 🔐 Environment Variables

To connect to Supabase, set these environment variables in Netlify:

```
VITE_SUPABASE_URL=https://nrltzseaaqoxzzsydxbl.supabase.co
VITE_SUPABASE_KEY=<your-anon-key>
```

Get your Supabase API keys from:
1. Go to Supabase Dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon (public) key

## 📊 Database Schema (Ready for Implementation)

Create these tables in Supabase to persist loan data:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans table
CREATE TABLE loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  lender VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  balance NUMERIC(10, 2) NOT NULL,
  apr NUMERIC(5, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Deployment Process

### Automatic Deployment
1. Push to the `claude/webpage-supabase-netlify-deploy-vkgk9l` branch
2. Netlify automatically builds and deploys
3. View deployment status at: https://app.netlify.com/projects/winkyweb-loan-calendar

### Manual Deployment
1. Build locally: `npm run build`
2. Deploy to Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

## 📱 Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: Netlify
- **Fonts**: Google Fonts (Noto Sans TC, Noto Serif TC)

## 🎨 Design Highlights
- Traditional Chinese (Traditional) UI
- Responsive design (mobile-first)
- Modern minimalist aesthetic
- Accessibility-focused color contrast
- Smooth transitions and interactions

## 🐛 Troubleshooting

### Build fails with "terser not found"
```bash
npm install --save-dev terser
npm run build
```

### Netlify deployment not triggering
- Ensure netlify.toml is in repo root
- Check build command matches: `npm run build`
- Verify publish directory is: `dist`

### Supabase connection issues
- Verify environment variables are set in Netlify
- Check Supabase project status is ACTIVE_HEALTHY
- Ensure API key has correct permissions

## 📞 Support
For issues or feature requests, please create an issue on GitHub.

## 📄 License
ISC
