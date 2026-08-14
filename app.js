/**
 * AgriSmart Advisor — Core Client Controller
 * Multilingual Engine, Dynamic Routing, Rule Matrix & Crop Explorer
 */

// 1. Centralized Translations Dictionary
const translations = {
  en: {
    badgeHero: "Agricultural Decision Support",
    tagline: "Smart Agricultural Assistance for Better Decisions",
    heroDesc: "AgriSmart Advisor helps users access structured agricultural information and data-driven assistance through a simple, responsive and multilingual digital platform.",
    getStarted: "Get Started →",
    exploreAssistance: "Explore Assistance",
    navHome: "Home",
    navDashboard: "Dashboard",
    navAssistance: "Assistance",
    navCrops: "Crop Directory",
    navAdvisor: "Recommendation",
    navAbout: "About",
    quickStatsCrops: "Cataloged Crops",
    quickStatsSoil: "Soil Profiles",
    quickStatsLang: "Languages",
    categoriesTitle: "Agricultural Assistance Modules",
    categoriesSubtitle: "Access domain-specific advisories and agricultural knowledge modules.",
    catCropInfo: "Crop Information",
    catCropInfoDesc: "Optimal cultivation parameters, growth cycles, and environmental prerequisites.",
    catHealth: "Crop Health & Protection",
    catHealthDesc: "Scouting schedules, early disease signs, and integrated pest management steps.",
    catIrrigation: "Irrigation Management",
    catIrrigationDesc: "Critical water stages and efficient irrigation methods across crops.",
    recEngineTitle: "Data-Driven Recommendation Concept",
    recEngineSubtitle: "Select farm conditions to receive rule-evaluated agronomic guidance.",
    formCropLabel: "Select Crop",
    formSoilLabel: "Soil Type",
    formSeasonLabel: "Season",
    formWaterLabel: "Irrigation Status",
    formConditionLabel: "General Crop Condition",
    btnGenerate: "Generate Recommendation",
    btnReset: "Reset"
  },
  hi: {
    badgeHero: "कृषि निर्णय सहायता प्रणाली",
    tagline: "बेहतर निर्णयों के लिए स्मार्ट कृषि सहायता",
    heroDesc: "AgriSmart Advisor किसानों और कृषि उपयोगकर्ताओं को एक सरल, उत्तरदायी और बहुभाषी डिजिटल प्लेटफॉर्म के माध्यम से संरचित जानकारी प्रदान करता है।",
    getStarted: "शुरू करें →",
    exploreAssistance: "सहायता देखें",
    navHome: "होम",
    navDashboard: "डैशबोर्ड",
    navAssistance: "कृषि सहायता",
    navCrops: "फसल सूची",
    navAdvisor: "सलाहकार",
    navAbout: "परिचय",
    quickStatsCrops: "सूचीबद्ध फसलें",
    quickStatsSoil: "मृदा प्रकार",
    quickStatsLang: "भाषाएं",
    categoriesTitle: "कृषि सहायता मॉड्यूल",
    categoriesSubtitle: "विशेषज्ञ कृषि सलाह और ज्ञान मॉड्यूल तक सीधी पहुंच प्राप्त करें।",
    catCropInfo: "फसल जानकारी",
    catCropInfoDesc: "फसल की बुवाई, विकास चक्र और आवश्यक जलवायु परिस्थितियों का विवरण।",
    catHealth: "फसल स्वास्थ्य एवं सुरक्षा",
    catHealthDesc: "कीट निगरानी, प्रारंभिक रोग लक्षण और रोकथाम प्रबंधन के संरचित निर्देश।",
    catIrrigation: "सिंचाई प्रबंधन",
    catIrrigationDesc: "महत्वपूर्ण विकास चरणों में पानी की आवश्यकता और कुशल सिंचाई विधियां।",
    recEngineTitle: "डेटा-आधारित अनुशंसा प्रणाली",
    recEngineSubtitle: "नियम-मूल्यांकित कृषि सलाह प्राप्त करने के लिए अपने खेत के मापदंड चुनें।",
    formCropLabel: "फसल चुनें",
    formSoilLabel: "मिट्टी का प्रकार",
    formSeasonLabel: "मौसम (ऋतु)",
    formWaterLabel: "सिंचाई की उपलब्धता",
    formConditionLabel: "फसल की सामान्य स्थिति",
    btnGenerate: "अनुशंसा प्राप्त करें",
    btnReset: "रीसेट करें"
  },
  pa: {
    badgeHero: "ਖੇਤੀਬਾੜੀ ਫੈਸਲਾ ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀ",
    tagline: "ਚੰਗੇ ਫੈਸਲਿਆਂ ਲਈ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਸਹਾਇਤਾ",
    heroDesc: "AgriSmart Advisor ਇੱਕ ਸਰਲ, ਉੱਤਰਦਾਈ ਅਤੇ ਬਹੁ-ਭਾਸ਼ਾਈ ਪਲੇਟਫਾਰਮ ਰਾਹੀਂ ਕਿਸਾਨਾਂ ਨੂੰ ਸੁਚੱਜੀ ਖੇਤੀ ਜਾਣਕਾਰੀ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ →",
    exploreAssistance: "ਸਹਾਇਤਾ ਵੇਖੋ",
    navHome: "ਮੁੱਖ ਪੰਨਾ",
    navDashboard: "ਡੈਸ਼ਬੋਰਡ",
    navAssistance: "ਖੇਤੀ ਸਹਾਇਤਾ",
    navCrops: "ਫ਼ਸਲ ਜਾਣਕਾਰੀ",
    navAdvisor: "ਸਿਫ਼ਾਰਸ਼ ਸਲਾਹਕਾਰ",
    navAbout: "ਪ੍ਰੋਜੈਕਟ ਬਾਰੇ",
    quickStatsCrops: "ਦਰਜ ਫ਼ਸਲਾਂ",
    quickStatsSoil: "ਮਿੱਟੀ ਦੀਆਂ ਕਿਸਮਾਂ",
    quickStatsLang: "ਭਾਸ਼ਾਵਾਂ",
    categoriesTitle: "ਖੇਤੀਬਾੜੀ ਸਹਾਇਤਾ ਮੌਡਿਊਲ",
    categoriesSubtitle: "ਖੇਤੀ ਗਿਆਨ ਅਤੇ ਸਲਾਹਕਾਰ ਮੌਡਿਊਲਾਂ ਤੱਕ ਪਹੁੰਚ ਪ੍ਰਾਪਤ ਕਰੋ।",
    catCropInfo: "ਫ਼ਸਲ ਜਾਣਕਾਰੀ",
    catCropInfoDesc: "ਫ਼ਸਲਾਂ ਦੇ ਵਾਧੇ ਦੇ ਚੱਕਰ ਅਤੇ ਅਨੁਕੂਲ ਮੌਸਮੀ ਹਾਲਾਤਾਂ ਦੀ ਜਾਣਕਾਰੀ।",
    catHealth: "ਫ਼ਸਲ ਦੀ ਸਿਹਤ ਅਤੇ ਸੁਰੱਖਿਆ",
    catHealthDesc: "ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਅਤੇ ਬਿਮਾਰੀਆਂ ਦੇ ਸ਼ੁਰੂਆਤੀ ਲੱਛਣਾਂ ਦੀ ਨਿਗਰਾਨੀ।",
    catIrrigation: "ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ",
    catIrrigationDesc: "ਪਾਣੀ ਦੀ ਲੋੜ ਦੇ ਮੁੱਖ ਪੜਾਅ ਅਤੇ ਸਿੰਚਾਈ ਦੇ ਤਰੀਕੇ।",
    recEngineTitle: "ਡਾਟਾ-ਅਧਾਰਤ ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਣਾਲੀ",
    recEngineSubtitle: "ਸਹੀ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣੇ ਖੇਤ ਦੇ ਮਾਪਦੰਡ ਚੁਣੋ।",
    formCropLabel: "ਫ਼ਸਲ ਚੁਣੋ",
    formSoilLabel: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    formSeasonLabel: "ਮੌਸਮ / ਸੀਜ਼ਨ",
    formWaterLabel: "ਸਿੰਚਾਈ ਦੀ ਉਪਲਬਧਤਾ",
    formConditionLabel: "ਫ਼ਸਲ ਦੀ ਆਮ ਹਾਲਤ",
    btnGenerate: "ਸਿਫ਼ਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
    btnReset: "ਰੀਸੈੱਟ ਕਰੋ"
  }
};

// 2. Structured Crop Data Repository
const cropDatabase = [
  {
    id: "wheat",
    name: "Wheat (गेहूं / ਕਣਕ)",
    scientific: "Triticum aestivum",
    category: "Cereal",
    season: "Rabi",
    soils: ["Loamy", "Clay Loam", "Alluvial"],
    water: "Moderate (4-6 irrigations at CRI and flowering)",
    duration: "110-140 Days",
    temp: "15°C - 25°C",
    guidance: "Ensure timely sowing in November. Crown root initiation (CRI) stage is most critical for irrigation."
  },
  {
    id: "rice",
    name: "Rice / Paddy (धान / ਝੋਨਾ)",
    scientific: "Oryza sativa",
    category: "Cereal",
    season: "Kharif",
    soils: ["Clayey", "Clay Loam", "Alluvial"],
    water: "High (Requires shallow standing water initially)",
    duration: "120-150 Days",
    temp: "22°C - 32°C",
    guidance: "Proper puddling is essential. Keep weeds under control in the first 30 days."
  },
  {
    id: "maize",
    name: "Maize (मक्का / ਮੱਕੀ)",
    scientific: "Zea mays",
    category: "Cereal",
    season: "Kharif",
    soils: ["Loamy", "Sandy Loam"],
    water: "Moderate (Avoid waterlogging)",
    duration: "85-110 Days",
    temp: "20°C - 30°C",
    guidance: "Highly sensitive to water stagnation at seedling and tasseling stages."
  },
  {
    id: "mustard",
    name: "Mustard (सरसों / ਸਰ੍ਹੋਂ)",
    scientific: "Brassica juncea",
    category: "Oilseed",
    season: "Rabi",
    soils: ["Sandy Loam", "Loamy"],
    water: "Low to Moderate (1-2 irrigations)",
    duration: "105-125 Days",
    temp: "10°C - 25°C",
    guidance: "Regularly scout for aphid infestation during flowering and pod development."
  },
  {
    id: "cotton",
    name: "Cotton (कपास / ਕਪਾਹ)",
    scientific: "Gossypium hirsutum",
    category: "Cash Crop",
    season: "Kharif",
    soils: ["Deep Black Soil", "Alluvial"],
    water: "Moderate (Uniform moisture needed during boll formation)",
    duration: "150-180 Days",
    temp: "21°C - 35°C",
    guidance: "Requires good drainage; monitor for pink bollworm during flowering."
  },
  {
    id: "potato",
    name: "Potato (आलू / ਆਲੂ)",
    scientific: "Solanum tuberosum",
    category: "Tuber",
    season: "Rabi",
    soils: ["Sandy Loam", "Loamy"],
    water: "Moderate and Frequent (Drip/Furrow)",
    duration: "90-110 Days",
    temp: "15°C - 20°C",
    guidance: "Earthing up is necessary around 30-35 days after planting to prevent greening."
  }
];

// Current State
let currentLang = 'en';

// --- Page Navigation ---
function navigateTo(pageId) {
  // Update view visibility
  document.querySelectorAll('.page-view').forEach(view => {
    view.classList.remove('active');
  });
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.add('active');

  // Update Nav Button Active States
  document.querySelectorAll('.nav-btn, .m-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-page') === pageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Close mobile drawer if open
  document.getElementById('mobileDrawer').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  drawer.classList.toggle('hidden');
}

// --- Multilingual Runtime Translation ---
function changeLanguage(langKey) {
  currentLang = langKey;
  const dict = translations[langKey] || translations.en;

  // Translate all DOM elements containing data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// --- Crop Directory & Filtering ---
function renderCrops(cropList) {
  const container = document.getElementById('cropsGrid');
  if (!container) return;

  if (cropList.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: #fff; border-radius: 16px;">
        <p style="color: #78716c;">No matching crops found.</p>
      </div>`;
    return;
  }

  container.innerHTML = cropList.map(crop => `
    <div class="crop-card">
      <div>
        <div class="crop-head">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #78716c;">${crop.category}</span>
            <h3 style="font-size: 16px; font-weight: 800; margin-top: 2px;">${crop.name}</h3>
            <p style="font-size: 11px; font-style: italic; color: #a8a29e;">${crop.scientific}</p>
          </div>
          <span class="crop-season-tag">${crop.season}</span>
        </div>

        <div class="crop-details-list">
          <p><strong>Duration:</strong> ${crop.duration}</p>
          <p><strong>Temp:</strong> ${crop.temp}</p>
          <p><strong>Water:</strong> ${crop.water}</p>
        </div>
      </div>

      <button class="btn-outline" onclick="openModal('${crop.id}')">View Guidance</button>
    </div>
  `).join('');
}

function filterCrops() {
  const search = document.getElementById('cropSearchInput').value.toLowerCase();
  const season = document.getElementById('cropSeasonFilter').value;

  const filtered = cropDatabase.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search) || c.category.toLowerCase().includes(search);
    const matchesSeason = season === 'All' || c.season.toLowerCase().includes(season.toLowerCase());
    return matchesSearch && matchesSeason;
  });

  renderCrops(filtered);
}

// --- Modal Handlers ---
function openModal(cropId) {
  const crop = cropDatabase.find(c => c.id === cropId);
  if (!crop) return;

  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <span class="badge">${crop.category}</span>
    <h2 style="font-size: 20px; font-weight: 800; margin-top: 4px;">${crop.name}</h2>
    <p style="font-size: 12px; font-style: italic; color: #78716c; margin-bottom: 16px;">${crop.scientific}</p>

    <div style="background: #f5f5f4; padding: 12px; border-radius: 10px; margin-bottom: 10px; font-size: 13px;">
      <strong>Optimal Soil:</strong> ${crop.soils.join(', ')}
    </div>

    <div style="background: #f5f5f4; padding: 12px; border-radius: 10px; margin-bottom: 10px; font-size: 13px;">
      <strong>Water Requirements:</strong> ${crop.water}
    </div>

    <div style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 12px; border-radius: 10px; font-size: 12px; color: #1b5e20;">
      <strong>Agronomic Field Guidance:</strong><br/>
      ${crop.guidance}
    </div>
  `;

  document.getElementById('cropModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('cropModal').classList.add('hidden');
}

// --- Data-Driven Recommendation Matrix Engine ---
function handleRecommendationSubmit(event) {
  event.preventDefault();

  const cropKey = document.getElementById('recCrop').value;
  const soil = document.getElementById('recSoil').value;
  const season = document.getElementById('recSeason').value;
  const irrigation = document.getElementById('recIrrigation').value;
  const condition = document.getElementById('recCondition').value;

  const crop = cropDatabase.find(c => c.id === cropKey);

  // Rule Matrix Logic
  const isSeasonOptimal = crop.season.toLowerCase().includes(season.toLowerCase());
  const isSoilOptimal = crop.soils.some(s => s.toLowerCase().includes(soil.toLowerCase()));
  const isIrrigationOptimal = irrigation === 'Available';

  let statusText = "Highly Favorable";
  let statusClass = "res-favorable";
  let score = "92%";
  let notes = ["Selected parameters match baseline agronomic requirements for this crop."];
  let actions = ["Proceed with certified seed selection and schedule primary seed-bed preparation."];

  if (isSeasonOptimal && (isSoilOptimal || isIrrigationOptimal)) {
    statusText = "Moderately Favorable (Management Required)";
    statusClass = "res-moderate";
    score = "70%";
    if (!isSoilOptimal) {
      notes.push(`Soil type '${soil}' requires organic amendments (FYM/Compost) to optimize moisture retention.`);
      actions.push("Apply 10-15 tonnes/ha of well-rotted farmyard manure before sowing.");
    }
    if (!isIrrigationOptimal) {
      notes.push("Irrigation is limited. Water-efficient mulching or micro-irrigation is recommended.");
      actions.push("Adopt drip or furrow layout to maximize water efficiency.");
    }
  } else if (!isSeasonOptimal && !isSoilOptimal) {
    statusText = "Challenging / High Risk";
    statusClass = "res-risk";
    score = "40%";
    notes = ["Mismatch identified between crop growth season and selected soil type."];
    actions = [
      "Consult local Krishi Vigyan Kendra (KVK) officers before sowing.",
      "Consider alternative crops suited for the current season."
    ];
  }

  if (condition === "Pest Affected" || condition === "Nutrient Deficient") {
    actions.unshift("Immediate: Collect soil and leaf tissue samples for laboratory diagnosis.");
  }

  // Render Result Card
  const resultCard = document.getElementById('advisorResultContainer');
  resultCard.innerHTML = `
    <div class="res-header">
      <div>
        <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #78716c;">Agronomic Report</span>
        <h4 style="font-size: 18px; font-weight: 800;">${crop.name}</h4>
      </div>
      <span style="font-size: 12px; font-weight: 800; background: #f5f5f4; padding: 4px 10px; border-radius: 50px;">Score: ${score}</span>
    </div>

    <div class="res-status-banner ${statusClass}">
      ✓ Suitability: ${statusText}
    </div>

    <p class="res-section-title">Agronomic Observations</p>
    <ul class="res-list">
      ${notes.map(n => `<li>${n}</li>`).join('')}
    </ul>

    <p class="res-section-title">Recommended Action Plan</p>
    <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
      ${actions.map((a, i) => `
        <div style="background: #f5f5f4; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: 600;">
          ${i + 1}. ${a}
        </div>
      `).join('')}
    </div>

    <div class="disclaimer-box">
      <strong>Note:</strong> This platform provides informational assistance based on agronomic matrices and should not replace certified on-site agricultural officers.
    </div>
  `;
}

function resetRecommendationForm() {
  document.getElementById('recommendationForm').reset();
  const resultCard = document.getElementById('advisorResultContainer');
  resultCard.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">✨</span>
      <h4>No Parameters Submitted</h4>
      <p>Select your field attributes on the left to generate an agronomic recommendation.</p>
    </div>
  `;
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  renderCrops(cropDatabase);
  navigateTo('home');
});
