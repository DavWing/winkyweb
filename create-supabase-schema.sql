-- Create loans table in Supabase
CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Enable RLS (Row Level Security) - optional but recommended
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (change to your needs)
CREATE POLICY "Allow read access" ON loans
  FOR SELECT USING (true);

-- Create policy to allow insert access
CREATE POLICY "Allow insert" ON loans
  FOR INSERT WITH CHECK (true);

-- Create policy to allow update access
CREATE POLICY "Allow update" ON loans
  FOR UPDATE USING (true);

-- Create policy to allow delete access
CREATE POLICY "Allow delete" ON loans
  FOR DELETE USING (true);

-- Insert sample data (optional - can delete if you want to start fresh)
INSERT INTO loans (name, lender, category, amount, balance, apr, due_date, status) VALUES
  ('房屋貸款', '國泰世華銀行', '房貸', 1850, 248000, 6.2, '2026-07-01', 'paid'),
  ('中信信用卡', '中國信託', '信用卡', 420, 2180, 24.99, '2026-07-03', 'paid'),
  ('汽車貸款', '裕融企業', '車貸', 410, 9200, 5.4, '2026-07-06', 'unpaid'),
  ('個人信貸', '王道銀行', '個人信貸', 260, 6400, 11.9, '2026-07-15', 'unpaid'),
  ('台新信用卡', '台新銀行', '信用卡', 180, 1050, 22.49, '2026-07-20', 'unpaid'),
  ('學生貸款', '教育部就學貸款', '學生貸款', 310, 18300, 4.5, '2026-07-28', 'unpaid');
