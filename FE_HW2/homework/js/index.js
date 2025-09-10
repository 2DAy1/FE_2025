/* global window, document, fetch */
(function () {
  'use strict';

  const API = 'https://jsonplaceholder.typicode.com/users';

  const spinnerEl = document.getElementById('spinner');
  const listEl = document.getElementById('list');
  const reloadBtn = document.getElementById('reload');

  function showSpinner(isShown) {
    if (isShown) {
      spinnerEl.classList.add('show');
      spinnerEl.setAttribute('aria-hidden', 'false');
    } else {
      spinnerEl.classList.remove('show');
      spinnerEl.setAttribute('aria-hidden', 'true');
    }
  }

  function createCell(content) {
    const div = document.createElement('div');
    if (content instanceof Node) div.appendChild(content);
    else div.textContent = String(content);
    return div;
  }

  function userRow(user) {
    const row = document.createElement('div');
    row.className = 'row';

    const idCell = createCell(user.id);

    const nameInput = document.createElement('input');
    nameInput.className = 'inline';
    nameInput.value = user.name || '';

    const usernameInput = document.createElement('input');
    usernameInput.className = 'inline';
    usernameInput.value = user.username || '';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'inline';
    emailInput.value = user.email || '';

    const actions = document.createElement('div');
    actions.className = 'actions';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';

    actions.append(saveBtn, delBtn);

    row.append(
      idCell,
      createCell(nameInput),
      createCell(usernameInput),
      createCell(emailInput),
      createCell(actions)
    );

    saveBtn.addEventListener('click', async () => {
      const payload = {
        ...user,
        name: nameInput.value.trim(),
        username: usernameInput.value.trim(),
        email: emailInput.value.trim()
      };
      showSpinner(true);
      try {
        const res = await fetch(`${API}/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        await res.json();
      } catch (e) {
        console.error('PUT failed', e);
        alert('Failed to save user');
      } finally {
        showSpinner(false);
      }
    });

    delBtn.addEventListener('click', async () => {
      if (!window.confirm(`Delete user #${user.id}?`)) return;
      showSpinner(true);
      try {
        await fetch(`${API}/${user.id}`, { method: 'DELETE' });
        row.remove();
      } catch (e) {
        console.error('DELETE failed', e);
        alert('Failed to delete user');
      } finally {
        showSpinner(false);
      }
    });

    return row;
  }

  async function loadUsers() {
    showSpinner(true);
    try {
      const res = await fetch(API);
      const users = await res.json();
      listEl.textContent = '';
      users.forEach((u) => listEl.appendChild(userRow(u)));
    } catch (e) {
      console.error('GET failed', e);
      alert('Failed to load users');
    } finally {
      showSpinner(false);
    }
  }

  reloadBtn.addEventListener('click', loadUsers);
  loadUsers();
})();

// Your code goes here
