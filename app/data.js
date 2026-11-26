// Starter figures for the household. The numbers are realistic monthly amounts
// for a family of four; the ledger below holds the individual transactions.
// Nothing here is fetched - the whole budget lives in this file and in the
// browser's own storage, so the site works with the network switched off.

export const household = {
  name: 'The Rivera household',
  month: 'November 2026',
  takeHome: 6400,
  currency: 'USD',
};

// Envelope budgets: what the family plans to spend in each group this month.
export const envelopes = [
  { id: 'housing', label: 'Housing', planned: 1900, color: '#3f6f63', note: 'Rent, power, water and internet' },
  { id: 'groceries', label: 'Groceries', planned: 780, color: '#b8653d', note: 'Food and household supplies' },
  { id: 'transport', label: 'Transport', planned: 410, color: '#48689c', note: 'Fuel, bus passes and parking' },
  { id: 'kids', label: 'Kids', planned: 360, color: '#8a5a86', note: 'Activities, school and clothes' },
  { id: 'health', label: 'Health', planned: 280, color: '#577d3f', note: 'Pharmacy and copays' },
  { id: 'fun', label: 'Fun & eating out', planned: 300, color: '#b58a2c', note: 'Restaurants, cinema and treats' },
  { id: 'savings', label: 'Savings', planned: 1200, color: '#2f7d78', note: 'Emergency fund and next-year goals' },
];

// Each entry: day, envelope id, payee, amount (positive = money out).
// Savings entries count as money set aside, not as a bill.
export const ledger = [
  { day: 1, category: 'housing', payee: 'November rent', amount: 1650 },
  { day: 2, category: 'savings', payee: 'Emergency fund transfer', amount: 700 },
  { day: 2, category: 'groceries', payee: 'Corner Market weekly shop', amount: 138.42 },
  { day: 3, category: 'transport', payee: 'Train season tickets', amount: 156 },
  { day: 4, category: 'kids', payee: 'Swimming lessons', amount: 96 },
  { day: 5, category: 'groceries', payee: 'Fruit and vegetables', amount: 62.18 },
  { day: 6, category: 'fun', payee: 'Saturday pizza night', amount: 48.6 },
  { day: 8, category: 'health', payee: 'Pharmacy prescriptions', amount: 54.3 },
  { day: 9, category: 'groceries', payee: 'Corner Market weekly shop', amount: 151.75 },
  { day: 10, category: 'housing', payee: 'Electricity bill', amount: 118.4 },
  { day: 11, category: 'transport', payee: 'Fuel top-up', amount: 64.2 },
  { day: 12, category: 'fun', payee: 'Cinema tickets', amount: 42 },
  { day: 13, category: 'groceries', payee: 'School lunch supplies', amount: 79.9 },
  { day: 14, category: 'kids', payee: 'School trip contribution', amount: 45 },
  { day: 15, category: 'housing', payee: 'Water and council', amount: 91.6 },
  { day: 16, category: 'savings', payee: 'Holiday fund', amount: 300 },
  { day: 17, category: 'groceries', payee: 'Corner Market weekly shop', amount: 129.34 },
  { day: 18, category: 'health', payee: 'Dentist copay', amount: 85 },
  { day: 19, category: 'transport', payee: 'Parking permits', amount: 72 },
  { day: 20, category: 'fun', payee: 'Takeaway dinner', amount: 38.8 },
  { day: 21, category: 'groceries', payee: 'Bulk store restock', amount: 96.5 },
  { day: 22, category: 'housing', payee: 'Internet and mobile', amount: 74 },
  { day: 23, category: 'kids', payee: 'Football boots', amount: 68 },
  { day: 24, category: 'fun', payee: 'Board game night', amount: 24 },
];

// A small recurring-bill register with due days, used by the Bills page.
export const bills = [
  { id: 'rent', label: 'Rent', amount: 1650, dueDay: 1, category: 'housing', paid: true },
  { id: 'electric', label: 'Electricity', amount: 118.4, dueDay: 10, category: 'housing', paid: true },
  { id: 'water', label: 'Water & council', amount: 91.6, dueDay: 15, category: 'housing', paid: true },
  { id: 'internet', label: 'Internet & phones', amount: 74, dueDay: 22, category: 'housing', paid: true },
  { id: 'train', label: 'Train passes', amount: 156, dueDay: 3, category: 'transport', paid: true },
  { id: 'insurance', label: 'Home insurance', amount: 62, dueDay: 27, category: 'housing', paid: false },
  { id: 'music', label: 'Music lessons', amount: 110, dueDay: 28, category: 'kids', paid: false },
];

// Goals for the goals page: saved so far against a target, with a deadline.
export const goals = [
  { id: 'fund', label: 'Emergency fund', saved: 4850, target: 6000, deadline: 'June 2027', color: '#2f7d78' },
  { id: 'holiday', label: 'Summer trip', saved: 1240, target: 2500, deadline: 'July 2027', color: '#b8653d' },
  { id: 'car', label: 'Car replacement', saved: 2100, target: 8000, deadline: 'December 2028', color: '#48689c' },
];
