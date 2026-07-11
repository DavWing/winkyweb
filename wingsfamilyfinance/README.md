# Wings Family Finance - 貸款月曆

A modern loan and debt management calendar application for tracking your financial obligations.

## Features

- **Monthly Calendar View**: Visual representation of all loans organized by due date
- **Debt Tracking**: See total outstanding debt at a glance
- **Next Payment Alert**: Automatic highlighting of the next payment due
- **Loan Management**: Add, edit, and delete loans easily
- **Status Tracking**: Mark loans as paid, unpaid, or overdue
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multi-language**: Full Traditional Chinese (繁體中文) interface

## Loan Information Tracked

For each loan, you can store:
- Loan name
- Lender/Institution
- Category (e.g., Credit Card, Mortgage, Student Loan)
- Monthly payment amount
- Outstanding balance
- Annual Percentage Rate (APR)
- Due date
- Payment status

## Status Colors

- **Red** (#B5573F): Overdue payments
- **Gray** (#9C9C94): Unpaid/pending payments
- **Green** (#7C8B6F): Paid/completed payments

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/davwing/winkyweb.git
   cd winkyweb/wingsfamilyfinance
   ```

2. Start a local server:
   ```bash
   python -m http.server 3000
   # or
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Deployment on Netlify

1. Connect your GitHub repository to Netlify
2. Set the build directory to `wingsfamilyfinance`
3. Deploy!

The app will be available at your Netlify domain (e.g., `wingsfamilyfinance.netlify.app`)

## Usage

### Adding a Loan

1. Click on any date in the calendar
2. Fill in the loan details in the modal that appears
3. Click "新增貸款" (Add Loan) to save

### Managing Loans

- **Click a date**: View all loans due on that date
- **Toggle Status**: Mark a loan as paid or unpaid
- **Delete Loan**: Click the × button to remove a loan

### Navigation

- Use the arrow buttons to move between months
- Click "今天" (Today) to return to the current month

## Data Storage

All data is stored locally in your browser's memory. It will be cleared if you refresh the page or close the browser. To preserve your data:

1. Export your loans regularly (feature coming soon)
2. Or use cloud backup (feature coming soon)

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Font Credits

Uses [Google Fonts](https://fonts.google.com/):
- Noto Serif Traditional Chinese
- Noto Sans Traditional Chinese

## License

MIT License - Feel free to use this for personal or commercial projects.

## Support

For bug reports or feature requests, please visit the [GitHub repository](https://github.com/davwing/winkyweb).
