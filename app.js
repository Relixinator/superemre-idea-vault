// SuperEmre Idea Vault — 100% lokaal
(function(){
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const state = {
    ideas: [],
    selectedId: null,
    deferredPrompt: null
  };

  const LS_KEY = 'superemre_idea_vault_v1';

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Load error', e);
      return [];
    }
  }

  function save() {
    localStorage.setItem(LS_KEY, JSON.stringify(state.ideas));
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

  function formatDate(ts){
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function renderList() {
    const ul = $('#idea-list');
    ul.innerHTML = '';

    const term = $('#search').value.trim().toLowerCase();
    const fStatus = $('#filter-status').value;
    const fPrio = $('#filter-priority').value;

    const filtered = state.ideas.filter(it => {
      if (fStatus && it.status !== fStatus) return false;
      if (fPrio && it.priority !== fPrio) return false;
      if (!term) return true;
      const hay = [
        it.title, it.description, it.category, it.next_action, it.priority, it.status,
        (it.tags || []).join(' '),
        (it.logs || []).map(l => l.text).join(' ')
      ].join(' ').toLowerCase();
      return hay.includes(term);
    }).sort((a,b)=> (b.updated_at||b.created_at) - (a.updated_at||a.created_at));

    for (const it of filtered) {
      const li = document.createElement('li');
      li.dataset.id = it.id;
      li.className = (it.id === state.selectedId) ? 'active' : '';

      const title = document.createElement('div');
      title.textContent = it.title;
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `
        <span class="chip">${it.status}</span>
        <span class="chip">${it.priority}</span>
        ${it.due ? `<span class="chip">DL ${it.due}</span>` : ''}
        ${(it.tags||[]).slice(0,3).map(t=>`<span class="chip">#${t}</span>`).join('')}
      `;
      li.appendChild(title);
      li.appendChild(meta);
      li.addEventListener('click', () => select(it.id));
      ul.appendChild(li);
    }
  }

  function select(id) {
    state.selectedId = id;
    renderList();
    const it = state.ideas.find(x => x.id === id);
    if (!it) return;
    // Fill form
    $('#title').value = it.title || '';
    $('#category').value = it.category || '';
    $('#status').value = it.status || 'Backlog';
    $('#priority').value = it.priority || 'Hoog';
    $('#due').value = it.due || '';
    $('#next_action').value = it.next_action || '';
    $('#tags').value = (it.tags||[]).join(', ');
    $('#description').value = it.description || '';
    renderLogs(it);
  }

  function renderLogs(it){
    const ul = $('#log-list');
    ul.innerHTML = '';
    (it.logs || []).sort((a,b)=>b.ts-a.ts).forEach(l => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="ts">${formatDate(l.ts)}</div><div>${escapeHtml(l.text)}</div>`;
      ul.appendChild(li);
    });
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function clearForm(){
    $('#idea-form').reset();
    $('#log-list').innerHTML = '';
  }

  function createIdea({title, note}){
    const now = Date.now();
    const it = {
      id: uid(),
      title: title || 'Nieuw idee',
      category: '',
      status: 'Backlog',
      priority: 'Hoog',
      due: '',
      next_action: '',
      tags: [],
      description: '',
      created_at: now,
      updated_at: now,
      logs: note ? [{ts: now, text: note}] : []
    };
    state.ideas.unshift(it);
    save();
    renderList();
    select(it.id);
  }

  function updateSelected(){
    const it = state.ideas.find(x => x.id === state.selectedId);
    if (!it) return;
    it.title = $('#title').value.trim();
    it.category = $('#category').value.trim();
    it.status = $('#status').value;
    it.priority = $('#priority').value;
    it.due = $('#due').value;
    it.next_action = $('#next_action').value.trim();
    it.tags = $('#tags').value.split(',').map(s=>s.trim()).filter(Boolean);
    it.description = $('#description').value;
    it.updated_at = Date.now();
    save();
    renderList();
  }

  function deleteSelected(){
    if (!state.selectedId) return;
    const i = state.ideas.findIndex(x => x.id === state.selectedId);
    if (i>=0) state.ideas.splice(i,1);
    state.selectedId = null;
    save();
    renderList();
    clearForm();
  }

  function addLog(txt){
    const it = state.ideas.find(x => x.id === state.selectedId);
    if (!it) return;
    it.logs = it.logs || [];
    it.logs.push({ts: Date.now(), text: txt});
    it.updated_at = Date.now();
    save();
    renderLogs(it);
    renderList();
  }

  function codexPromptFor(it){
    const tags = (it.tags||[]).map(t=>`#${t}`).join(' ');
    return `Act as an AI coding agent. Build or extend a minimal, production-ready feature for the following idea.

Idea:
Title: ${it.title}
Category: ${it.category}
Priority: ${it.priority}
Status: ${it.status}
Due: ${it.due || '-'}
Next action: ${it.next_action || '-'}
Tags: ${tags || '-'}

Description:
${it.description || '-'}

Deliverables:
1) Clean code with comments
2) Short README with run/build steps
3) Tests if applicable
4) A concise PR diff or patch
5) List any assumptions

Begin by outlining the file changes, then produce the code.`;
  }

  function copy(text){
    navigator.clipboard.writeText(text).then(()=>{
      // ok
    }).catch(()=>{});
  }

  // Event wiring
  $('#btn-add').addEventListener('click', ()=> createIdea({title:'Nieuw idee'}));
  $('#btn-export').addEventListener('click', ()=> {
    const data = JSON.stringify(state.ideas, null, 2);
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'superemre_idea_vault_export.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  $('#file-import').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try{
        const arr = JSON.parse(reader.result);
        if (Array.isArray(arr)){
          state.ideas = arr;
          save();
          renderList();
          clearForm();
        }
      }catch(err){ alert('Import mislukt: ongeldige JSON'); }
    };
    reader.readAsText(f);
  });

  $('#btn-quick').addEventListener('click', ()=> $('#quick-dialog').showModal());
  $('#quick-save').addEventListener('click', ()=> {
    const t = $('#quick-title').value.trim();
    const n = $('#quick-note').value.trim();
    if (!t) return;
    createIdea({title: t, note: n});
    $('#quick-title').value=''; $('#quick-note').value='';
  });
  $('#quick-cancel').addEventListener('click', ()=> $('#quick-dialog').close());

  $('#idea-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    updateSelected();
  });
  $('#btn-delete').addEventListener('click', ()=>{
    if (confirm('Verwijderen?')) deleteSelected();
  });
  $('#btn-log').addEventListener('click', ()=>{
    if (!state.selectedId) return;
    $('#log-dialog').showModal();
  });
  $('#log-save').addEventListener('click', ()=>{
    const txt = $('#log-text').value.trim();
    if (txt) addLog(txt);
    $('#log-text').value='';
  });
  $('#log-cancel').addEventListener('click', ()=> $('#log-dialog').close());

  $('#btn-codex').addEventListener('click', ()=>{
    const it = state.ideas.find(x => x.id === state.selectedId);
    if (!it) return;
    copy(codexPromptFor(it));
    alert('Codex-prompt gekopieerd naar klembord.');
  });

  $('#search').addEventListener('input', renderList);
  $('#filter-status').addEventListener('change', renderList);
  $('#filter-priority').addEventListener('change', renderList);

  // PWA install prompt
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    state.deferredPrompt = e;
    $('#btn-install').classList.remove('hidden');
  });
  $('#btn-install').addEventListener('click', async ()=>{
    if (!state.deferredPrompt) return;
    state.deferredPrompt.prompt();
    await state.deferredPrompt.userChoice;
    state.deferredPrompt = null;
    $('#btn-install').classList.add('hidden');
  });

  // Service worker (only if served over http/https)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')){
    navigator.serviceWorker.register('./sw.js').catch(console.warn);
  }

  // Init
  state.ideas = load();
  renderList();

  // Create first sample idea on first run
  if (!state.ideas.length){
    createIdea({title:'Eerste idee: Bouw utility micro-apps', note:'Start met 3 niches en zet elke week een update klaar.'});
  }
})();