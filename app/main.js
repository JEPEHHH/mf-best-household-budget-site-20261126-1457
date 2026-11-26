// Hearth's router. One hash route per page, shared data in the browser's
// storage, and every control re-renders from the same source of truth.

import { household, envelopes, ledger, bills, goals } from './data.js';
import { dashboard } from './view-dashboard.js';
import { ledgerPage, addPage, billsPage } from './view-ledger.js';
import { goalsPage, aboutPage } from './view-goals.js';

const KEY = 'hearth-budget-v1';

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return {
      entries: Array.isArray(saved.entries) ? saved.entries : ledger,
      bills: Array.isArray(saved.bills) ? saved.bills : bills,
      goals: Array.isArray(saved.goals) ? saved.goals : goals,
    };
  } catch {
    return { entries: ledger, bills, goals };
  }
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
}

function withIds(entries) {
  return entries.map((item, index) => ({ id: item.id || `seed-${index}`, ...item }));
}

const state = load();
state.entries = withIds(state.entries);
const content = document.getElementById('content');

// Event delegation: one listener per kind of control, bound once on the page.
content.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.id === 'entry-form') {
    event.preventDefault();
    const values = new FormData(form);
    state.entries.push({
      id: `new-${Date.now()}`,
      day: Number(values.get('day')),
      category: values.get('category'),
      payee: String(values.get('payee')).trim(),
      amount: Math.round(Number(values.get('amount')) * 100) / 100,
    });
    save(state);
    form.reset();
    document.getElementById('form-note').textContent = 'Saved. It is now in the ledger and the dashboard.';
    render();
  }
  if (form.classList.contains('goal-form')) {
    event.preventDefault();
    const id = form.dataset.goal;
    const amount = Number(new FormData(form).get('amount'));
    const goal = state.goals.find((item) => item.id === id);
    if (goal && amount > 0) {
      goal.saved += amount;
      save(state);
      render();
    }
  }
});

content.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.delete) {
    state.entries = state.entries.filter((item) => item.id !== button.dataset.delete);
    save(state);
    render();
  }
  if (button.dataset.bill) {
    const bill = state.bills.find((item) => item.id === button.dataset.bill);
    if (bill) { bill.paid = !bill.paid; save(state); render(); }
  }
});

document.getElementById('menu-toggle').addEventListener('click', (event) => {
  const nav = document.getElementById('nav');
  const open = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

const pages = {
  ledger: () => ledgerPage(envelopes, state.entries),
  add: () => addPage(envelopes),
  bills: () => billsPage(state.bills, envelopes),
  goals: () => goalsPage(state.goals),
  about: () => aboutPage(household),
};

function route() {
  const path = location.hash.replace(/^#\/?/, '').split('?')[0];
  const build = pages[path] || (() => dashboard(household, envelopes, state.entries));
  return build();
}

function render() {
  window.__shotReady = false;
  content.innerHTML = route();
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const target = link.getAttribute('href').replace(/^#\/?/, '') || '';
    const current = location.hash.replace(/^#\/?/, '').split('?')[0] || '';
    link.classList.toggle('active', target === current);
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
