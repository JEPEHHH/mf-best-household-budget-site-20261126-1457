// The goals page and the small "how it works" page. Goal contributions are
// real controls: adding money changes the bar, the totals and the stored data.

import { goalProgress, money, round } from './calc.js';

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function goalsPage(goals) {
  const cards = goals
    .map((goal) => {
      const percent = goalProgress(goal);
      const remaining = round(Math.max(0, goal.target - goal.saved));
      return `<article class="goal-card">
    <div class="goal-head"><h3>${escape(goal.label)}</h3><span class="goal-percent">${percent}%</span></div>
    <div class="goal-bar"><span style="width:${percent}%;background:${goal.color}"></span></div>
    <dl class="goal-figures">
      <div><dt>Saved</dt><dd>${money(goal.saved)}</dd></div>
      <div><dt>Target</dt><dd>${money(goal.target)}</dd></div>
      <div><dt>To go</dt><dd>${money(remaining)}</dd></div>
      <div><dt>By</dt><dd>${escape(goal.deadline)}</dd></div>
    </dl>
    <form class="goal-form" data-goal="${escape(goal.id)}">
      <input name="amount" type="number" min="1" step="1" placeholder="Add $" aria-label="Add to ${escape(goal.label)}">
      <button class="pill-button" type="submit">Add</button>
    </form>
  </article>`;
    })
    .join('');
  const total = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const target = goals.reduce((sum, goal) => sum + goal.target, 0);
  return `<section class="page">
  <div class="page-head"><div><p class="eyebrow">Future plans</p><h1>Savings goals</h1>
  <p class="lede">${money(total)} saved of ${money(target)} across ${goals.length} goals. Every dollar you add here is tracked.</p></div></div>
  <div class="goal-grid">${cards}</div>
  <div class="tip"><strong>Why envelopes?</strong> Giving each dollar a job before the month starts makes it easier to see what is truly left to spend. Savings are an envelope too, not an afterthought.</div>
</section>`;
}

export function aboutPage(household) {
  return `<section class="page narrow">
  <p class="eyebrow">About</p><h1>How this budget works</h1>
  <p class="lede">${escape(household.name)} keeps one monthly plan and checks it a few times a week. This site is that plan, kept in plain files.</p>
  <ol class="how-list">
    <li><strong>Start with take-home pay.</strong> ${money(household.takeHome)} arrives once, and every envelope gets a share of it.</li>
    <li><strong>Record what leaves the account.</strong> The ledger page holds each purchase; the dashboard adds them up automatically.</li>
    <li><strong>Watch the envelopes.</strong> A bar near full means it is time to slow down in that group for the rest of the month.</li>
    <li><strong>Pay the bills on their days.</strong> The bills page separates fixed commitments from everyday spending.</li>
    <li><strong>Fund goals first.</strong> Savings is an envelope with its own progress bars, not whatever happens to be left.</li>
  </ol>
  <p class="hint">Your entries stay in this browser. Nothing is sent anywhere, and the site works offline.</p>
  <p><a href="#/">← Back to the overview</a></p>
</section>`;
}
