# Mileage Expense Tracker

A modern progressive web app (PWA) to track business mileage and expenses for tax deduction purposes.

## Features

- **📍 Mileage Logging**: Record trips with odometer readings, categorize as business or personal
- **💰 Expense Tracking**: Log gas, maintenance, and other vehicle expenses
- **📸 Receipt Upload**: Attach photos or PDFs of receipts for each expense
- **📊 Dashboard**: Real-time summaries including:
  - Total miles and business mile percentage
  - Expense breakdown by category
  - Cost per mile calculations
  - Deductible amount estimates
- **📋 Reports**: Generate CSV exports of all data for tax preparation
- **📱 Mobile Ready**: Installable on phones and tablets as a native app
- **⚡ Offline First**: Works completely offline, all data stored locally on your device

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Storage**: IndexedDB for offline-first data persistence
- **PWA**: Service Worker for offline support and mobile installation

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

3. Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: Traditional Hosting
Deploy the `dist/` folder to any static hosting provider (GitHub Pages, AWS S3, etc.)

## Mobile Installation

After deploying the app:

1. **iPhone/iPad**: 
   - Open the app in Safari
   - Tap Share → Add to Home Screen
   - Tap Add

2. **Android**: 
   - Open the app in Chrome
   - Tap the menu button ⋮
   - Tap "Install app" or "Add to Home screen"

## How to Use

### Logging Mileage
1. Go to "Mileage Log" tab
2. Enter the date, start/end odometer readings
3. Select trip type (Business or Personal)
4. Add purpose and notes (optional)
5. Click "Add Trip"

### Recording Expenses
1. Go to "Expenses" tab
2. Select the expense date and category
3. Enter the amount and optional details
4. Upload a receipt image/PDF (optional)
5. Click "Add Expense"

### Viewing Reports
1. Go to "Reports" tab
2. Filter by year
3. View tax deduction summary
4. Download CSV for your tax preparer

## Data & Privacy

- **All data is stored locally** on your device using IndexedDB
- No data is sent to any server
- Your data is completely private and secure
- You can export all data as CSV anytime

## Tax Deduction Calculation

The app calculates deductible expenses based on the business vs. personal mile ratio:

```
Deductible Expenses = Total Expenses × (Business Miles / Total Miles)
```

This gives you an accurate estimate of how much of your vehicle expenses can be deducted.

**Important**: Consult with your tax professional before filing. This app provides estimates for planning purposes.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+ (iOS 14+)

## Tips for Accurate Tax Records

1. **Log trips immediately** - The more accurate your logs, the better
2. **Upload receipts** - Attach photos or PDFs of your gas and maintenance receipts
3. **Be consistent** - Use the same vehicle consistently for tracking
4. **Keep backups** - Periodically export your data as CSV
5. **Consult a tax pro** - Your accountant can verify the calculations

## Support & Issues

For bugs or feature requests, please open an issue on GitHub.

## License

MIT - Feel free to use and modify for your business needs.

---

**Made for small business owners who need accurate mileage and expense tracking for tax purposes.**
