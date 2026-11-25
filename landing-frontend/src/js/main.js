/**
 * Diet-Med App Landing Page — Skrypt główny
 * - Dynamiczne mapowanie URL do Live Demo (landing.diet-med-app -> app.diet-med-app)
 * - Przełączanie makiet Phone Mockup (4 moduły aplikacji mobilnej)
 * - Interaktywny Mini-Symulator Lodówki & Agenta AI z prawdziwymi regułami DIET-MED
 * - Obsługa formularzy Waiting List i Konsultacji Online (POST /api/waitlist, /api/consultations)
 * - Zgoda Cookies i hooki pod GA4 / Meta Pixel
 */

// 1. Bazowa baza wiedzy Mini-Symulatora (prawdziwe statusy z 6 baz DIET-MED)
const SIM_AILMENTS = [
  { id: 'insulinoopornosc', label: 'Insulinooporność' },
  { id: 'hashimoto', label: 'Hashimoto' },
  { id: 'niedoczynnosc_tarczycy', label: 'Niedoczynność tarczycy' },
  { id: 'sibo', label: 'SIBO' },
  { id: 'lipoedema', label: 'Lipoedema' },
  { id: 'nietolerancja_histaminy', label: 'Nietolerancja histaminy' }
];

// Priorytety kliniczne zgodne z silnikiem diet-med-app:
const STATUS_PRIORITY = {
  zalecane: 1,
  dozwolone: 2,
  ograniczone: 3,
  zakazane: 4
};

const STATUS_LABELS = {
  zalecane: 'Zalecane',
  dozwolone: 'Dozwolone',
  ograniczone: 'Ograniczone',
  zakazane: 'Zakazane'
};

// Autentyczne produkty z tabel seedowych DIET-MED
const SIM_PRODUCTS = [
  {
    id: 'jaja',
    name: 'Jaja kurze',
    category: 'Nabiał i jaja',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'dozwolone',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'indyk',
    name: 'Indyk',
    category: 'Mięso',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'kurczak',
    name: 'Kurczak',
    category: 'Mięso',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'losos',
    name: 'Łosoś świeży',
    category: 'Ryby',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'dozwolone',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'dozwolone',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'cukinia',
    name: 'Cukinia',
    category: 'Warzywa',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'dozwolone',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'brokul',
    name: 'Brokuł',
    category: 'Warzywa',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'dozwolone',
      sibo: 'dozwolone',
      hashimoto: 'dozwolone',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'szpinak',
    name: 'Szpinak dojrzały',
    category: 'Warzywa',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'dozwolone',
      sibo: 'zalecane',
      hashimoto: 'dozwolone',
      nietolerancja_histaminy: 'zakazane',
      lipoedema: 'dozwolone'
    }
  },
  {
    id: 'borowka',
    name: 'Borówka amerykańska',
    category: 'Owoce',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'dozwolone',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'awokado',
    name: 'Awokado',
    category: 'Owoce',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'dozwolone',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zakazane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'gryka',
    name: 'Kasza gryczana biała',
    category: 'Zboża',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'dozwolone',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'migdalowe',
    name: 'Napój migdałowy',
    category: 'Nabiał i roślinne',
    statuses: {
      insulinoopornosc: 'dozwolone',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'zalecane',
      lipoedema: 'zalecane'
    }
  },
  {
    id: 'jogurt',
    name: 'Jogurt naturalny',
    category: 'Nabiał i jaja',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'ograniczone',
      hashimoto: 'dozwolone',
      nietolerancja_histaminy: 'dozwolone',
      lipoedema: 'dozwolone'
    }
  },
  {
    id: 'owies',
    name: 'Płatki owsiane',
    category: 'Zboża',
    statuses: {
      insulinoopornosc: 'ograniczone',
      niedoczynnosc_tarczycy: 'ograniczone',
      sibo: 'dozwolone',
      hashimoto: 'ograniczone',
      nietolerancja_histaminy: 'ograniczone',
      lipoedema: 'ograniczone'
    }
  },
  {
    id: 'oliwki',
    name: 'Oliwki',
    category: 'Warzywa',
    statuses: {
      insulinoopornosc: 'zalecane',
      niedoczynnosc_tarczycy: 'zalecane',
      sibo: 'zalecane',
      hashimoto: 'zalecane',
      nietolerancja_histaminy: 'ograniczone',
      lipoedema: 'zalecane'
    }
  }
];

const simState = {
  selectedAilments: new Set(['insulinoopornosc', 'hashimoto']),
  fridgeItems: new Set(['jaja', 'indyk', 'losos', 'cukinia', 'brokul', 'borowka', 'gryka', 'migdalowe'])
};

// ==========================================================
// INICJALIZACJA
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  setupDemoLinks();
  setupMockupSwitcher();
  setupCookieConsent();
  setupSimulator();
  setupForms();
  fetchWaitlistStats();
});

/**
 * Dynamiczne wyliczanie adresu Demo (app.diet-med-app) względem bieżącego hosta landing.diet-med-app
 */
function setupDemoLinks() {
  let demoUrl = (window.DIET_MED_CONFIG && window.DIET_MED_CONFIG.DEMO_URL) || 'https://app.diet-med-app.pl';
  const host = window.location.hostname || '';
  if (host.startsWith('landing.')) {
    demoUrl = `${window.location.protocol}//app.${host.slice('landing.'.length)}`;
  }

  document.querySelectorAll('[data-demo-link="true"]').forEach((link) => {
    link.setAttribute('href', demoUrl);
    link.addEventListener('click', () => {
      const eventName = link.getAttribute('data-track') || 'demo_click';
      trackEvent(eventName, { target: demoUrl });
    });
  });
}

/**
 * Przełączanie ekranów w Phone Mockup Showcase
 */
function setupMockupSwitcher() {
  const stepCards = document.querySelectorAll('.feature-step-card');
  const dots = document.querySelectorAll('.mdot');
  const screens = document.querySelectorAll('.mockup-screen');

  function activateScreen(screenKey) {
    stepCards.forEach((c) => {
      const isMatch = c.getAttribute('data-screen') === screenKey;
      c.classList.toggle('active', isMatch);
      c.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });
    dots.forEach((d) => {
      d.classList.toggle('active', d.getAttribute('data-screen') === screenKey);
    });
    screens.forEach((s) => {
      s.classList.toggle('active', s.id === `mockup-${screenKey}`);
    });
  }

  stepCards.forEach((card) => {
    card.addEventListener('click', () => activateScreen(card.getAttribute('data-screen')));
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => activateScreen(dot.getAttribute('data-screen')));
  });
}

// ==========================================================
// MINI-SYMULATOR LODÓWKI & AGENTA AI
// ==========================================================
function resolveProductStatus(product) {
  if (simState.selectedAilments.size === 0) {
    return 'dozwolone';
  }
  let highestStatus = 'zalecane';
  let highestWeight = 0;

  simState.selectedAilments.forEach((ailmentId) => {
    const st = product.statuses[ailmentId] || 'dozwolone';
    const w = STATUS_PRIORITY[st] || 2;
    if (w > highestWeight) {
      highestWeight = w;
      highestStatus = st;
    }
  });
  return highestStatus;
}

function setupSimulator() {
  const ailmentsEl = document.getElementById('simAilmentsContainer');
  const fridgeEl = document.getElementById('simFridgeContainer');
  const heightEl = document.getElementById('simHeight');
  const weightEl = document.getElementById('simWeight');
  const activityEl = document.getElementById('simActivity');
  const promptEl = document.getElementById('simPromptInput');
  const generateBtn = document.getElementById('simGenerateBtn');
  const transferBtn = document.getElementById('simTransferToConsultBtn');

  if (!ailmentsEl || !fridgeEl) return;

  function renderAilmentChips() {
    ailmentsEl.innerHTML = '';
    SIM_AILMENTS.forEach((ail) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sim-ailment-chip ${simState.selectedAilments.has(ail.id) ? 'active' : ''}`;
      btn.textContent = ail.label;
      btn.addEventListener('click', () => {
        if (simState.selectedAilments.has(ail.id)) {
          if (simState.selectedAilments.size > 1) {
            simState.selectedAilments.delete(ail.id);
          }
        } else {
          simState.selectedAilments.add(ail.id);
        }
        renderAilmentChips();
        renderFridgeGrid();
        generateSimulatedMeals();
      });
      ailmentsEl.appendChild(btn);
    });
  }

  function renderFridgeGrid() {
    fridgeEl.innerHTML = '';
    const countEl = document.getElementById('simFridgeCount');

    SIM_PRODUCTS.forEach((prod) => {
      const status = resolveProductStatus(prod);
      const isChecked = simState.fridgeItems.has(prod.id);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `sim-fridge-btn ${isChecked ? 'checked' : ''} ${status === 'zakazane' ? 'is-zakazane' : ''}`;
      btn.innerHTML = `
        <span class="sf-left">
          <span class="sf-box">${isChecked ? '✓' : ''}</span>
          <span class="sf-name">${prod.name}</span>
        </span>
        <span class="sf-status sfs-${status}">${STATUS_LABELS[status]}</span>
      `;
      btn.addEventListener('click', () => {
        if (simState.fridgeItems.has(prod.id)) {
          simState.fridgeItems.delete(prod.id);
        } else {
          simState.fridgeItems.add(prod.id);
        }
        renderFridgeGrid();
      });
      fridgeEl.appendChild(btn);
    });

    if (countEl) {
      countEl.textContent = `${simState.fridgeItems.size} zaznaczonych`;
    }
  }

  function updateBioEstimate() {
    const bioOut = document.getElementById('simBioEstimate');
    if (!bioOut || !heightEl || !weightEl || !activityEl) return;

    const h = Number(heightEl.value) || 168;
    const w = Number(weightEl.value) || 65;
    const pal = Number(activityEl.value) || 1.5;

    // Przybliżone orientacyjne zapotrzebowanie (uśrednione przed wywiadem dietetycznym)
    const approxBmr = Math.round(10 * w + 6.25 * h - 5 * 35 - 70);
    const approxTdee = Math.round(approxBmr * pal);
    bioOut.innerHTML = `
      Orientacyjne zapotrzebowanie bazowe: ok. <strong>${approxTdee - 100}–${approxTdee + 100} kcal/dzień</strong>.
      Dokładny rozkład <strong>MAKRO (B/T/W)</strong> pod Twoje schorzenia ustalisz podczas konsultacji online.
    `;
  }

  // Presety promptów
  document.querySelectorAll('.preset-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (promptEl) {
        promptEl.value = chip.getAttribute('data-prompt') || '';
      }
    });
  });

  if (heightEl) heightEl.addEventListener('input', updateBioEstimate);
  if (weightEl) weightEl.addEventListener('input', updateBioEstimate);
  if (activityEl) activityEl.addEventListener('change', updateBioEstimate);

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      trackEvent('simulator_generate', {
        ailments_count: simState.selectedAilments.size,
        fridge_count: simState.fridgeItems.size
      });
      const out = document.getElementById('simOutputBody');
      if (out) {
        out.style.opacity = '0.5';
        setTimeout(() => {
          generateSimulatedMeals();
          out.style.opacity = '1';
        }, 220);
      } else {
        generateSimulatedMeals();
      }
    });
  }

  if (transferBtn) {
    transferBtn.addEventListener('click', () => {
      const csH = document.getElementById('csHeight');
      const csW = document.getElementById('csWeight');
      const csAct = document.getElementById('csActivity');
      const csAil = document.getElementById('csAilments');

      if (csH && heightEl) csH.value = heightEl.value;
      if (csW && weightEl) csW.value = weightEl.value;
      if (csAct && activityEl) {
        const pal = Number(activityEl.value);
        csAct.value = pal <= 1.35 ? 'Niska' : (pal >= 1.7 ? 'Wysoka' : 'Umiarkowana');
      }
      if (csAil) {
        const activeNames = SIM_AILMENTS
          .filter((a) => simState.selectedAilments.has(a.id))
          .map((a) => a.label);
        csAil.value = `Prośba o ustalenie MAKRO przy: ${activeNames.join(', ')}.`;
      }
      const zapisSection = document.getElementById('zapis');
      if (zapisSection) {
        zapisSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  renderAilmentChips();
  renderFridgeGrid();
  updateBioEstimate();
  generateSimulatedMeals();
}

function generateSimulatedMeals() {
  const outEl = document.getElementById('simOutputBody');
  if (!outEl) return;

  const safeInFridge = [];
  const rejectedInFridge = [];

  SIM_PRODUCTS.forEach((prod) => {
    if (!simState.fridgeItems.has(prod.id)) return;
    const status = resolveProductStatus(prod);
    if (status === 'zakazane') {
      rejectedInFridge.push(prod.name);
    } else {
      safeInFridge.push({ ...prod, resolvedStatus: status });
    }
  });

  const has = (id) => safeInFridge.some((p) => p.id === id);

  // Inteligentne komponowanie 4 posiłków z bezpiecznych składników w lodówce
  let meal1;
  if (has('jaja') && has('cukinia')) {
    meal1 = {
      title: 'Omlet ziołowy z cukinią' + (has('szpinak') ? ' i garścią szpinaku' : ''),
      ing: 'Jaja kurze, cukinia, oliwa / zioła' + (has('oliwki') ? ', kilka oliwek (wg limitu)' : '')
    };
  } else if (has('owies') && has('borowka')) {
    meal1 = {
      title: 'Ciepła owsianka na napoju roślinnym z borówkami',
      ing: 'Płatki owsiane (porcja kontrolowana), borówka amerykańska' + (has('migdalowe') ? ', napój migdałowy' : '')
    };
  } else {
    meal1 = {
      title: 'Jajecznica lub pasta jajeczna z bezpiecznymi warzywami',
      ing: safeInFridge.slice(0, 3).map((p) => p.name).join(', ') || 'Zaznacz min. 2 bezpieczne produkty w lodówce'
    };
  }

  let meal2;
  if (has('migdalowe') && has('borowka')) {
    meal2 = {
      title: 'Koktajl migdałowo-borówkowy o niskim ładunku glikemicznym',
      ing: 'Napój migdałowy, borówka amerykańska' + (has('awokado') ? ', 1/4 awokado' : '')
    };
  } else if (has('jogurt') && has('borowka')) {
    meal2 = {
      title: 'Lekki jogurt naturalny z borówkami amerykańskimi',
      ing: 'Jogurt naturalny (zgodny z limitem porcji), borówka amerykańska'
    };
  } else {
    meal2 = {
      title: 'Lekka przekąska warzywno-owocowa na bazie bazy DIET-MED',
      ing: has('borowka') ? 'Borówka amerykańska + garść bezpiecznych pestek' : 'Bezpieczne warzywa chrupkie z Twojego profilu'
    };
  }

  let meal3;
  if (has('indyk') || has('kurczak')) {
    const meat = has('indyk') ? 'Indyk (pierś)' : 'Kurczak';
    const carb = has('gryka') ? 'biała kasza gryczana' : 'komosa lub warzywa korzeniowe';
    const veg = has('brokul') ? 'różyczki brokułu na parze' : (has('cukinia') ? 'duszona cukinia' : 'mix dozwolonych warzyw');
    meal3 = {
      title: `Duszony ${meat.toLowerCase()} z ${carb}`,
      ing: `${meat}, ${carb}, ${veg}`
    };
  } else if (has('losos')) {
    meal3 = {
      title: 'Łosoś pieczony w ziołach z kaszą gryczaną i warzywami',
      ing: 'Łosoś świeży, ' + (has('gryka') ? 'kasza gryczana biała, ' : '') + (has('brokul') ? 'brokuł' : 'cukinia')
    };
  } else {
    meal3 = {
      title: 'Ciepłe danie obiadowe z bezpiecznego białka i warzyw',
      ing: safeInFridge.slice(0, 4).map((p) => p.name).join(', ') || 'Dodaj źródło białka (np. indyk, łosoś) do lodówki'
    };
  }

  let meal4;
  if (has('losos') && has('cukinia')) {
    meal4 = {
      title: 'Ciepła sałatka kolacyjna z pieczonym łososiem i cukinią',
      ing: 'Łosoś świeży, grillowana cukinia' + (has('szpinak') ? ', liście szpinaku' : '')
    };
  } else if (has('jaja') && has('brokul')) {
    meal4 = {
      title: 'Lekka zapiekanka jajeczno-brokułowa na kolację',
      ing: 'Jaja kurze, brokuł, przyprawy przeciwzapalne'
    };
  } else {
    meal4 = {
      title: 'Lekkostrawna kolacja z bezpiecznych produktów z lodówki',
      ing: safeInFridge.slice(-3).map((p) => p.name).join(', ') || 'Zaznacz produkty w kroku 2 powyżej'
    };
  }

  const promptText = (document.getElementById('simPromptInput')?.value || '').trim();
  const activeAilmentLabels = SIM_AILMENTS
    .filter((a) => simState.selectedAilments.has(a.id))
    .map((a) => a.label)
    .join(' + ');

  let html = '';

  if (rejectedInFridge.length > 0) {
    html += `
      <div class="sim-warning-box">
        <strong>Ochrona wielochorobowości:</strong> Agent AI automatycznie pominął produkty zaznaczone w lodówce, ponieważ w profilu (<em>${activeAilmentLabels}</em>) są <strong>ZAKAZANE</strong>:
        <strong>${rejectedInFridge.join(', ')}</strong>.
      </div>
    `;
  }

  const meals = [
    { slot: 'Posiłek 1 • Śniadanie', ...meal1 },
    { slot: 'Posiłek 2 • II Śniadanie', ...meal2 },
    { slot: 'Posiłek 3 • Obiad', ...meal3 },
    { slot: 'Posiłek 4 • Kolacja', ...meal4 }
  ];

  meals.forEach((m) => {
    html += `
      <div class="sim-meal-card">
        <div class="sim-meal-head">
          <span class="sim-meal-slot">${m.slot}</span>
          <span class="sim-meal-tag">✓ Bezpieczne dla profilu</span>
        </div>
        <div class="sim-meal-title">${escapeHtml(m.title)}</div>
        <div class="sim-meal-ing"><strong>Składniki:</strong> ${escapeHtml(m.ing)}</div>
      </div>
    `;
  });

  if (promptText) {
    html += `<div style="font-size:11.5px; color:#64748b; text-align:right;">Wygenerowano dla komendy: „${escapeHtml(promptText)}”</div>`;
  }

  outEl.innerHTML = html;
}

// ==========================================================
// OBSŁUGA FORMULARZY (FASTAPI + POSTGRESQL)
// ==========================================================
async function fetchWaitlistStats() {
  const countEl = document.getElementById('waitlistTotalCount');
  if (!countEl) return;

  try {
    const res = await fetch('/api/waitlist/stats');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    countEl.textContent = data.total_count ?? 0;
  } catch {
    countEl.textContent = '0';
  }
}

function setupForms() {
  const waitlistForm = document.getElementById('waitlistForm');
  const consultForm = document.getElementById('consultForm');

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('wlEmail').value.trim();
      const name = document.getElementById('wlName').value.trim();
      const platform = document.getElementById('wlPlatform').value;
      const ailments = document.getElementById('wlAilments').value.trim();
      const rodo = document.getElementById('wlRodo').checked;
      const marketing = document.getElementById('wlMarketing').checked;
      const feedback = document.getElementById('wlFeedback');
      const submitBtn = document.getElementById('wlSubmitBtn');

      if (!email) {
        return showFeedback(feedback, 'Podaj poprawny adres e-mail.', 'error');
      }
      if (!rodo) {
        return showFeedback(feedback, 'Zaznacz wymaganą akceptację Polityki Prywatności (RODO).', 'error');
      }

      try {
        submitBtn.disabled = true;
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: name || null,
            platform,
            ailments_interest: ailments || null,
            rodo_accepted: rodo,
            marketing_accepted: marketing,
            source: 'landing_page'
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || `Błąd serwera (${res.status})`);
        }
        showFeedback(feedback, data.message, 'success');
        const countEl = document.getElementById('waitlistTotalCount');
        if (countEl && data.total_count !== undefined) {
          countEl.textContent = data.total_count;
        }
        trackEvent('waitlist_submit', { platform });
        if (!data.already_registered) {
          waitlistForm.reset();
        }
      } catch (err) {
        showFeedback(feedback, err.message || 'Wystąpił błąd podczas zapisu.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  if (consultForm) {
    consultForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('csName').value.trim();
      const email = document.getElementById('csEmail').value.trim();
      const phone = document.getElementById('csPhone').value.trim();
      const contactType = document.getElementById('csContactType').value;
      const heightVal = document.getElementById('csHeight').value;
      const weightVal = document.getElementById('csWeight').value;
      const activity = document.getElementById('csActivity').value;
      const message = document.getElementById('csAilments').value.trim();
      const rodo = document.getElementById('csRodo').checked;
      const feedback = document.getElementById('csFeedback');
      const submitBtn = document.getElementById('csSubmitBtn');

      if (name.length < 2) {
        return showFeedback(feedback, 'Podaj imię i nazwisko.', 'error');
      }
      if (!email) {
        return showFeedback(feedback, 'Podaj poprawny adres e-mail.', 'error');
      }
      if (!rodo) {
        return showFeedback(feedback, 'Zaznacz akceptację Polityki Prywatności (RODO).', 'error');
      }

      try {
        submitBtn.disabled = true;
        const res = await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone: phone || null,
            height_cm: heightVal ? Number(heightVal) : null,
            weight_kg: weightVal ? Number(weightVal) : null,
            activity_level: activity || null,
            ailments_note: null,
            message: message || null,
            preferred_contact: contactType,
            rodo_accepted: rodo
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || `Błąd serwera (${res.status})`);
        }
        showFeedback(feedback, data.message, 'success');
        trackEvent('consultation_submit', { preferred_contact: contactType });
        consultForm.reset();
      } catch (err) {
        showFeedback(feedback, err.message || 'Nie udało się wysłać zgłoszenia.', 'error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
}

function showFeedback(el, text, type) {
  if (!el) return;
  el.textContent = text;
  el.className = `form-feedback ${type}`;
  el.style.display = 'block';
}

// ==========================================================
// COOKIES & ANALITYKA (GA4 / META PIXEL)
// ==========================================================
const COOKIE_CONSENT_KEY = 'diet_med_landing_cookie_consent';

function setupCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAcceptBtn');
  const rejectBtn = document.getElementById('cookieRejectBtn');
  const resetBtn = document.getElementById('resetCookieConsentBtn');

  const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!saved && banner) {
    banner.style.display = 'block';
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
      if (banner) banner.style.display = 'none';
      initOptionalAnalytics();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
      if (banner) banner.style.display = 'none';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      alert('Preferencje plików cookies zostały zresetowane. Wybór pojawi się ponownie przy kolejnym odwiedzeniu strony głównej.');
    });
  }

  if (saved === 'all') {
    initOptionalAnalytics();
  }
}

function initOptionalAnalytics() {
  const cfg = window.DIET_MED_CONFIG || {};
  // Jeśli w DIET_MED_CONFIG podano GA4_ID i nie ma jeszcze skryptu gtag, można go tu doładować dynamicznie
  if (cfg.GA4_ID && typeof window.gtag !== 'function') {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.GA4_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.GA4_ID, { anonymize_ip: true });
  }
}

function trackEvent(eventName, params = {}) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }
  } catch {
    // Brak aktywnej analityki nie może blokować interfejsu użytkownika
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
