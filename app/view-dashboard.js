// The dashboard view: four money cards, an envelope table, a cash-flow chart
// and a short activity list. All figures come from the shared calc module.

import { money } from './calc.js';
import { dailyBalance, headline, linePoints, recentEntries, envelopeRows } from './calc.js';

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function card(label, value, detail, tone) {
  return `<article class="card card-${tone}">
  <span class="card-label">${escape(label)}</span>
  <strong class="card-value">${escape(value)}</strong>
  <span class="card-detail">${escape(detail)}</span>
</article>`;
}

function envelopeTable(rows) {
  const body = rows
    .map(
      (row) => `<tr>
  <th scope="row"><span class="dot" style="background:${row.color}"></span>${escape(row.label)}</th>
  <td>${money(row.planned)}</td>
  <td>${money(row.actual)}</td>
  <td class="${row.over ? 'negative' : ''}">${money(row.left)}</td>
  <td><div class="usage"><span style="width:${row.used}%;background:${row.color}"></span></div><small>${row.used}%</small></td>
</tr>`,
    )
    .join('');
  return `<table class="money-table">
  <thead><tr><th>Envelope</th><th>Planned</th><th>Spent</th><th>Left</th><th>Used</th></tr></thead>
  <tbody>${body}</tbody>
</table>`;
}

function cashChart(household, entries) {
  const points = dailyBalance(household, entries);
  const values = points.map((point) => point.balance);
  const line = linePoints(values, 640, 150);
  const last = points[points.length - 1];
  return `<div class="chart-wrap">
  <p class="chart-caption">Account balance after each day's spending, including transfers to savings.</p>
  <svg viewBox="0 0 640 160" role="img" aria-label="Cash balance across the month" class="cash-chart">
    <line x1="0" y1="155" x2="640" y2="155" class="axis" />
    <polyline points="${line}" fill="none" stroke="#2f7d78" stroke-width="3" stroke-linejoin="round" />
  </svg>
  <div class="chart-legend"><span>Day 1 balance ${money(household.takeHome)}</span><span>Day ${last.day} balance <strong>${money(last.balance)}</strong></span></div>
</div>`;
}

export function dashboard(household, envelopes, entries) {
  const totals = headline(household, envelopes, entries);
  const rows = envelopeRows(envelopes, entries);
  const latest = recentEntries(envelopes, entries, 6);
  const activity = latest
    .map(
      (item) => `<li><span class="day">${item.day} Nov</span><span>${escape(item.payee)}</span><span class="tag">${escape(item.label)}</span><strong>${money(item.amount)}</strong></li>`,
    )
    .join('');
  return `<section class="page" id="page-overview">
  <div class="page-head"><div><p class="eyebrow">${escape(household.month)}</p><h1>Money at a glance</h1>
  <p class="lede">${escape(household.name)} · take-home ${money(household.takeHome)} this month.</p></div>
  <a class="button" href="#/add">+ Add spending</a></div>
  <div class="cards">
    ${card('Take-home pay', money(totals.income), 'After tax, once this month', 'green')}
    ${card('Planned spend', money(totals.planned), `${money(totals.unplanned)} left unplanned`, 'blue')}
    ${card('Spent so far', money(totals.bills), 'Bills and everyday costs', 'clay')}
    ${card('Set aside', money(totals.saved), 'Towards your savings goals', 'gold')}
  </div>
  <div class="split">
    <div class="panel"><h2>Envelopes</h2><p class="hint">How each group is doing against its monthly plan.</p>${envelopeTable(rows)}</div>
    <div class="panel"><h2>Cash flow</h2><p class="hint">What stays in the account as the month goes on.</p>${cashChart(household, entries)}</div>
  </div>
  <div class="panel"><div class="panel-head"><h2>Recent activity</h2><a href="#/ledger">See every entry →</a></div>
  <ul class="activity">${activity}</ul></div>
</section>`;
}
