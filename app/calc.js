// Money maths for the budget. Every page calls these functions, so the numbers
// on screen always agree with each other. All amounts are in whole dollars and
// cents; formatting happens in the view layer.

export function money(value) {
  const sign = value < 0 ? '-' : '';
  const rounded = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}$${rounded}`;
}

export function round(value) {
  return Math.round(value * 100) / 100;
}

// Sum of a ledger, optionally restricted to one envelope.
export function spent(entries, category) {
  return round(
    entries
      .filter((item) => (category ? item.category === category : true))
      .reduce((sum, item) => sum + item.amount, 0),
  );
}

// One row per envelope with its plan, actual spend and remaining room.
export function envelopeRows(envelopes, entries) {
  return envelopes.map((envelope) => {
    const actual = spent(entries, envelope.id);
    const left = round(envelope.planned - actual);
    const used = envelope.planned > 0 ? Math.min(100, Math.round((actual / envelope.planned) * 100)) : 0;
    return { ...envelope, actual, left, used, over: left < 0 };
  });
}

// Totals used in the dashboard's four summary cards.
export function headline(household, envelopes, entries) {
  const rows = envelopeRows(envelopes, entries);
  const totalPlanned = round(envelopes.reduce((sum, item) => sum + item.planned, 0));
  const totalSpent = round(rows.reduce((sum, row) => sum + row.actual, 0));
  const saved = spent(entries, 'savings');
  const bills = round(totalSpent - saved);
  return {
    income: household.takeHome,
    planned: totalPlanned,
    spent: totalSpent,
    bills,
    saved,
    leftToSpend: round(household.takeHome - totalSpent),
    unplanned: round(household.takeHome - totalPlanned),
  };
}

// Running balance by day, for the cash-flow line chart.
export function dailyBalance(household, entries, days = 30) {
  const daily = Array.from({ length: days }, (_, index) => ({ day: index + 1, out: 0 }));
  entries.forEach((item) => {
    if (item.day >= 1 && item.day <= days) daily[item.day - 1].out += item.amount;
  });
  let balance = household.takeHome;
  return daily.map((point, index) => {
    balance = round(balance - point.out);
    return { day: point.day, balance: round(balance), out: round(point.out) };
  });
}

// Recent entries, newest first, with the envelope label attached.
export function recentEntries(envelopes, entries, limit = 8) {
  const labels = Object.fromEntries(envelopes.map((item) => [item.id, item.label]));
  return [...entries]
    .sort((a, b) => b.day - a.day)
    .slice(0, limit)
    .map((item) => ({ ...item, label: labels[item.category] || item.category }));
}

// Bills due comparison used on the Bills page.
export function billSummary(bills) {
  const due = bills.filter((bill) => !bill.paid);
  return {
    total: round(bills.reduce((sum, bill) => sum + bill.amount, 0)),
    paid: round(bills.filter((bill) => bill.paid).reduce((sum, bill) => sum + bill.amount, 0)),
    upcoming: round(due.reduce((sum, bill) => sum + bill.amount, 0)),
    count: due.length,
  };
}

// Progress percentage for a savings goal, capped at 100 for the bar width.
export function goalProgress(goal) {
  return Math.min(100, Math.round((goal.saved / goal.target) * 100));
}

// A deterministic polyline for the balance chart, fitted into a viewBox.
export function linePoints(values, width, height) {
  if (!values.length) return '';
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / span) * height;
      return `${round(x)},${round(y)}`;
    })
    .join(' ');
}
