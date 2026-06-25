/* ==========================================================
   AgriSmart Advisor — application logic
   All "AI" here is deterministic rule-based mock logic over
   sample/randomized data — there is no real model or live API.
   ========================================================== */

const state = {
  farmer: {},
  water: {},
  soil: {},
  crops: [],
  diary: [],
};

const SAMPLE_FARM = {
  farmer: { name: 'Ramesh Kumar', lang: 'English', stateName: 'Haryana', district: 'Karnal', village: 'Nilokheri', gps: '29.7°N, 76.9°E' },
  landArea: 3.5, numFields: 2, currentCrops: 'Wheat, Mustard', method: 'Organic',
  water: { sources: ['Borewell', 'Canal'], yearRound: 'seasonal', freq: 'alternate', reliability: 'medium', quality: 'good' },
  soil: { n: 240, p: 18, k: 165, ph: 6.8, oc: 0.6, moisture: 22 },
};

/* ---------------- Utility ---------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmtINR = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ===========================================================
   ONBOARDING
   =========================================================== */
let currentStep = 1;
const TOTAL_STEPS = 4;

function goToStep(step) {
  currentStep = step;
  $$('.onb-step').forEach(el => el.classList.toggle('is-active', Number(el.dataset.step) === step));
  $('#onbFill').style.width = `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`;
  $('#onbStepLabel').textContent = `Step ${step} of ${TOTAL_STEPS}`;
}

$('#startOnboarding').addEventListener('click', () => goToStep(2));
$('#skipOnboarding').addEventListener('click', () => {
  loadSampleFarm();
  enterDashboard();
});

$$('[data-back]').forEach(btn => btn.addEventListener('click', () => goToStep(Math.max(1, currentStep - 1))));

// Choice chip selection (single-select for farming method, multi-select for water source)
$('#farmingMethod').addEventListener('click', (e) => {
  const chip = e.target.closest('.choice-chip');
  if (!chip) return;
  $$('#farmingMethod .choice-chip').forEach(c => c.classList.remove('is-selected'));
  chip.classList.add('is-selected');
});
$('#waterSource').addEventListener('click', (e) => {
  const chip = e.target.closest('.choice-chip');
  if (!chip) return;
  chip.classList.toggle('is-selected');
});

// GPS button (mock geolocation)
$('#gpsBtn').addEventListener('click', () => {
  const btn = $('#gpsBtn');
  $('#gpsLabel').textContent = 'Locating…';
  setTimeout(() => {
    $('#gpsLabel').textContent = 'Location captured ✓';
    btn.classList.add('is-confirmed');
  }, 800);
});

// Soil mode toggle (manual vs upload)
$$('.toggle-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.toggle-tab').forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    const mode = tab.dataset.mode;
    $$('.soil-mode').forEach(panel => {
      panel.hidden = panel.dataset.modePanel !== mode;
    });
  });
});

// Mock soil report "scan"
$('#soilFileInput').addEventListener('change', () => {
  const result = $('#uploadResult');
  result.hidden = false;
  result.textContent = 'Reading report…';
  setTimeout(() => {
    const mock = { n: 210, p: 15, k: 140, ph: 6.4, oc: 0.52 };
    result.textContent = `Extracted: N ${mock.n} kg/ha · P ${mock.p} kg/ha · K ${mock.k} kg/ha · pH ${mock.ph} · OC ${mock.oc}%`;
    $('#soilN').value = mock.n; $('#soilP').value = mock.p; $('#soilK').value = mock.k;
    $('#soilPH').value = mock.ph; $('#soilOC').value = mock.oc;
  }, 1100);
});

// Live soil validation as user types pH
function renderSoilValidation() {
  const ph = parseFloat($('#soilPH').value);
  const n = parseFloat($('#soilN').value);
  const box = $('#soilValidation');
  box.innerHTML = '';
  const pills = [];

  if (!isNaN(ph)) {
    if (ph < 5.5) {
      pills.push(`<div class="validation-pill warn"><span>⚠️</span><span><b>Highly acidic soil detected.</b> Recommended: agricultural lime application, slaked lime usage, or organic soil-improvement practices before sowing.</span></div>`);
    } else if (ph > 8.5) {
      pills.push(`<div class="validation-pill warn"><span>⚠️</span><span><b>Highly alkaline soil detected.</b> Recommended: organic matter addition, compost application, and soil-balancing methods.</span></div>`);
    } else {
      pills.push(`<div class="validation-pill good"><span>✓</span><span>pH ${ph} is in a healthy range for most crops.</span></div>`);
    }
  }
  if (!isNaN(n) && n < 200) {
    pills.push(`<div class="validation-pill info"><span>ℹ️</span><span>Nitrogen reading is on the lower side. Consider organic nitrogen sources (compost, green manure) before your next sowing.</span></div>`);
  }
  box.innerHTML = pills.join('');
}
['soilPH', 'soilN'].forEach(id => $('#' + id).addEventListener('input', renderSoilValidation));

// Step 2 submit
$('#formPersonal').addEventListener('submit', (e) => {
  e.preventDefault();
  state.farmer = {
    name: $('#farmerName').value.trim() || 'Farmer',
    lang: $('#farmerLang').value,
    stateName: $('#farmerState').value.trim(),
    district: $('#farmerDistrict').value.trim(),
    village: $('#farmerVillage').value.trim(),
    gps: $('#gpsLabel').textContent.includes('captured') ? 'Captured' : 'Not set',
  };
  state.landArea = parseFloat($('#landArea').value) || 1;
  state.numFields = parseInt($('#numFields').value) || 1;
  state.currentCrops = $('#currentCrops').value.trim() || 'Wheat';
  const methodChip = $('#farmingMethod .choice-chip.is-selected');
  state.method = methodChip ? methodChip.dataset.value : 'Organic';
  goToStep(3);
});

// Step 3 submit
$('#formWater').addEventListener('submit', (e) => {
  e.preventDefault();
  const sources = $$('#waterSource .choice-chip.is-selected').map(c => c.dataset.value);
  state.water = {
    sources: sources.length ? sources : ['Rain-fed'],
    yearRound: $('#waterYearRound').value,
    freq: $('#irrigationFreq').value,
    reliability: $('#waterReliability').value,
    quality: $('#waterQuality').value,
  };
  goToStep(4);
});

// Step 4 submit -> build everything & launch dashboard
$('#formSoil').addEventListener('submit', (e) => {
  e.preventDefault();
  state.soil = {
    n: parseFloat($('#soilN').value) || 220,
    p: parseFloat($('#soilP').value) || 16,
    k: parseFloat($('#soilK').value) || 150,
    ph: parseFloat($('#soilPH').value) || 6.7,
    oc: parseFloat($('#soilOC').value) || 0.55,
    moisture: parseFloat($('#soilMoisture').value) || 20,
  };
  enterDashboard();
});

function loadSampleFarm() {
  state.farmer = SAMPLE_FARM.farmer;
  state.landArea = SAMPLE_FARM.landArea;
  state.numFields = SAMPLE_FARM.numFields;
  state.currentCrops = SAMPLE_FARM.currentCrops;
  state.method = SAMPLE_FARM.method;
  state.water = SAMPLE_FARM.water;
  state.soil = SAMPLE_FARM.soil;
}

/* ===========================================================
   DASHBOARD ENTRY
   =========================================================== */
function enterDashboard() {
  $('#onboarding').style.display = 'none';
  $('#dashboard').hidden = false;

  buildCrops();
  renderGreeting();
  renderHealthScore();
  renderAdvice();
  renderCropStatus();
  renderWeather();
  renderMarket();
  renderIrrigation();
  renderSoilSnapshot();
  renderSchemes();
  renderDiary();
  seedVoiceChat();
}

$('#editProfileBtn').addEventListener('click', () => {
  $('#dashboard').hidden = true;
  $('#onboarding').style.display = 'block';
  goToStep(1);
});

function renderGreeting() {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  $('#dashGreeting').textContent = `${part}, ${state.farmer.name.split(' ')[0]}`;
  $('#dashFarmMeta').textContent = `${state.numFields} field${state.numFields > 1 ? 's' : ''} · ${state.landArea} acres · ${state.farmer.district || 'Your district'}, ${state.farmer.stateName || ''}`;
  $('#weatherLocation').textContent = state.farmer.district || 'Your area';
}

/* ===========================================================
   CROP LIFECYCLE — mock timeline generator
   =========================================================== */
const CROP_LIBRARY = {
  Wheat: { stages: ['Seed prep', 'Germination', 'Tillering', 'Flowering', 'Grain fill', 'Harvest'], cycleDays: 130 },
  Mustard: { stages: ['Seed prep', 'Germination', 'Vegetative', 'Flowering', 'Pod fill', 'Harvest'], cycleDays: 100 },
  Rice: { stages: ['Nursery', 'Transplant', 'Tillering', 'Flowering', 'Grain fill', 'Harvest'], cycleDays: 120 },
  Cotton: { stages: ['Sowing', 'Squaring', 'Flowering', 'Boll dev.', 'Boll opening', 'Harvest'], cycleDays: 165 },
};

function buildCrops() {
  const names = state.currentCrops.split(',').map(s => s.trim()).filter(Boolean);
  state.crops = names.map(name => {
    const lib = CROP_LIBRARY[name] || CROP_LIBRARY.Wheat;
    const daysIn = Math.floor(Math.random() * (lib.cycleDays * 0.7)) + 15;
    const stageIdx = clamp(Math.floor((daysIn / lib.cycleDays) * lib.stages.length), 0, lib.stages.length - 1);
    return {
      name,
      stages: lib.stages,
      stageIdx,
      daysIn,
      cycleDays: lib.cycleDays,
      progressPct: Math.round((daysIn / lib.cycleDays) * 100),
      expectedYield: Math.round((1.4 + Math.random() * 0.8) * state.landArea * 100) / 100, // tons (mock)
      health: ['Good', 'Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 4)],
    };
  });
  if (!state.crops.length) state.crops = [{ name: 'Wheat', ...CROP_LIBRARY.Wheat, stageIdx: 2, daysIn: 60, cycleDays: 130, progressPct: 46, expectedYield: 4.2, health: 'Good' }];

  const sel = $('#cropSelector');
  sel.innerHTML = state.crops.map((c, i) => `<option value="${i}">${c.name}</option>`).join('');
  sel.addEventListener('change', renderCropStatus);
}

/* ===========================================================
   FARM HEALTH SCORE
   =========================================================== */
function computeHealthScore() {
  let soilScore = 100;
  if (state.soil.ph < 5.5 || state.soil.ph > 8.5) soilScore -= 25;
  if (state.soil.n < 200) soilScore -= 10;
  if (state.soil.oc < 0.5) soilScore -= 10;
  soilScore = clamp(soilScore, 30, 100);

  const waterScoreMap = { high: 95, medium: 78, low: 55 };
  const waterScore = waterScoreMap[state.water.reliability] || 70;

  const weatherScore = 82; // mock, no severe alerts today baseline
  const cropScore = state.crops.length ? clamp(80 + (state.crops[0].health === 'Excellent' ? 12 : state.crops[0].health === 'Fair' ? -10 : 4), 40, 100) : 80;
  const marketScore = 74;

  const overall = Math.round(soilScore * 0.25 + waterScore * 0.2 + weatherScore * 0.2 + cropScore * 0.2 + marketScore * 0.15);
  return { overall, soilScore, waterScore, weatherScore, cropScore, marketScore };
}

function renderHealthScore() {
  const s = computeHealthScore();
  $('#healthScoreValue').textContent = s.overall;

  const arc = $('#gaugeArcSoil');
  const totalLen = 251.3; // path length for the semicircle at r=80
  const offset = totalLen * (1 - s.overall / 100);
  arc.style.strokeDashoffset = offset;
  arc.style.stroke = s.overall >= 75 ? 'var(--leaf-500)' : s.overall >= 50 ? 'var(--gold-500)' : 'var(--terracotta)';
  arc.style.transition = 'stroke-dashoffset 1s ease, stroke 0.4s ease';

  const rows = [
    ['Soil', s.soilScore, '#7FA66B'],
    ['Water', s.waterScore, '#5B8FBF'],
    ['Weather', s.weatherScore, '#D4A24C'],
    ['Crop', s.cropScore, '#9BC282'],
    ['Market', s.marketScore, '#C2483D'],
  ];
  $('#healthBreakdown').innerHTML = rows.map(([label, val, color]) => `
    <div class="hb-row">
      <span class="hb-dot" style="background:${color}"></span>
      <span style="width:52px;flex-shrink:0;">${label}</span>
      <span class="hb-bar-track"><span class="hb-bar-fill" style="width:${val}%;background:${color}"></span></span>
      <span class="hb-val">${val}</span>
    </div>
  `).join('');
}

/* ===========================================================
   TODAY'S ADVICE — rule-based
   =========================================================== */
function renderAdvice() {
  const advice = [];
  const w = mockWeatherToday();

  if (w.rainChance > 60) {
    advice.push({ icon: '🌧️', priority: 'high', text: `Heavy rainfall expected ${w.rainTiming}. <b>Delay any organic fertilizer or Jeevamrit application</b> until conditions clear.` });
  }
  if (state.soil.ph < 5.5) {
    advice.push({ icon: '🧪', priority: 'high', text: `Your soil pH (${state.soil.ph}) is acidic. <b>Apply agricultural lime</b> before your next sowing cycle.` });
  } else if (state.soil.ph > 8.5) {
    advice.push({ icon: '🧪', priority: 'high', text: `Your soil pH (${state.soil.ph}) is alkaline. <b>Add compost or organic matter</b> to balance it.` });
  }
  if (state.soil.n < 200) {
    advice.push({ icon: '🌱', priority: 'medium', text: `Nitrogen levels are below optimal. <b>Apply organic nitrogen sources</b> before your next growth stage.` });
  }
  if (state.water.reliability === 'low') {
    advice.push({ icon: '💧', priority: 'medium', text: `Your water source reliability is low this season. <b>Prioritize irrigation for flowering-stage crops</b> first.` });
  }
  if (w.tempMax > 38) {
    advice.push({ icon: '🌡️', priority: 'medium', text: `High temperatures expected (${w.tempMax}°C). <b>Irrigate early morning or evening</b> to reduce water loss.` });
  }
  advice.push({ icon: '📈', priority: 'low', text: `Mandi prices for your main crop have trended upward this week — <b>consider waiting 3–4 days</b> before selling.` });

  $('#adviceList').innerHTML = advice.slice(0, 5).map(a => `
    <div class="advice-item priority-${a.priority}">
      <span class="advice-icon">${a.icon}</span>
      <span class="advice-text">${a.text}</span>
    </div>
  `).join('');
}

/* ===========================================================
   CROP STATUS
   =========================================================== */
function renderCropStatus() {
  const idx = parseInt($('#cropSelector').value || 0);
  const crop = state.crops[idx] || state.crops[0];
  if (!crop) return;

  $('#cropStageTrack').innerHTML = crop.stages.map((stage, i) => {
    const isDone = i < crop.stageIdx;
    const isCurrent = i === crop.stageIdx;
    const dotClass = isDone ? 'is-done' : isCurrent ? 'is-current' : '';
    const lineClass = i < crop.stageIdx ? 'is-done' : '';
    return `
      <div class="stage-dot-wrap">
        <div class="stage-dot ${dotClass}"></div>
        <span class="stage-label ${isCurrent ? 'is-current' : ''}">${stage}</span>
      </div>
      ${i < crop.stages.length - 1 ? `<div class="stage-line ${lineClass}"></div>` : ''}
    `;
  }).join('');

  $('#cropMetaRow').innerHTML = `
    <div class="crop-meta-item"><span class="crop-meta-label">Growth progress</span><span class="crop-meta-value">${crop.progressPct}%</span></div>
    <div class="crop-meta-item"><span class="crop-meta-label">Crop health</span><span class="crop-meta-value">${crop.health}</span></div>
    <div class="crop-meta-item"><span class="crop-meta-label">Days into cycle</span><span class="crop-meta-value">${crop.daysIn} / ${crop.cycleDays}</span></div>
    <div class="crop-meta-item"><span class="crop-meta-label">Expected yield</span><span class="crop-meta-value">${crop.expectedYield} t</span></div>
  `;
}

/* ===========================================================
   WEATHER — mock generator (deterministic per session)
   =========================================================== */
let _weatherCache = null;
function mockWeatherToday() {
  if (_weatherCache) return _weatherCache;
  _weatherCache = {
    tempNow: 27 + Math.round(Math.random() * 8),
    tempMax: 32 + Math.round(Math.random() * 9),
    condition: ['Partly cloudy', 'Clear skies', 'Humid', 'Overcast'][Math.floor(Math.random() * 4)],
    rainChance: Math.round(Math.random() * 100),
    rainTiming: ['this afternoon', 'tomorrow morning', 'within 24 hours', 'by evening'][Math.floor(Math.random() * 4)],
    humidity: 50 + Math.round(Math.random() * 35),
  };
  return _weatherCache;
}

function renderWeather() {
  const w = mockWeatherToday();
  $('#weatherNow').innerHTML = `
    <span class="weather-temp">${w.tempNow}°</span>
    <span class="weather-desc">
      <span class="weather-desc-main">${w.condition}</span>
      <span class="weather-desc-sub">Humidity ${w.humidity}% · High ${w.tempMax}°C</span>
    </span>
  `;

  const alerts = [];
  if (w.rainChance > 60) alerts.push({ severe: false, text: `Rain expected ${w.rainTiming} (${w.rainChance}% chance). Avoid spraying fertilizer today.` });
  if (w.tempMax > 40) alerts.push({ severe: true, text: `Heat alert: ${w.tempMax}°C expected. Irrigate early morning to protect crop roots.` });
  if (w.humidity > 75) alerts.push({ severe: false, text: `High humidity raises fungal disease risk — inspect leaves for early signs.` });
  if (!alerts.length) alerts.push({ severe: false, text: `No significant weather risks for your fields today.` });

  $('#weatherAlerts').innerHTML = alerts.map(a => `<div class="weather-alert ${a.severe ? 'severe' : ''}">⚠️ ${a.text}</div>`).join('');

  const days = ['Today', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const icons = ['☀️', '⛅', '🌧️', '☁️', '☀️', '⛅', '🌦️'];
  $('#forecastStrip').innerHTML = days.map((d, i) => `
    <div class="forecast-day">
      <span class="forecast-day-label">${d}</span>
      <span class="forecast-day-icon">${icons[i]}</span>
      <span class="forecast-day-temp">${28 + Math.round(Math.sin(i) * 4)}°</span>
    </div>
  `).join('');
}

/* ===========================================================
   MARKET INTELLIGENCE
   =========================================================== */
function renderMarket() {
  const basePrice = 2380; // ₹/quintal mock
  const trend = [];
  let price = basePrice - 120;
  for (let i = 0; i < 7; i++) {
    price += Math.round((Math.random() - 0.3) * 40);
    trend.push(price);
  }
  const current = trend[trend.length - 1];
  const delta = current - trend[0];
  const deltaPct = ((delta / trend[0]) * 100).toFixed(1);

  $('#marketPriceRow').innerHTML = `
    <span class="market-price">₹${current}</span>
    <span class="market-unit">/quintal</span>
    <span class="market-delta ${delta >= 0 ? 'up' : 'down'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(deltaPct)}%</span>
  `;

  const max = Math.max(...trend), min = Math.min(...trend);
  const pts = trend.map((p, i) => {
    const x = (i / (trend.length - 1)) * 300 + 10;
    const y = 75 - ((p - min) / (max - min || 1)) * 60;
    return `${x},${y}`;
  });
  $('#marketTrendSvg').innerHTML = `
    <polyline points="${pts.join(' ')}" fill="none" stroke="${delta >= 0 ? '#7FA66B' : '#C2483D'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(p => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="2.5" fill="${delta >= 0 ? '#7FA66B' : '#C2483D'}"/>`).join('')}
  `;

  $('#marketRecommendation').textContent = delta >= 0
    ? `Market prices are trending up this week. Waiting 3–4 days may provide better returns for your ${state.crops[0]?.name || 'crop'}.`
    : `Prices have softened this week. If storage allows, holding a few more days could be worthwhile — otherwise selling now avoids further dips.`;
}

/* ===========================================================
   IRRIGATION ADVISOR
   =========================================================== */
function renderIrrigation() {
  const w = mockWeatherToday();
  const box = $('#irrigationStatus');
  const shouldSkip = w.rainChance > 55;
  box.className = `irrigation-status ${shouldSkip ? '' : 'do-irrigate'}`;
  box.innerHTML = shouldSkip
    ? `<span class="irrigation-icon">🌧️</span><span class="irrigation-headline">Do not irrigate today. Rain expected ${w.rainTiming} (${w.rainChance}% chance).</span>`
    : `<span class="irrigation-icon">💧</span><span class="irrigation-headline">Your ${state.crops[0]?.name || 'crop'} requires irrigation within the next 1–2 days.</span>`;

  const isDrip = state.water.sources.includes('Drip');
  $('#irrigationMeta').innerHTML = isDrip
    ? `<div>Frequency<b>Daily, 25 min</b></div><div>Water need<b>~12 mm</b></div><div>Source<b>Drip</b></div>`
    : `<div>Soil moisture<b>${state.soil.moisture}%</b></div><div>Next check<b>${shouldSkip ? '2 days' : 'Tomorrow'}</b></div><div>Source<b>${state.water.sources[0]}</b></div>`;
}

/* ===========================================================
   SOIL SNAPSHOT
   =========================================================== */
function renderSoilSnapshot() {
  const s = state.soil;
  const bars = [
    ['Nitrogen', s.n, 400, '#7FA66B'],
    ['Phosphorus', s.p, 30, '#D4A24C'],
    ['Potassium', s.k, 280, '#9BC282'],
    ['pH', s.ph, 14, '#5B8FBF'],
    ['Org. carbon', s.oc, 1.2, '#C2483D'],
  ];
  $('#soilBars').innerHTML = bars.map(([label, val, max, color]) => `
    <div class="soil-bar-row">
      <span class="soil-bar-label">${label}</span>
      <span class="soil-bar-track"><span class="soil-bar-fill" style="width:${clamp((val / max) * 100, 4, 100)}%;background:${color}"></span></span>
      <span class="soil-bar-val">${val}</span>
    </div>
  `).join('');
}

$('#viewSoilDetail').addEventListener('click', () => {
  renderSoilValidation();
  alert(`Full soil report:\nN: ${state.soil.n} kg/ha\nP: ${state.soil.p} kg/ha\nK: ${state.soil.k} kg/ha\npH: ${state.soil.ph}\nOrganic carbon: ${state.soil.oc}%\nMoisture: ${state.soil.moisture}%`);
});

/* ===========================================================
   DISEASE DETECTION — mock "AI" with simulated compression
   =========================================================== */
const DISEASE_LIBRARY = [
  { name: 'Leaf rust', severity: 'Moderate', treatment: 'Spray neem-based organic fungicide every 5 days; remove affected leaves.' },
  { name: 'Nitrogen deficiency', severity: 'Mild', treatment: 'Apply compost tea or vermicompost within the next week.' },
  { name: 'Aphid infestation', severity: 'Mild', treatment: 'Introduce ladybird beetles or spray neem oil solution.' },
  { name: 'Healthy — no issues detected', severity: 'None', treatment: 'No action needed. Continue regular monitoring.' },
];

$('#diseaseFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const resultBox = $('#diseaseResult');
  resultBox.hidden = false;
  resultBox.className = 'disease-result is-loading';
  resultBox.innerHTML = `<span class="spinner"></span> Compressing image for upload (resizing to 800px, ~70% quality)…`;

  // Simulate client-side compression step, then mock "AI" analysis
  setTimeout(() => {
    resultBox.innerHTML = `<span class="spinner"></span> Analyzing crop image…`;
    setTimeout(() => {
      const diagnosis = DISEASE_LIBRARY[Math.floor(Math.random() * DISEASE_LIBRARY.length)];
      const confidence = 78 + Math.round(Math.random() * 18);
      resultBox.className = 'disease-result';
      resultBox.innerHTML = `
        <span class="disease-result-title">${diagnosis.name}</span>
        <span class="confidence-tag">Confidence: ${confidence}% · Severity: ${diagnosis.severity}</span>
        <p style="margin-top:8px;">${diagnosis.treatment}</p>
      `;
    }, 1300);
  }, 900);
});

/* ===========================================================
   PROFIT SIMULATOR
   =========================================================== */
$('#calcProfitBtn').addEventListener('click', () => {
  const seed = parseFloat($('#pcSeed').value) || 0;
  const labour = parseFloat($('#pcLabour').value) || 0;
  const organic = parseFloat($('#pcOrganic').value) || 0;
  const irrigation = parseFloat($('#pcIrrigation').value) || 0;
  const yieldKg = parseFloat($('#pcYield').value) || 0;
  const price = parseFloat($('#pcPrice').value) || 0;

  const totalCost = seed + labour + organic + irrigation;
  const income = yieldKg * price;
  const profit = income - totalCost;

  const box = $('#profitResult');
  box.hidden = false;
  box.innerHTML = `
    <div class="profit-row"><span>Total investment</span><b>${fmtINR(totalCost)}</b></div>
    <div class="profit-row"><span>Expected income</span><b>${fmtINR(income)}</b></div>
    <div class="profit-row total"><span>Estimated profit</span><b>${fmtINR(profit)}</b></div>
  `;
});

/* ===========================================================
   VOICE ASSISTANT (mock rule-based responder)
   =========================================================== */
function seedVoiceChat() {
  $('#voiceChat').innerHTML = `<div class="voice-msg bot">Namaste ${state.farmer.name.split(' ')[0]}! Ask me anything about your farm — irrigation, weather, disease, or mandi prices.</div>`;
  $('#voiceSuggestions').innerHTML = ['What should I do today?', 'When should I irrigate?', "What's today's mandi price?", 'Is my soil healthy?']
    .map(q => `<button type="button" class="voice-suggestion-chip">${q}</button>`).join('');
}

function addVoiceMsg(text, who) {
  const chat = $('#voiceChat');
  const div = document.createElement('div');
  div.className = `voice-msg ${who}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function answerVoiceQuery(q) {
  const lower = q.toLowerCase();
  const w = mockWeatherToday();
  if (lower.includes('today') || lower.includes('do today')) {
    return $('#adviceList').children[0]?.textContent.trim() || "Check today's advice card for your top priority right now.";
  }
  if (lower.includes('irrigat')) {
    return w.rainChance > 55
      ? `Skip irrigation — rain is expected ${w.rainTiming} (${w.rainChance}% chance).`
      : `Your ${state.crops[0]?.name || 'crop'} needs irrigation in the next 1–2 days.`;
  }
  if (lower.includes('mandi') || lower.includes('price') || lower.includes('sell')) {
    return $('#marketRecommendation').textContent;
  }
  if (lower.includes('soil')) {
    return state.soil.ph < 5.5 ? `Your soil is acidic (pH ${state.soil.ph}). Add agricultural lime before sowing.`
      : state.soil.ph > 8.5 ? `Your soil is alkaline (pH ${state.soil.ph}). Add organic matter to balance it.`
      : `Your soil pH (${state.soil.ph}) is healthy. Nitrogen is at ${state.soil.n} kg/ha.`;
  }
  if (lower.includes('disease') || lower.includes('pest')) {
    return `Upload a photo in the "Crop check" card and I'll analyze it for diseases or pest damage.`;
  }
  if (lower.includes('weather') || lower.includes('rain')) {
    return `${w.condition}, ${w.tempNow}°C now. ${w.rainChance}% chance of rain ${w.rainTiming}.`;
  }
  return `I'm a demo assistant for now — try asking about irrigation, mandi prices, soil, or weather.`;
}

$('#voiceForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#voiceInputText');
  const text = input.value.trim();
  if (!text) return;
  addVoiceMsg(text, 'user');
  input.value = '';
  setTimeout(() => addVoiceMsg(answerVoiceQuery(text), 'bot'), 400);
});
$('#voiceSuggestions').addEventListener('click', (e) => {
  const chip = e.target.closest('.voice-suggestion-chip');
  if (!chip) return;
  addVoiceMsg(chip.textContent, 'user');
  setTimeout(() => addVoiceMsg(answerVoiceQuery(chip.textContent), 'bot'), 400);
});

// Mock mic button (no real speech recognition wired up)
$('#micBtn').addEventListener('click', () => {
  const btn = $('#micBtn');
  btn.classList.add('is-listening');
  setTimeout(() => {
    btn.classList.remove('is-listening');
    $('#voiceInputText').value = 'When should I irrigate?';
  }, 1200);
});
$('#voiceBtn').addEventListener('click', () => {
  document.querySelector('.card-voice')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('#voiceInputText').focus();
});

/* ===========================================================
   GOVERNMENT SCHEMES — matched mock by method/land size
   =========================================================== */
function renderSchemes() {
  const schemes = [
    { name: 'PM-KISAN', benefit: '₹6,000/year direct income support for landholding farmers.' },
    { name: 'Paramparagat Krishi Vikas Yojana', benefit: 'Cluster-based support for organic farming adoption.', method: 'Organic' },
    { name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Crop insurance against weather-related losses.' },
    { name: 'Soil Health Card Scheme', benefit: 'Free periodic soil testing and nutrient recommendations.' },
  ];
  const matched = schemes.filter(s => !s.method || s.method === state.method);
  $('#schemeList').innerHTML = matched.map(s => `
    <div class="scheme-item">
      <div class="scheme-name">${s.name}</div>
      <div class="scheme-benefit">${s.benefit}</div>
    </div>
  `).join('');
}

/* ===========================================================
   DIGITAL FARM DIARY
   =========================================================== */
function renderDiary() {
  const list = $('#diaryList');
  if (!state.diary.length) {
    list.innerHTML = `<div class="diary-empty">No entries yet. Add your first activity to start tracking.</div>`;
    return;
  }
  list.innerHTML = state.diary.slice().reverse().map(d => `
    <div class="diary-item">
      <span class="diary-date">${d.date}</span>
      <div class="diary-body">
        <div class="diary-type">${d.type}</div>
        <div class="diary-notes">${d.notes || ''}</div>
      </div>
      ${d.cost ? `<span class="diary-cost">${fmtINR(d.cost)}</span>` : ''}
    </div>
  `).join('');
}

$('#addDiaryBtn').addEventListener('click', () => $('#diaryModalOverlay').hidden = false);
$('#diaryCancelBtn').addEventListener('click', () => $('#diaryModalOverlay').hidden = true);
$('#diaryForm').addEventListener('submit', (e) => {
  e.preventDefault();
  state.diary.push({
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    type: $('#diaryType').value,
    notes: $('#diaryNotes').value.trim(),
    cost: parseFloat($('#diaryCost').value) || 0,
  });
  $('#diaryModalOverlay').hidden = true;
  $('#diaryForm').reset();
  renderDiary();
});

/* ===========================================================
   OFFLINE SIMULATION
   =========================================================== */
let lastOnlineTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
window.addEventListener('offline', () => {
  $('#netStatus').classList.add('is-offline');
  $('#netStatus .net-label').textContent = 'Offline';
  $('#offlineSyncTime').textContent = lastOnlineTime;
  $('#offlineBanner').hidden = false;
});
window.addEventListener('online', () => {
  $('#netStatus').classList.remove('is-offline');
  $('#netStatus .net-label').textContent = 'Online';
  $('#offlineBanner').hidden = true;
  lastOnlineTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
});

/* ===========================================================
   LANGUAGE TOGGLE (cosmetic demo — cycles label only)
   =========================================================== */
const LANGS = ['English', 'हिन्दी', 'ਪੰਜਾਬੀ', 'मराठी'];
let langIdx = 0;
$('#langToggle').addEventListener('click', () => {
  langIdx = (langIdx + 1) % LANGS.length;
  $('#langLabel').textContent = LANGS[langIdx];
});
