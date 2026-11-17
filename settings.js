// ==========================================================================
// YUVRAJ PATEL // SETTINGS DASHBOARD CONTROLLER
// Granular customization, dynamic list managers, save & export
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  let config = window.PortfolioConfig.get();

  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.tab;
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Populate All Forms
  function populateAll(){
    // 01. Personal Identity
    const p = config.personal || {};
    setVal('p-fullName', p.fullName);
    setVal('p-firstName', p.firstName);
    setVal('p-monogram', p.monogram);
    setVal('p-email', p.email);
    setVal('p-githubUrl', p.githubUrl);
    setVal('p-linkedinUrl', p.linkedinUrl);
    setVal('p-institution', p.institution);
    setVal('p-institutionRole', p.institutionRole);
    setVal('p-school', p.school);
    setVal('p-statusText', p.statusText);
    setVal('p-locationText', p.locationText);
    setVal('p-description', p.description);
    setVal('p-footerBio', p.footerBio);
    setVal('p-footerWordmark', p.footerWordmark);
    setVal('p-profilePhoto', p.profilePhoto);

    // 02. Modular Toggles
    const m = config.modules || {};
    setChecked('mod-heroSection', m.heroSection !== false);
    setChecked('mod-flipCalendar', m.flipCalendar !== false);
    setChecked('mod-liquidReveal', m.liquidReveal !== false);
    setChecked('mod-pullCordToggle', m.pullCordToggle !== false);
    setChecked('mod-doorsSection', m.doorsSection !== false);
    setChecked('mod-storyTimeline', m.storyTimeline !== false);
    setChecked('mod-abilityCard', m.abilityCard !== false);
    setChecked('mod-aiAssistantDrawer', m.aiAssistantDrawer !== false);
    setChecked('mod-contactModal', m.contactModal !== false);
    setChecked('mod-footerWordmark', m.footerWordmark !== false);
    setChecked('mod-clockTicker', m.clockTicker !== false);

    // 03. Hero & Skills
    const h = config.hero || {};
    setVal('h-eyebrow', h.eyebrow);
    setVal('h-greeting', h.greeting);
    setVal('h-flipHoldDuration', h.flipHoldDuration || 1800);
    renderSkillsList(h.skills || []);

    // 04. Doors (Projects)
    renderDoorsList(config.doors || []);

    // 05. Journey Chapters
    renderJourneyList(config.journey || []);

    // 06. Local AI Studio
    const ai = config.aiStudio || {};
    setVal('ai-modelName', ai.modelName);
    setVal('ai-apiEndpoint', ai.apiEndpoint);
    setVal('ai-systemPrompt', ai.systemPrompt);
    renderQuickPrompts(ai.quickPrompts || []);

    // 07. Ability Card
    const card = config.abilityCard || {};
    setVal('card-badgeCode', card.badgeCode);
    setVal('card-idCode', card.idCode);
    renderCardSpecs(card.specs || []);

    // 08. Theme
    const th = config.theme || {};
    setVal('th-defaultMode', th.defaultMode || 'dark');
  }

  // --- Dynamic Skills Editor ---
  function renderSkillsList(skills){
    const container = document.getElementById('skillsTagsContainer');
    if (!container) return;
    container.innerHTML = skills.map((s, idx) => `
      <div class="tag-pill">
        <span>${escapeHtml(s)}</span>
        <span class="tag-del" data-idx="${idx}">&times;</span>
      </div>
    `).join('');

    container.querySelectorAll('.tag-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.idx;
        config.hero.skills.splice(i, 1);
        renderSkillsList(config.hero.skills);
      });
    });
  }

  document.getElementById('addSkillBtn')?.addEventListener('click', () => {
    const input = document.getElementById('newSkillInput');
    const val = input.value.trim();
    if (val){
      if (!config.hero.skills) config.hero.skills = [];
      config.hero.skills.push(val);
      input.value = '';
      renderSkillsList(config.hero.skills);
    }
  });

  // --- Dynamic Doors (Projects) Editor ---
  function renderDoorsList(doors){
    const container = document.getElementById('doorsListContainer');
    if (!container) return;
    container.innerHTML = doors.map((d, idx) => `
      <div class="item-card" data-door-idx="${idx}">
        <div class="item-card-header">
          <div class="item-card-title">
            <span>Door ${idx + 1}: ${escapeHtml(d.title)}</span>
            <span class="item-badge" style="background:${d.doorColor || '#1e2d42'}">${escapeHtml(d.badge || 'Project')}</span>
          </div>
          <button type="button" class="btn btn-danger btn-sm del-door-btn" data-idx="${idx}">Delete</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" class="input door-title" value="${escapeAttr(d.title)}">
          </div>
          <div class="form-group">
            <label>Badge / Category</label>
            <input type="text" class="input door-badge" value="${escapeAttr(d.badge || '')}">
          </div>
          <div class="form-group col-span-2">
            <label>Tagline / Pitch</label>
            <input type="text" class="input door-tagline" value="${escapeAttr(d.tagline)}">
          </div>
          <div class="form-group">
            <label>Door Primary Color</label>
            <input type="color" class="input input-color door-color" value="${d.doorColor || '#1e2d42'}">
          </div>
          <div class="form-group">
            <label>Door Dark Shade Color</label>
            <input type="color" class="input input-color door-dark" value="${d.doorDarkColor || '#162233'}">
          </div>
          <div class="form-group">
            <label>Action Type</label>
            <select class="select door-action">
              <option value="url" ${d.actionType === 'url' ? 'selected' : ''}>External URL (GitHub / Demo)</option>
              <option value="drawer" ${d.actionType === 'drawer' ? 'selected' : ''}>Open AI Assistant Drawer</option>
              <option value="story" ${d.actionType === 'story' ? 'selected' : ''}>Scroll to Journey Story</option>
            </select>
          </div>
          <div class="form-group">
            <label>Action Target (URL or ID)</label>
            <input type="text" class="input door-target" value="${escapeAttr(d.actionTarget || '')}">
          </div>
          <div class="form-group col-span-2">
            <label>Bullet Points (One per line)</label>
            <textarea class="textarea door-bullets">${(d.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.del-door-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.idx;
        if (confirm('Delete this project door?')){
          config.doors.splice(i, 1);
          renderDoorsList(config.doors);
        }
      });
    });
  }

  document.getElementById('addDoorBtn')?.addEventListener('click', () => {
    if (!config.doors) config.doors = [];
    config.doors.push({
      id: "door-" + Date.now(),
      title: "New Project",
      tagline: "High-impact software solution",
      badge: "Project",
      doorColor: "#22304a",
      doorDarkColor: "#1c2840",
      actionType: "url",
      actionTarget: "https://github.com/yuvrajpatelair",
      bullets: [
        "Architected with modern performance best practices",
        "Open source and freely available",
        "Full unit test coverage"
      ]
    });
    renderDoorsList(config.doors);
  });

  // --- Dynamic Journey Chapters Editor ---
  function renderJourneyList(chapters){
    const container = document.getElementById('journeyListContainer');
    if (!container) return;
    container.innerHTML = chapters.map((ch, idx) => `
      <div class="item-card" data-ch-idx="${idx}">
        <div class="item-card-header">
          <div class="item-card-title">
            <span>Chapter ${idx + 1}: ${escapeHtml(ch.title)}</span>
            <span class="item-badge">${escapeHtml(ch.year)}</span>
          </div>
          <button type="button" class="btn btn-danger btn-sm del-ch-btn" data-idx="${idx}">Delete</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Year (for Odometer Digits)</label>
            <input type="text" class="input ch-year" value="${escapeAttr(ch.year)}" maxlength="4">
          </div>
          <div class="form-group">
            <label>Date Range Display</label>
            <input type="text" class="input ch-date" value="${escapeAttr(ch.dateRange)}">
          </div>
          <div class="form-group">
            <label>Milestone Title</label>
            <input type="text" class="input ch-title" value="${escapeAttr(ch.title)}">
          </div>
          <div class="form-group">
            <label>Organization / Role</label>
            <input type="text" class="input ch-org" value="${escapeAttr(ch.organization)}">
          </div>
          <div class="form-group col-span-2">
            <label>Bullets / Highlights (One per line)</label>
            <textarea class="textarea ch-bullets">${(ch.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.del-ch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.idx;
        if (confirm('Delete this journey chapter?')){
          config.journey.splice(i, 1);
          renderJourneyList(config.journey);
        }
      });
    });
  }

  document.getElementById('addChapterBtn')?.addEventListener('click', () => {
    if (!config.journey) config.journey = [];
    config.journey.push({
      year: "2026",
      dateRange: "2026",
      title: "New Milestone",
      organization: "Software Development & Research",
      isCurrent: false,
      bullets: [
        "Major accomplishment or research phase",
        "Key takeaways and skills mastered"
      ]
    });
    renderJourneyList(config.journey);
  });

  // --- Dynamic AI Quick Prompts Editor ---
  function renderQuickPrompts(prompts){
    const container = document.getElementById('aiPromptsContainer');
    if (!container) return;
    container.innerHTML = prompts.map((p, idx) => `
      <div class="toggle-item" style="margin-bottom:0.5rem;">
        <div class="toggle-info">
          <h4>${escapeHtml(p.label)}</h4>
          <p>${escapeHtml(p.query)}</p>
        </div>
        <button type="button" class="btn btn-danger btn-sm del-prompt-btn" data-idx="${idx}">Remove</button>
      </div>
    `).join('');

    container.querySelectorAll('.del-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = +btn.dataset.idx;
        config.aiStudio.quickPrompts.splice(i, 1);
        renderQuickPrompts(config.aiStudio.quickPrompts);
      });
    });
  }

  document.getElementById('addPromptBtn')?.addEventListener('click', () => {
    const label = document.getElementById('newPromptLabel').value.trim();
    const query = document.getElementById('newPromptQuery').value.trim();
    if (label && query){
      if (!config.aiStudio.quickPrompts) config.aiStudio.quickPrompts = [];
      config.aiStudio.quickPrompts.push({ label, query });
      document.getElementById('newPromptLabel').value = '';
      document.getElementById('newPromptQuery').value = '';
      renderQuickPrompts(config.aiStudio.quickPrompts);
    }
  });

  // --- Ability Card Specs Editor ---
  function renderCardSpecs(specs){
    const container = document.getElementById('cardSpecsContainer');
    if (!container) return;
    container.innerHTML = specs.map((s, idx) => `
      <div class="form-grid" style="margin-bottom:0.75rem;">
        <div class="form-group">
          <label>Spec Key</label>
          <input type="text" class="input card-key" value="${escapeAttr(s.key)}" data-idx="${idx}">
        </div>
        <div class="form-group">
          <label>Spec Value</label>
          <input type="text" class="input card-val" value="${escapeAttr(s.val)}" data-idx="${idx}">
        </div>
      </div>
    `).join('');
  }

  // --- Save Handler ---
  document.getElementById('saveConfigBtn')?.addEventListener('click', saveAll);

  function saveAll(){
    // 01. Harvest Personal
    config.personal = {
      fullName: getVal('p-fullName'),
      firstName: getVal('p-firstName'),
      monogram: getVal('p-monogram'),
      email: getVal('p-email'),
      githubUrl: getVal('p-githubUrl'),
      githubHandle: "@" + getVal('p-githubUrl').split('/').filter(Boolean).pop(),
      linkedinUrl: getVal('p-linkedinUrl'),
      institution: getVal('p-institution'),
      institutionRole: getVal('p-institutionRole'),
      school: getVal('p-school'),
      statusText: getVal('p-statusText'),
      locationText: getVal('p-locationText'),
      description: getVal('p-description'),
      footerBio: getVal('p-footerBio'),
      footerWordmark: getVal('p-footerWordmark'),
      profilePhoto: getVal('p-profilePhoto')
    };

    // 02. Harvest Modules
    config.modules = {
      heroSection: getChecked('mod-heroSection'),
      flipCalendar: getChecked('mod-flipCalendar'),
      liquidReveal: getChecked('mod-liquidReveal'),
      pullCordToggle: getChecked('mod-pullCordToggle'),
      doorsSection: getChecked('mod-doorsSection'),
      storyTimeline: getChecked('mod-storyTimeline'),
      abilityCard: getChecked('mod-abilityCard'),
      aiAssistantDrawer: getChecked('mod-aiAssistantDrawer'),
      contactModal: getChecked('mod-contactModal'),
      footerWordmark: getChecked('mod-footerWordmark'),
      clockTicker: getChecked('mod-clockTicker')
    };

    // 03. Harvest Hero
    config.hero.eyebrow = getVal('h-eyebrow');
    config.hero.greeting = getVal('h-greeting');
    config.hero.flipHoldDuration = +getVal('h-flipHoldDuration') || 1800;

    // 04. Harvest Doors
    const doorCards = document.querySelectorAll('#doorsListContainer .item-card');
    config.doors = Array.from(doorCards).map((card, i) => {
      const title = card.querySelector('.door-title').value.trim();
      const badge = card.querySelector('.door-badge').value.trim();
      const tagline = card.querySelector('.door-tagline').value.trim();
      const doorColor = card.querySelector('.door-color').value;
      const doorDarkColor = card.querySelector('.door-dark').value;
      const actionType = card.querySelector('.door-action').value;
      const actionTarget = card.querySelector('.door-target').value.trim();
      const bullets = card.querySelector('.door-bullets').value.split('\n').map(s => s.trim()).filter(Boolean);
      return {
        id: "door-" + i,
        title, badge, tagline, doorColor, doorDarkColor, actionType, actionTarget, bullets
      };
    });

    // 05. Harvest Journey
    const chCards = document.querySelectorAll('#journeyListContainer .item-card');
    config.journey = Array.from(chCards).map((card, i) => {
      const year = card.querySelector('.ch-year').value.trim() || "2026";
      const dateRange = card.querySelector('.ch-date').value.trim();
      const title = card.querySelector('.ch-title').value.trim();
      const organization = card.querySelector('.ch-org').value.trim();
      const bullets = card.querySelector('.ch-bullets').value.split('\n').map(s => s.trim()).filter(Boolean);
      return {
        year, dateRange, title, organization, isCurrent: i === 0, bullets
      };
    });

    // 06. Harvest AI Studio
    config.aiStudio.modelName = getVal('ai-modelName');
    config.aiStudio.apiEndpoint = getVal('ai-apiEndpoint');
    config.aiStudio.systemPrompt = getVal('ai-systemPrompt');

    // 07. Harvest Ability Card
    config.abilityCard.badgeCode = getVal('card-badgeCode');
    config.abilityCard.idCode = getVal('card-idCode');
    const specKeys = document.querySelectorAll('#cardSpecsContainer .card-key');
    const specVals = document.querySelectorAll('#cardSpecsContainer .card-val');
    config.abilityCard.specs = Array.from(specKeys).map((kInput, i) => ({
      key: kInput.value.trim(),
      val: specVals[i]?.value.trim() || ''
    }));

    // 08. Harvest Theme
    config.theme.defaultMode = getVal('th-defaultMode');

    // Persist to localStorage
    const ok = window.PortfolioConfig.save(config);
    if (ok) showToast("✓ Changes saved! The website is immediately updated.");
    else alert("Failed to save changes.");
  }

  // --- Reset to Factory Defaults ---
  document.getElementById('resetConfigBtn')?.addEventListener('click', () => {
    if (confirm("Reset ALL settings back to default values? Any unsaved edits will be lost.")){
      window.PortfolioConfig.reset();
      config = window.PortfolioConfig.get();
      populateAll();
      showToast("✓ Portfolio reset to factory defaults.");
    }
  });

  // --- Export & Import Modal ---
  const modal = document.getElementById('jsonModal');
  const jsonText = document.getElementById('jsonArea');

  document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
    jsonText.value = window.PortfolioConfig.exportJSON();
    modal.classList.add('open');
  });

  document.getElementById('importJsonBtn')?.addEventListener('click', () => {
    jsonText.value = "";
    modal.classList.add('open');
  });

  document.getElementById('closeJsonModal')?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  document.getElementById('applyJsonBtn')?.addEventListener('click', () => {
    const raw = jsonText.value.trim();
    if (!raw){ alert("Please enter JSON data."); return; }
    const ok = window.PortfolioConfig.importJSON(raw);
    if (ok){
      config = window.PortfolioConfig.get();
      populateAll();
      modal.classList.remove('open');
      showToast("✓ Configuration imported successfully!");
    } else {
      alert("Invalid JSON configuration. Please check format.");
    }
  });

  document.getElementById('downloadJsonFileBtn')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.PortfolioConfig.exportJSON());
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "portfolio-config.json");
    dlAnchor.click();
    dlAnchor.remove();
  });

  // Toast
  function showToast(msg){
    const toast = document.getElementById('adminToast');
    const label = document.getElementById('toastMsg');
    if (!toast || !label) return;
    label.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // Helpers
  function setVal(id, v){ const el = document.getElementById(id); if (el) el.value = v != null ? v : ''; }
  function getVal(id){ return document.getElementById(id)?.value?.trim() || ''; }
  function setChecked(id, b){ const el = document.getElementById(id); if (el) el.checked = !!b; }
  function getChecked(id){ return document.getElementById(id)?.checked || false; }

  function escapeHtml(s){
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escapeAttr(s){
    if (!s) return '';
    return String(s).replace(/"/g, '&quot;');
  }

  // Initial population
  populateAll();
});
