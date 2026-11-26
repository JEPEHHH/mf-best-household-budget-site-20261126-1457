// Views for the ledger, the add-entry form and the bills register. The form
// is a real form: submitting it writes to storage and re-renders the page.

import { billSummary, money, round } from './calc.js';

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function ledgerPage(envelopes, entries) {
  const labels = Object.fromEntries(envelopes.map((item) => [item.id, item.label]));
  const sorted = [...entries].sort((a, b) => b.day - a.day);
  const rows = sorted
    .map(
      (item) => `<tr>
  <td>${item.day} Nov</td>
  <td>${escape(item.payee)}</td>
  <td><span class="tag">${escape(labels[item.category] || item.category)}</span></td>
  <td class="amount">${money(item.amount)}</td>
  <td><button class="link-button" data-delete="${escape(item.id)}" type="button">Remove</button></td>
</tr>`,
    )
    .join('');
  const total = round(entries.reduce((sum, item) => sum + item.amount, 0));
  return `<section class="page">
  <div class="page-head"><div><p class="eyebrow">Everyday money</p><h1>Transaction ledger</h1>
  <p class="lede">${sorted.length} entries this month · ${money(total)} recorded.</p></div>
  <a class="button" href="#/add">+ Add spending</a></div>
  <div class="panel"><table class="money-table ledger-table">
  <thead><tr><th>Date</th><th>Payee</th><th>Envelope</th><th>Amount</th><th></th></tr></thead>
  <tbody>${rows}</tbody></table></div>
</section>`;
}

export function addPage(envelopes) {
  const options = envelopes
    .map((item) => `<option value="${escape(item.id)}">${escape(item.label)} — planned ${money(item.planned)}</option>`)
    .join('');
  return `<section class="page narrow">
  <p class="eyebrow">Everyday money</p><h1>Add spending</h1>
  <p class="lede">Log a purchase and the dashboard, envelopes and cash flow all update together. Saved in this browser only.</p>
  <form id="entry-form" class="form-card">
    <label>Payee<input name="payee" type="text" placeholder="e.g. Corner Market" required maxlength="60"></label>
    <label>Amount (USD)<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
    <label>Envelope<select name="category">${options}</select></label>
    <label>Day of month<input name="day" type="number" min="1" max="30" value="24" required></label>
    <button class="button" type="submit">Save entry</button>
    <p class="form-note" id="form-note">Nothing leaves this device.</p>
  </form>
  <p><a href="#/ledger">← Back to the ledger</a></p>
</section>`;
}

export function billsPage(bills, envelopes) {
  const summary = billSummary(bills);
  const labels = Object.fromEntries(envelopes.map((item) => [item.id, item.label]));
  const rows = bills
    .map(
      (bill) => `<tr class="${bill.paid ? 'paid-row' : ''}">
  <td><strong>${escape(bill.label)}</strong></td>
  <td>${escape(labels[bill.category] || bill.category)}</td>
  <td>Day ${bill.dueDay}</td>
  <td class="amount">${money(bill.amount)}</td>
  <td><button class="pill-button ${bill.paid ? 'is-paid' : ''}" data-bill="${escape(bill.id)}" type="button">${bill.paid ? 'Paid' : 'Mark paid'}</button></td>
</tr>`,
    )
    .join('');
  return `<section class="page">
  <div class="page-head"><div><p class="eyebrow">Monthly commitments</p><h1>Bills & due dates</h1>
  <p class="lede">${summary.count} still to pay · ${money(summary.upcoming)} due before month end.</p></div></div>
  <div class="cards three">
    <article class="card card-blue"><span class="card-label">All bills</span><strong class="card-value">${money(summary.total)}</strong><span class="card-detail">${bills.length} recurring items</span></article>
    <article class="card card-green"><span class="card-label">Paid</span><strong class="card-value">${money(summary.paid)}</strong><span class="card-detail">Already covered</span></article>
    <article class="card card-clay"><span class="card-label">Still due</span><strong class="card-value">${money(summary.upcoming)}</strong><span class="card-detail">${summary.count} payments to go</span></article>
  </div>
  <div class="panel"><table class="money-table">
  <thead><tr><th>Bill</th><th>Envelope</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead>
  <tbody>${rows}</tbody></table></div>
</section>`;
}
