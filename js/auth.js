/* EthicsCodex: demo login. Accounts and scores are stored in this browser's localStorage (NOT real security). */
const Auth = (() => {
  const U = 'ec_users', S = 'ec_session';
  const rd = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const hash = async s => {
    if (window.crypto && crypto.subtle) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
    return btoa(unescape(encodeURIComponent(s))).split('').reverse().join('');
  };
  const changed = () => document.dispatchEvent(new Event('authchange'));
  const me = () => { const u = rd(S, null); return u ? { user: u, name: (rd(U, {})[u] || {}).name || u } : null; };
  async function register(name, user, pass) {
    user = user.trim().toLowerCase(); const all = rd(U, {});
    if (name.trim().length < 2) return 'Enter your full name.';
    if (!/^[a-z0-9_]{3,20}$/.test(user)) return 'Username: 3 to 20 letters, numbers, or underscore.';
    if (pass.length < 6) return 'Password must be at least 6 characters.';
    if (all[user]) return 'That username is taken. Choose another.';
    all[user] = { name: name.trim(), h: await hash(pass) }; wr(U, all); wr(S, user); changed(); return '';
  }
  async function login(user, pass) {
    user = user.trim().toLowerCase(); const u = rd(U, {})[user];
    if (!u || u.h !== await hash(pass)) return 'Wrong username or password.';
    wr(S, user); changed(); return '';
  }
  const logout = () => { try { localStorage.removeItem(S); } catch (e) {} changed(); };
  const scores = () => { const m = me(); return m ? rd('ec_scores_' + m.user, []) : []; };
  const save = e => { const m = me(); if (m) wr('ec_scores_' + m.user, [...scores(), e].slice(-20)); };
  return { me, register, login, logout, scores, save };
})();

document.body.insertAdjacentHTML('beforeend', `<dialog id="authDlg" aria-labelledby="authTitle"><form id="authForm"><h3 id="authTitle">Welcome to EthicsCodex</h3>
<div class="tabs"><button type="button" data-m="login" aria-selected="true">Log in</button><button type="button" data-m="register" aria-selected="false">Create account</button></div>
<label id="nameRow" hidden>Full name<input id="aName" autocomplete="name"></label>
<label>Username<input id="aUser" required autocomplete="username"></label>
<label>Password<input id="aPass" type="password" required autocomplete="current-password"></label>
<p id="authMsg" role="alert"></p><button class="btn" id="authGo">Log in</button><button type="button" class="btn ghost" id="authX">Cancel</button>
<p class="note">Demo only: accounts are saved in this browser, not on a server.</p></form></dialog>`);
let mode = 'login';
const setMode = m => { mode = m; $$('#authDlg .tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.m === m)); $('nameRow').hidden = m !== 'register'; $('authGo').textContent = m === 'login' ? 'Log in' : 'Create account'; $('authMsg').textContent = ''; };
$$('#authDlg .tabs button').forEach(b => b.onclick = () => setMode(b.dataset.m));
function openAuth(m = 'login') { setMode(m); $('authDlg').showModal(); $('aUser').focus(); }
$('authX').onclick = () => $('authDlg').close();
$('authForm').onsubmit = async e => {
  e.preventDefault();
  const err = mode === 'login' ? await Auth.login($('aUser').value, $('aPass').value) : await Auth.register($('aName').value, $('aUser').value, $('aPass').value);
  if (err) { $('authMsg').textContent = err; return; }
  $('authDlg').close(); $('authForm').reset();
};
$('menu').insertAdjacentHTML('beforeend', '<button class="theme" id="authBtn"></button>');
const paintAuth = () => { const m = Auth.me(); $('authBtn').textContent = m ? `Hi, ${m.name.split(' ')[0]} (Log out)` : 'Log in'; };
$('authBtn').onclick = () => Auth.me() ? Auth.logout() : openAuth();
document.addEventListener('authchange', paintAuth); paintAuth();