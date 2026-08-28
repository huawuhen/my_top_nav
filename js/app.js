/**
 * 极简个人导航站 - 核心应用逻辑 (app.js)
 */

(function () {
  'use strict';

  // 本地存储键名
  const STORAGE_KEYS = {
    BOOKMARKS: 'my_nav_bookmarks',
    ENGINES: 'my_nav_engines',
    ACTIVE_ENGINE: 'my_nav_active_engine',
    THEME: 'my_nav_theme',
    VIEW_MODE: 'my_nav_view_mode'
  };

  // 全局状态
  let state = {
    categories: [],
    engines: [],
    activeEngineId: 'google',
    theme: 'dark', // 'dark' | 'light' | 'auto'
    viewMode: 'card', // 'card' | 'compact'
    searchQuery: '',
    editingBookmark: null // { categoryId, bookmarkId }
  };

  // DOM 元素引用缓存
  const el = {
    clockTime: document.getElementById('clock-time'),
    clockDate: document.getElementById('clock-date'),
    engineSwitcher: document.getElementById('engine-switcher'),
    searchInput: document.getElementById('main-search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    categoryDock: document.getElementById('category-dock'),
    categoriesContainer: document.getElementById('categories-container'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    viewToggleBtn: document.getElementById('view-toggle-btn'),
    addBookmarkBtn: document.getElementById('add-bookmark-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    toastContainer: document.getElementById('toast-container'),

    // 弹窗
    bookmarkModal: document.getElementById('bookmark-modal'),
    bookmarkForm: document.getElementById('bookmark-form'),
    modalTitle: document.getElementById('modal-title'),
    bmCategorySelect: document.getElementById('bm-category'),
    bmTitleInput: document.getElementById('bm-title'),
    bmUrlInput: document.getElementById('bm-url'),
    bmDescInput: document.getElementById('bm-desc'),
    bmIconInput: document.getElementById('bm-icon'),
    bmPinnedCheck: document.getElementById('bm-pinned'),

    settingsModal: document.getElementById('settings-modal'),
    catManagerModal: document.getElementById('category-manager-modal'),
    catListContainer: document.getElementById('category-list-container'),
    newCatNameInput: document.getElementById('new-cat-name'),
    newCatIconInput: document.getElementById('new-cat-icon'),
    addCatBtn: document.getElementById('add-cat-btn')
  };

  /* ================= 1. 初始化与数据持久化 ================= */
  function init() {
    loadData();
    applyTheme(state.theme);
    applyViewMode(state.viewMode);
    initClock();
    renderEngineSwitcher();
    renderCategoryDock();
    renderBookmarks();
    bindEvents();
  }

  function loadData() {
    try {
      const savedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      state.categories = savedBookmarks ? JSON.parse(savedBookmarks) : DEFAULT_BOOKMARKS;

      const savedEngines = localStorage.getItem(STORAGE_KEYS.ENGINES);
      state.engines = savedEngines ? JSON.parse(savedEngines) : DEFAULT_ENGINES;

      state.activeEngineId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ENGINE) || 'google';
      state.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
      state.viewMode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) || 'card';
    } catch (e) {
      console.error('加载本地数据失败，已回退至默认配置', e);
      state.categories = DEFAULT_BOOKMARKS;
      state.engines = DEFAULT_ENGINES;
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(state.categories));
    } catch (e) {
      console.error('保存数据至 localStorage 失败', e);
      showToast('本地存储容量超限或被禁用', 'error');
    }
  }

  /* ================= 2. 主题与视图模式 ================= */
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (el.themeToggleBtn) {
      el.themeToggleBtn.innerHTML = theme === 'dark' ? '🌙' : '☀️';
      el.themeToggleBtn.title = `当前主题：${theme === 'dark' ? '深色' : '浅色'} (点击切换)`;
    }
  }

  function toggleTheme() {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast(`已切换至 ${nextTheme === 'dark' ? '暗黑' : '明亮'} 模式`);
  }

  function applyViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    document.body.setAttribute('data-view', mode);
    if (el.viewToggleBtn) {
      el.viewToggleBtn.innerHTML = mode === 'card' ? '🗂️' : '▦';
      el.viewToggleBtn.title = `当前视图：${mode === 'card' ? '卡片模式' : '紧凑模式'} (点击切换)`;
    }
  }

  function toggleViewMode() {
    const nextMode = state.viewMode === 'card' ? 'compact' : 'card';
    applyViewMode(nextMode);
    showToast(`已切换为 ${nextMode === 'card' ? '标准卡片' : '紧凑网格'} 视图`);
  }

  /* ================= 3. 时钟与日期问候 ================= */
  function initClock() {
    function update() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      if (el.clockTime) el.clockTime.textContent = `${hours}:${minutes}`;

      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const day = weekDays[now.getDay()];

      let greeting = '专注当下';
      const h = now.getHours();
      if (h >= 5 && h < 12) greeting = '早上好，新的一天';
      else if (h >= 12 && h < 18) greeting = '下午好，保持专注';
      else greeting = '夜深了，注意休息';

      if (el.clockDate) el.clockDate.textContent = `${year}年${month}月${date}日 · ${day} · ${greeting}`;
    }
    update();
    setInterval(update, 1000);
  }

  /* ================= 4. 搜索引擎选择栏 ================= */
  function renderEngineSwitcher() {
    if (!el.engineSwitcher) return;
    el.engineSwitcher.innerHTML = state.engines
      .map(eng => `
        <button type="button" class="engine-pill ${eng.id === state.activeEngineId ? 'active' : ''}" data-id="${eng.id}">
          <span>${eng.icon}</span>
          <span>${eng.name}</span>
        </button>
      `)
      .join('');
  }

  function setActiveEngine(engineId) {
    state.activeEngineId = engineId;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ENGINE, engineId);
    renderEngineSwitcher();
    const activeEng = state.engines.find(e => e.id === engineId);
    if (activeEng && el.searchInput) {
      el.searchInput.placeholder = `通过 ${activeEng.name} 搜索或过滤书签... (按 / 聚焦)`;
    }
  }

  /* ================= 5. 分类快捷锚点栏 ================= */
  function renderCategoryDock() {
    if (!el.categoryDock) return;
    if (state.searchQuery.trim()) {
      el.categoryDock.style.display = 'none';
      return;
    }
    el.categoryDock.style.display = 'flex';
    el.categoryDock.innerHTML = state.categories
      .map(cat => `
        <a href="#cat-${cat.id}" class="dock-chip">
          <span>${cat.icon || '📁'}</span>
          <span>${escapeHtml(cat.name)}</span>
          <span style="font-size:11px; opacity:0.6;">(${cat.items ? cat.items.length : 0})</span>
        </a>
      `)
      .join('');
  }

  /* ================= 6. 书签与分类渲染 ================= */
  function getFaviconUrl(url, iconOverride) {
    if (iconOverride && iconOverride.trim().length > 0 && !iconOverride.startsWith('http')) {
      return null; // 表情符号或单字
    }
    if (iconOverride && iconOverride.startsWith('http')) {
      return iconOverride;
    }
    try {
      const parsed = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch (e) {
      return null;
    }
  }

  function highlightText(text, query) {
    if (!query || !text) return escapeHtml(text || '');
    const escapedText = escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapedText.replace(regex, '<span class="highlight-match">$1</span>');
  }

  function renderBookmarks() {
    if (!el.categoriesContainer) return;
    const query = state.searchQuery.trim().toLowerCase();
    let totalMatches = 0;

    let html = '';

    state.categories.forEach(cat => {
      let items = cat.items || [];

      // 排序：被固定 (pinned) 的排在前面
      items = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

      if (query) {
        items = items.filter(item => {
          const t = (item.title || '').toLowerCase();
          const d = (item.desc || '').toLowerCase();
          const u = (item.url || '').toLowerCase();
          return t.includes(query) || d.includes(query) || u.includes(query);
        });
      }

      if (items.length === 0 && query) {
        return; // 搜索时隐藏没有匹配项的分类
      }

      totalMatches += items.length;

      html += `
        <div class="category-group" id="cat-${cat.id}">
          <div class="category-header">
            <div class="category-title-wrap">
              <span class="category-icon">${cat.icon || '📁'}</span>
              <h2 class="category-name">${escapeHtml(cat.name)}</h2>
              <span class="category-count">${items.length}</span>
            </div>
            <div class="category-actions">
              <button type="button" class="cat-action-btn" onclick="app.openAddBookmarkModal('${cat.id}')" title="在此分类下添加书签">+ 添加</button>
            </div>
          </div>
          <div class="bookmarks-grid">
            ${items.map(bm => renderBookmarkCard(cat.id, bm, query)).join('')}
          </div>
        </div>
      `;
    });

    if (query && totalMatches === 0) {
      const activeEng = state.engines.find(e => e.id === state.activeEngineId) || state.engines[0];
      html = `
        <div class="empty-search-state">
          <div class="empty-search-icon">🔍</div>
          <div class="empty-search-title">未在本地书签中找到包含 "${escapeHtml(state.searchQuery)}" 的内容</div>
          <p style="font-size: 13px;">直接按 <strong>Enter</strong> 或点击下方按钮进行网络全网搜索</p>
          <button type="button" class="action-btn btn-primary empty-search-btn" onclick="app.executeWebSearch('${escapeHtml(state.searchQuery)}')">
            使用 ${activeEng.name} 搜索 "${escapeHtml(state.searchQuery)}"
          </button>
        </div>
      `;
    }

    el.categoriesContainer.innerHTML = html;
  }

  function renderBookmarkCard(categoryId, bm, query) {
    const favicon = getFaviconUrl(bm.url, bm.icon);
    const hasImageFavicon = Boolean(favicon);
    const displayEmoji = !hasImageFavicon ? (bm.icon || bm.title.charAt(0) || '🌐') : '';

    return `
      <a href="${escapeHtml(bm.url)}" target="_blank" rel="noopener noreferrer" class="bookmark-card" data-cat-id="${categoryId}" data-bm-id="${bm.id}">
        <div class="bm-icon-wrapper">
          ${hasImageFavicon
            ? `<img class="bm-icon-img" src="${escapeHtml(favicon)}" alt="" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <span style="display:none; font-size:16px;">${escapeHtml(bm.title.charAt(0))}</span>`
            : `<span>${escapeHtml(displayEmoji)}</span>`
          }
        </div>
        <div class="bm-content">
          <div class="bm-title-row">
            <span class="bm-title">${highlightText(bm.title, query)}</span>
            ${bm.pinned ? '<span class="bm-pinned-icon" title="已置顶">📌</span>' : ''}
          </div>
          <div class="bm-desc">${highlightText(bm.desc || bm.url, query)}</div>
        </div>
        <div class="bm-card-actions" onclick="event.preventDefault(); event.stopPropagation();">
          <button type="button" class="bm-action-btn" title="${bm.pinned ? '取消置顶' : '置顶'}" onclick="app.togglePin('${categoryId}', '${bm.id}')">
            ${bm.pinned ? '📍' : '📌'}
          </button>
          <button type="button" class="bm-action-btn" title="编辑" onclick="app.openEditBookmarkModal('${categoryId}', '${bm.id}')">
            ✏️
          </button>
          <button type="button" class="bm-action-btn btn-delete" title="删除" onclick="app.deleteBookmark('${categoryId}', '${bm.id}')">
            🗑️
          </button>
        </div>
      </a>
    `;
  }

  /* ================= 7. 搜索与全网检索 ================= */
  function handleSearchInput(e) {
    state.searchQuery = e.target.value;
    if (el.clearSearchBtn) {
      el.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    }
    renderCategoryDock();
    renderBookmarks();
  }

  function clearSearch() {
    state.searchQuery = '';
    if (el.searchInput) {
      el.searchInput.value = '';
      el.searchInput.focus();
    }
    if (el.clearSearchBtn) el.clearSearchBtn.style.display = 'none';
    renderCategoryDock();
    renderBookmarks();
  }

  function executeWebSearch(query) {
    const q = (query || state.searchQuery).trim();
    if (!q) return;
    const activeEng = state.engines.find(e => e.id === state.activeEngineId) || state.engines[0];
    const targetUrl = activeEng.url + encodeURIComponent(q);
    window.open(targetUrl, '_blank');
  }

  /* ================= 8. 书签增删改与分类管理 ================= */
  function openAddBookmarkModal(targetCatId) {
    state.editingBookmark = null;
    if (el.modalTitle) el.modalTitle.innerHTML = '<span>➕</span> 添加新书签';
    if (el.bookmarkForm) el.bookmarkForm.reset();

    // 填充分类下拉选项
    populateCategorySelect(targetCatId);
    showModal(el.bookmarkModal);
    setTimeout(() => el.bmUrlInput && el.bmUrlInput.focus(), 50);
  }

  function openEditBookmarkModal(categoryId, bookmarkId) {
    const cat = state.categories.find(c => c.id === categoryId);
    if (!cat) return;
    const bm = (cat.items || []).find(i => i.id === bookmarkId);
    if (!bm) return;

    state.editingBookmark = { categoryId, bookmarkId };
    if (el.modalTitle) el.modalTitle.innerHTML = '<span>✏️</span> 编辑书签';

    populateCategorySelect(categoryId);
    if (el.bmTitleInput) el.bmTitleInput.value = bm.title || '';
    if (el.bmUrlInput) el.bmUrlInput.value = bm.url || '';
    if (el.bmDescInput) el.bmDescInput.value = bm.desc || '';
    if (el.bmIconInput) el.bmIconInput.value = bm.icon || '';
    if (el.bmPinnedCheck) el.bmPinnedCheck.checked = Boolean(bm.pinned);

    showModal(el.bookmarkModal);
  }

  function populateCategorySelect(selectedId) {
    if (!el.bmCategorySelect) return;
    el.bmCategorySelect.innerHTML = state.categories
      .map(c => `<option value="${c.id}" ${c.id === selectedId ? 'selected' : ''}>${c.icon || '📁'} ${escapeHtml(c.name)}</option>`)
      .join('');
  }

  function handleBookmarkFormSubmit(e) {
    e.preventDefault();
    const catId = el.bmCategorySelect.value;
    const title = el.bmTitleInput.value.trim();
    let url = el.bmUrlInput.value.trim();
    const desc = el.bmDescInput.value.trim();
    const icon = el.bmIconInput.value.trim();
    const pinned = el.bmPinnedCheck.checked;

    if (!title || !url) {
      showToast('请填写书签标题和网址', 'error');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (state.editingBookmark) {
      // 编辑逻辑
      const oldCat = state.categories.find(c => c.id === state.editingBookmark.categoryId);
      if (oldCat) {
        oldCat.items = (oldCat.items || []).filter(i => i.id !== state.editingBookmark.bookmarkId);
      }
      const targetCat = state.categories.find(c => c.id === catId);
      if (targetCat) {
        if (!targetCat.items) targetCat.items = [];
        targetCat.items.push({
          id: state.editingBookmark.bookmarkId,
          title,
          url,
          desc,
          icon,
          pinned
        });
      }
      showToast('书签修改成功');
    } else {
      // 新增逻辑
      const targetCat = state.categories.find(c => c.id === catId);
      if (targetCat) {
        if (!targetCat.items) targetCat.items = [];
        targetCat.items.push({
          id: 'bm-' + Date.now(),
          title,
          url,
          desc,
          icon,
          pinned
        });
      }
      showToast('书签添加成功');
    }

    saveData();
    renderBookmarks();
    renderCategoryDock();
    hideModal(el.bookmarkModal);
  }

  function deleteBookmark(categoryId, bookmarkId) {
    if (!confirm('确定要删除这个书签吗？')) return;
    const cat = state.categories.find(c => c.id === categoryId);
    if (cat) {
      cat.items = (cat.items || []).filter(i => i.id !== bookmarkId);
      saveData();
      renderBookmarks();
      renderCategoryDock();
      showToast('书签已删除');
    }
  }

  function togglePin(categoryId, bookmarkId) {
    const cat = state.categories.find(c => c.id === categoryId);
    if (cat) {
      const bm = (cat.items || []).find(i => i.id === bookmarkId);
      if (bm) {
        bm.pinned = !bm.pinned;
        saveData();
        renderBookmarks();
        showToast(bm.pinned ? '已置顶到分类前列' : '已取消置顶');
      }
    }
  }

  /* ================= 9. 分类管理器 ================= */
  function openCategoryManagerModal() {
    renderCategoryManagerList();
    showModal(el.catManagerModal);
  }

  function renderCategoryManagerList() {
    if (!el.catListContainer) return;
    el.catListContainer.innerHTML = state.categories
      .map((cat, idx) => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>${cat.icon || '📁'}</span>
            <strong>${escapeHtml(cat.name)}</strong>
            <span style="font-size:12px; color:var(--text-muted);">(${cat.items ? cat.items.length : 0} 个书签)</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button type="button" class="action-btn icon-btn" title="上移" onclick="app.moveCategory(${idx}, -1)">↑</button>
            <button type="button" class="action-btn icon-btn" title="下移" onclick="app.moveCategory(${idx}, 1)">↓</button>
            <button type="button" class="action-btn icon-btn" style="color:var(--danger);" title="删除分类" onclick="app.deleteCategory('${cat.id}')">🗑️</button>
          </div>
        </div>
      `)
      .join('');
  }

  function handleAddCategory() {
    const name = el.newCatNameInput.value.trim();
    const icon = el.newCatIconInput.value.trim() || '📁';
    if (!name) {
      showToast('请输入分类名称', 'error');
      return;
    }
    state.categories.push({
      id: 'cat-' + Date.now(),
      name,
      icon,
      items: []
    });
    el.newCatNameInput.value = '';
    el.newCatIconInput.value = '';
    saveData();
    renderCategoryManagerList();
    renderCategoryDock();
    renderBookmarks();
    showToast('新分类添加成功');
  }

  function moveCategory(index, direction) {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= state.categories.length) return;
    const temp = state.categories[index];
    state.categories[index] = state.categories[newIdx];
    state.categories[newIdx] = temp;
    saveData();
    renderCategoryManagerList();
    renderCategoryDock();
    renderBookmarks();
  }

  function deleteCategory(catId) {
    const cat = state.categories.find(c => c.id === catId);
    if (!cat) return;
    const count = cat.items ? cat.items.length : 0;
    if (count > 0 && !confirm(`该分类下包含 ${count} 个书签，删除将同时清空这些书签。确定删除吗？`)) {
      return;
    }
    state.categories = state.categories.filter(c => c.id !== catId);
    saveData();
    renderCategoryManagerList();
    renderCategoryDock();
    renderBookmarks();
    showToast('分类已删除');
  }

  /* ================= 10. 导入与导出 ================= */
  function exportJSON() {
    const dataStr = JSON.stringify(state.categories, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已导出 JSON 备份');
  }

  function exportHTML() {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>\n`;

    state.categories.forEach(cat => {
      html += `    <DT><H3 ADD_DATE="${Date.now()}" LAST_MODIFIED="${Date.now()}">${escapeHtml(cat.name)}</H3>\n    <DL><p>\n`;
      (cat.items || []).forEach(bm => {
        html += `        <DT><A HREF="${escapeHtml(bm.url)}" ADD_DATE="${Date.now()}" ICON="${escapeHtml(bm.icon || '')}">${escapeHtml(bm.title)}</A>\n`;
      });
      html += `    </DL><p>\n`;
    });
    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks_chrome_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已导出浏览器标准 HTML 书签');
  }

  function importFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            state.categories = parsed;
            saveData();
            renderCategoryDock();
            renderBookmarks();
            hideModal(el.settingsModal);
            showToast('JSON 书签导入成功！');
          } else {
            showToast('JSON 格式不符', 'error');
          }
        } catch (err) {
          showToast('JSON 解析失败', 'error');
        }
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        parseNetscapeHTML(content);
      }
    };
    reader.readAsText(file);
  }

  function parseNetscapeHTML(htmlContent) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const h3List = doc.querySelectorAll('h3');
      const newCats = [];

      if (h3List.length > 0) {
        h3List.forEach(h3 => {
          const catName = h3.textContent.trim() || '导入分类';
          const dl = h3.nextElementSibling;
          const items = [];
          if (dl && dl.tagName === 'DL') {
            const links = dl.querySelectorAll('a');
            links.forEach(a => {
              if (a.href) {
                items.push({
                  id: 'bm-' + Math.random().toString(36).substring(2, 9),
                  title: a.textContent.trim() || a.href,
                  url: a.href,
                  desc: '',
                  icon: '',
                  pinned: false
                });
              }
            });
          }
          if (items.length > 0) {
            newCats.push({
              id: 'cat-' + Math.random().toString(36).substring(2, 9),
              name: catName,
              icon: '📁',
              items
            });
          }
        });
      }

      if (newCats.length === 0) {
        // 全量平铺提取 <a>
        const allLinks = doc.querySelectorAll('a');
        const fallbackItems = [];
        allLinks.forEach(a => {
          if (a.href) {
            fallbackItems.push({
              id: 'bm-' + Math.random().toString(36).substring(2, 9),
              title: a.textContent.trim() || a.href,
              url: a.href,
              desc: '',
              icon: '',
              pinned: false
            });
          }
        });
        if (fallbackItems.length > 0) {
          newCats.push({
            id: 'cat-imported',
            name: '浏览器导入书签',
            icon: '📥',
            items: fallbackItems
          });
        }
      }

      if (newCats.length > 0) {
        state.categories = [...state.categories, ...newCats];
        saveData();
        renderCategoryDock();
        renderBookmarks();
        hideModal(el.settingsModal);
        showToast(`成功导入 ${newCats.reduce((acc, c) => acc + c.items.length, 0)} 个书签！`);
      } else {
        showToast('未能解析出有效书签', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('HTML 解析失败', 'error');
    }
  }

  function resetToDefault() {
    if (!confirm('确定要恢复出厂默认书签吗？当前自定义的书签将被重置。建议先导出备份。')) return;
    state.categories = JSON.parse(JSON.stringify(DEFAULT_BOOKMARKS));
    state.engines = JSON.parse(JSON.stringify(DEFAULT_ENGINES));
    saveData();
    renderCategoryDock();
    renderBookmarks();
    hideModal(el.settingsModal);
    showToast('已恢复为初始精选书签');
  }

  /* ================= 11. 弹窗与事件绑定 ================= */
  function showModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('show');
  }

  function hideModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('show');
  }

  function showToast(msg, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✨'}</span> <span>${escapeHtml(msg)}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  function bindEvents() {
    // 搜索输入与回车
    if (el.searchInput) {
      el.searchInput.addEventListener('input', handleSearchInput);
      el.searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeWebSearch();
        } else if (e.key === 'Escape') {
          clearSearch();
        }
      });
    }

    if (el.clearSearchBtn) {
      el.clearSearchBtn.addEventListener('click', clearSearch);
    }

    // 切换搜索引擎
    if (el.engineSwitcher) {
      el.engineSwitcher.addEventListener('click', function (e) {
        const btn = e.target.closest('.engine-pill');
        if (btn && btn.dataset.id) {
          setActiveEngine(btn.dataset.id);
          if (el.searchInput && el.searchInput.value.trim()) {
            executeWebSearch();
          }
        }
      });
    }

    // 头部按钮
    if (el.themeToggleBtn) el.themeToggleBtn.addEventListener('click', toggleTheme);
    if (el.viewToggleBtn) el.viewToggleBtn.addEventListener('click', toggleViewMode);
    if (el.addBookmarkBtn) el.addBookmarkBtn.addEventListener('click', () => openAddBookmarkModal(state.categories[0]?.id));
    if (el.settingsBtn) el.settingsBtn.addEventListener('click', () => showModal(el.settingsModal));

    // 书签表单
    if (el.bookmarkForm) el.bookmarkForm.addEventListener('submit', handleBookmarkFormSubmit);

    // 分类管理添加
    if (el.addCatBtn) el.addCatBtn.addEventListener('click', handleAddCategory);

    // 全局快捷键
    window.addEventListener('keydown', function (e) {
      // 避免在 input/textarea 里触发
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !isInput) {
        e.preventDefault();
        el.searchInput && el.searchInput.focus();
      } else if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.show').forEach(m => hideModal(m));
      } else if (e.altKey && (e.key === 'n' || e.key === 'N') && !isInput) {
        e.preventDefault();
        openAddBookmarkModal(state.categories[0]?.id);
      }
    });

    // 弹窗关闭监听
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', function () {
        const targetModal = this.closest('.modal-backdrop');
        hideModal(targetModal);
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) hideModal(this);
      });
    });
  }

  // 工具函数
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 暴露给外部 HTML 行内绑定的安全命名空间
  window.app = {
    openAddBookmarkModal,
    openEditBookmarkModal,
    openCategoryManagerModal,
    deleteBookmark,
    togglePin,
    moveCategory,
    deleteCategory,
    exportJSON,
    exportHTML,
    importFile,
    resetToDefault,
    executeWebSearch
  };

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
