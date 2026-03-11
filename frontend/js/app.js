let currentLanguage = 'en';
let isLoggedIn = false;
let currentUser = null;
let users = JSON.parse(localStorage.getItem('cropxai_users')) || {
    'farmer': { password: 'demo123', name: 'Demo Farmer', email: 'farmer@demo.com' }
};

// DOM Elements
const loginModal = document.getElementById('loginModal');
const infoModal = document.getElementById('infoModal');
const profileModal = document.getElementById('profileModal');
const voiceModal = document.getElementById('voiceModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const profileBtn = document.getElementById('profileBtn');
const voiceBtn = document.getElementById('voiceBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const mainContent = document.getElementById('mainContent');
const languageSelector = document.getElementById('languageSelector');
const recommendBtn = document.getElementById('recommendBtn');
const resultsSection = document.getElementById('resultsSection');

// Auth Links
const createAccountLink = document.getElementById('createAccountLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginLink = document.getElementById('backToLoginLink');
const backToLoginLink2 = document.getElementById('backToLoginLink2');

// Auto-detect buttons
const autoPhBtn = document.getElementById('autoPhBtn');
const autoNBtn = document.getElementById('autoNBtn');
const autoPBtn = document.getElementById('autoPBtn');
const autoKBtn = document.getElementById('autoKBtn');

// Voice Assistant
const startVoiceBtn = document.getElementById('startVoiceBtn');
const voiceStatus = document.getElementById('voiceStatus');
const voiceTranscript = document.getElementById('voiceTranscript');
let recognition = null;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
}

// Modal Controls
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    showLoginForm();
});

profileBtn.addEventListener('click', () => {
    showProfile();
});

voiceBtn.addEventListener('click', () => {
    voiceModal.style.display = 'block';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.parentElement.parentElement.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === infoModal) infoModal.style.display = 'none';
    if (e.target === profileModal) profileModal.style.display = 'none';
    if (e.target === voiceModal) voiceModal.style.display = 'none';
});

// Auth Form Switching
createAccountLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordForm();
});

backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

backToLoginLink2.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});


function showLoginForm() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    forgotPasswordForm.style.display = 'none';
    document.getElementById('authTitle').textContent = translations[currentLanguage].loginTitle;
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    forgotPasswordForm.style.display = 'none';
    document.getElementById('authTitle').textContent = translations[currentLanguage].createAccount;
}

function showForgotPasswordForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    forgotPasswordForm.style.display = 'flex';
    document.getElementById('authTitle').textContent = translations[currentLanguage].forgotPassword;
}

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = { username, ...users[username] };
        isLoggedIn = true;
        loginModal.style.display = 'none';
        loginBtn.style.display = 'none';
        mainContent.style.display = 'block';
        document.getElementById('profileName').textContent = currentUser.name;
        loginForm.reset();
    } else {
        alert(translations[currentLanguage].loginBtn + ' failed!');
    }
});

// Register Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('farmerName').value;
    
    if (users[username]) {
        alert('Username already exists!');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    users[username] = { password, name, email };
    localStorage.setItem('cropxai_users', JSON.stringify(users));
    alert('Account created successfully! Please login.');
    showLoginForm();
    registerForm.reset();
});

// Forgot Password Handler
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('resetUsername').value;
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('resetNewPassword').value;
    
    if (users[username] && users[username].email === email) {
        users[username].password = newPassword;
        localStorage.setItem('cropxai_users', JSON.stringify(users));
        alert('Password reset successfully! Please login.');
        showLoginForm();
        forgotPasswordForm.reset();
    } else {
        alert('Invalid username or email!');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = null;
    mainContent.style.display = 'none';
    loginBtn.style.display = 'block';
    resultsSection.style.display = 'none';
    loginForm.reset();
});

// Language Selector
languageSelector.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    translatePage(currentLanguage);
    if (recognition) {
        recognition.lang = currentLanguage === 'en' ? 'en-US' : 
                         currentLanguage === 'te' ? 'te-IN' : 'hi-IN';
    }
});


// Profile Display
function showProfile() {
    if (!currentUser) return;
    
    const content = `
        <div class="profile-item">
            <strong>${translations[currentLanguage].fullName}:</strong>
            ${currentUser.name}
        </div>
        <div class="profile-item">
            <strong>${translations[currentLanguage].username}:</strong>
            ${currentUser.username}
        </div>
        <div class="profile-item">
            <strong>${translations[currentLanguage].email}:</strong>
            ${currentUser.email}
        </div>
    `;
    
    document.getElementById('profileContent').innerHTML = content;
    profileModal.style.display = 'block';
}

// Voice Assistant
if (recognition) {
    recognition.lang = 'en-US';
    
    startVoiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceStatus.textContent = currentLanguage === 'en' ? 'Listening...' : 
                                  currentLanguage === 'te' ? 'వింటోంది...' : 'सुन रहा है...';
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceTranscript.textContent = transcript;
        processVoiceCommand(transcript);
    };
    
    recognition.onerror = (event) => {
        voiceStatus.textContent = 'Error: ' + event.error;
    };
    
    recognition.onend = () => {
        voiceStatus.textContent = translations[currentLanguage].voiceReady;
    };
} else {
    startVoiceBtn.addEventListener('click', () => {
        alert('Speech recognition not supported in this browser.');
    });
}

function processVoiceCommand(text) {
    text = text.toLowerCase();
    
    const messages = {
        en: {
            processing: 'Processing your request...',
            recommend: 'Getting crop recommendation...',
            profile: 'Opening your profile...',
            climate: 'Please select climate from the form',
            soil: 'Please select soil type from the form',
            help: 'You can say: recommend crop, show profile, fill climate, fill soil type, auto detect values',
            autoFill: 'Auto-filling soil parameters...',
            notUnderstood: 'Sorry, I did not understand. Try saying: recommend crop, show profile, or help'
        },
        te: {
            processing: 'మీ అభ్యర్థనను ప్రాసెస్ చేస్తోంది...',
            recommend: 'పంట సిఫార్సును పొందుతోంది...',
            profile: 'మీ ప్రొఫైల్‌ను తెరుస్తోంది...',
            climate: 'దయచేసి ఫారమ్ నుండి వాతావరణాన్ని ఎంచుకోండి',
            soil: 'దయచేసి ఫారమ్ నుండి నేల రకాన్ని ఎంచుకోండి',
            help: 'మీరు చెప్పవచ్చు: పంట సిఫార్సు చేయండి, ప్రొఫైల్ చూపించండి, వాతావరణం నింపండి, నేల రకం నింపండి, విలువలను ఆటో డిటెక్ట్ చేయండి',
            autoFill: 'నేల పారామితులను ఆటో-ఫిల్ చేస్తోంది...',
            notUnderstood: 'క్షమించండి, నాకు అర్థం కాలేదు. ప్రయత్నించండి: పంట సిఫార్సు చేయండి, ప్రొఫైల్ చూపించండి, లేదా సహాయం'
        },
        hi: {
            processing: 'आपके अनुरोध को प्रोसेस कर रहा है...',
            recommend: 'फसल सिफारिश प्राप्त कर रहा है...',
            profile: 'आपकी प्रोफ़ाइल खोल रहा है...',
            climate: 'कृपया फॉर्म से जलवायु चुनें',
            soil: 'कृपया फॉर्म से मिट्टी का प्रकार चुनें',
            help: 'आप कह सकते हैं: फसल की सिफारिश करें, प्रोफ़ाइल दिखाएं, जलवायु भरें, मिट्टी का प्रकार भरें, मूल्यों का ऑटो पता लगाएं',
            autoFill: 'मिट्टी के पैरामीटर ऑटो-भर रहा है...',
            notUnderstood: 'क्षमा करें, मुझे समझ नहीं आया। कोशिश करें: फसल की सिफारिश करें, प्रोफ़ाइल दिखाएं, या मदद'
        }
    };
    
    const msg = messages[currentLanguage];
    
    // Recommend crop commands
    if (text.includes('recommend') || text.includes('suggest') || text.includes('crop') ||
        text.includes('సిఫార్సు') || text.includes('పంట') ||
        text.includes('सिफारिश') || text.includes('फसल')) {
        voiceTranscript.textContent += '\n\n' + msg.recommend;
        setTimeout(() => {
            recommendBtn.click();
            voiceModal.style.display = 'none';
        }, 1000);
        return;
    }
    
    // Profile commands
    if (text.includes('profile') || text.includes('account') || text.includes('user') ||
        text.includes('ప్రొఫైల్') || text.includes('खाता') || text.includes('प्रोफ़ाइल')) {
        voiceTranscript.textContent += '\n\n' + msg.profile;
        setTimeout(() => {
            showProfile();
            voiceModal.style.display = 'none';
        }, 1000);
        return;
    }
    
    // Auto-detect commands
    if (text.includes('auto') || text.includes('detect') || text.includes('fill') ||
        text.includes('ఆటో') || text.includes('डिटेक्ट') || text.includes('भरें')) {
        voiceTranscript.textContent += '\n\n' + msg.autoFill;
        setTimeout(() => {
            autoPhBtn.click();
            setTimeout(() => autoNBtn.click(), 200);
            setTimeout(() => autoPBtn.click(), 400);
            setTimeout(() => autoKBtn.click(), 600);
            voiceModal.style.display = 'none';
        }, 1000);
        return;
    }
    
    // Help commands
    if (text.includes('help') || text.includes('what can') || text.includes('commands') ||
        text.includes('సహాయం') || text.includes('मदद')) {
        voiceTranscript.textContent += '\n\n' + msg.help;
        return;
    }
    
    // Default - not understood
    voiceTranscript.textContent += '\n\n' + msg.notUnderstood;
}

// Auto-detect Soil Parameters
autoPhBtn.addEventListener('click', () => {
    const climate = document.getElementById('climate').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!climate || !soilType) {
        alert(translations[currentLanguage].climate + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('soilPh').value = params.ph.toFixed(1);
    }
});

autoNBtn.addEventListener('click', () => {
    const climate = document.getElementById('climate').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!climate || !soilType) {
        alert(translations[currentLanguage].climate + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('nitrogen').value = params.nitrogen.toFixed(1);
    }
});

autoPBtn.addEventListener('click', () => {
    const climate = document.getElementById('climate').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!climate || !soilType) {
        alert(translations[currentLanguage].climate + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('phosphorus').value = params.phosphorus.toFixed(1);
    }
});

autoKBtn.addEventListener('click', () => {
    const climate = document.getElementById('climate').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!climate || !soilType) {
        alert(translations[currentLanguage].climate + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('potassium').value = params.potassium.toFixed(1);
    }
});


// Info Buttons
document.getElementById('phInfoBtn').addEventListener('click', () => {
    const content = `
        <h3>${translations[currentLanguage].phInfoTitle}</h3>
        <p>${translations[currentLanguage].phInfoContent}</p>
        <table class="info-table">
            <tr>
                <th>pH Range</th>
                <th>Classification</th>
                <th>Suitable Crops</th>
            </tr>
            <tr>
                <td>3.5 - 5.5</td>
                <td>Strongly Acidic</td>
                <td>Tea, Potato, Blueberry</td>
            </tr>
            <tr>
                <td>5.5 - 6.5</td>
                <td>Slightly Acidic</td>
                <td>Rice, Wheat, Maize</td>
            </tr>
            <tr>
                <td>6.5 - 7.5</td>
                <td>Neutral</td>
                <td>Most crops thrive</td>
            </tr>
            <tr>
                <td>7.5 - 8.5</td>
                <td>Slightly Alkaline</td>
                <td>Cotton, Sugarcane</td>
            </tr>
        </table>
    `;
    document.getElementById('infoContent').innerHTML = content;
    infoModal.style.display = 'block';
});

document.getElementById('npkInfoBtn').addEventListener('click', () => {
    const content = `
        <h3>${translations[currentLanguage].npkInfoTitle}</h3>
        <p>${translations[currentLanguage].npkInfoContent}</p>
        <table class="info-table">
            <tr>
                <th>Nutrient</th>
                <th>Function</th>
                <th>Deficiency Signs</th>
            </tr>
            <tr>
                <td>Nitrogen (N)</td>
                <td>Leaf growth, protein synthesis</td>
                <td>Yellowing of older leaves</td>
            </tr>
            <tr>
                <td>Phosphorus (P)</td>
                <td>Root development, flowering</td>
                <td>Purple/dark green leaves</td>
            </tr>
            <tr>
                <td>Potassium (K)</td>
                <td>Disease resistance, water regulation</td>
                <td>Brown leaf edges</td>
            </tr>
        </table>
        <p style="margin-top: 15px;"><strong>Optimal Ranges:</strong></p>
        <p>Low: 0-20% | Medium: 20-40% | High: 40-60% | Very High: 60%+</p>
    `;
    document.getElementById('infoContent').innerHTML = content;
    infoModal.style.display = 'block';
});

// Crop Recommendation with Explainable AI
recommendBtn.addEventListener('click', () => {
    const inputs = {
        climate: document.getElementById('climate').value,
        area: parseFloat(document.getElementById('area').value),
        season: document.getElementById('season').value,
        soilType: document.getElementById('soilType').value,
        soilPh: parseFloat(document.getElementById('soilPh').value),
        nitrogen: parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium: parseFloat(document.getElementById('potassium').value)
    };

    if (!inputs.climate || !inputs.season || !inputs.soilType || 
        isNaN(inputs.area) || isNaN(inputs.soilPh) || 
        isNaN(inputs.nitrogen) || isNaN(inputs.phosphorus) || isNaN(inputs.potassium)) {
        alert(translations[currentLanguage].inputTitle);
        return;
    }

    // Use Explainable AI to analyze all crops
    const results = explainableAI.analyzeAllCrops(inputs, cropDatabase);
    const bestMatch = results[0];
    
    if (bestMatch) {
        const explanation = explainableAI.generateExplanation(
            inputs, 
            bestMatch.crop, 
            bestMatch.scores, 
            bestMatch.confidence, 
            currentLanguage
        );
        
        displayRecommendation(bestMatch.crop, inputs, explanation);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});


function displayRecommendation(crop, inputs, explanation) {
    const resultsDiv = document.getElementById('recommendationResults');
    
    // Get soil analysis
    const soilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, currentLanguage);
    
    // Create feature scores HTML
    let featureScoresHTML = '';
    for (const [feature, score] of Object.entries(explanation.featureScores)) {
        const featureName = translations[currentLanguage][feature] || feature;
        featureScoresHTML += `
            <div class="feature-score-item">
                <strong>${featureName}</strong>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score}%"></div>
                </div>
                <span>${score.toFixed(0)}%</span>
            </div>
        `;
    }
    
    // Create recommendations HTML
    let recommendationsHTML = '';
    if (explanation.recommendations.length > 0) {
        recommendationsHTML = '<ul style="margin-top: 10px;">';
        explanation.recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    }
    
    // Create irrigation schedule HTML
    let irrigationScheduleHTML = '';
    if (crop.irrigationSchedule && crop.irrigationSchedule[currentLanguage]) {
        irrigationScheduleHTML = `
            <div class="detail-section">
                <h4>📅 ${translations[currentLanguage].irrigationSchedule}</h4>
                <table class="info-table irrigation-table">
                    <thead>
                        <tr>
                            <th>${translations[currentLanguage].growthStage}</th>
                            <th>${translations[currentLanguage].days}</th>
                            <th>${translations[currentLanguage].frequency}</th>
                            <th>${translations[currentLanguage].waterDepth}</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        crop.irrigationSchedule[currentLanguage].forEach(schedule => {
            irrigationScheduleHTML += `
                <tr>
                    <td><strong>${schedule.stage}</strong></td>
                    <td>${schedule.days}</td>
                    <td>${schedule.frequency}</td>
                    <td>${schedule.depth}</td>
                </tr>
            `;
        });
        
        irrigationScheduleHTML += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    const html = `
        <div class="recommendation-card">
            <div class="crop-name">${crop.name[currentLanguage]}</div>
            
            <div class="ai-explanation-section">
                <h4>🤖 ${translations[currentLanguage].aiExplanation}</h4>
                <p>${explanation.summary}</p>
                
                <div style="margin-top: 15px;">
                    <strong>${translations[currentLanguage].confidenceScore}:</strong>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${explanation.confidence}%">
                            ${explanation.confidence}%
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px;">
                    <h4>${translations[currentLanguage].featureImportance}:</h4>
                    <div class="feature-scores">
                        ${featureScoresHTML}
                    </div>
                </div>
                
                ${recommendationsHTML}
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].explanation}</h4>
                <p>${crop.explanation[currentLanguage]}</p>
                <p><strong>${translations[currentLanguage].phRange}</strong> ${crop.phRange[0]} - ${crop.phRange[1]} 
                   (${translations[currentLanguage].optimal}: ${inputs.soilPh >= crop.phRange[0] && inputs.soilPh <= crop.phRange[1] ? '✓' : '✗'})</p>
            </div>
            
            <div class="detail-section">
                <h4>${currentLanguage === 'en' ? 'Soil Analysis' : currentLanguage === 'te' ? 'నేల విశ్లేషణ' : 'मिट्टी विश्लेषण'}</h4>
                <p><strong>N:</strong> ${soilAnalysis.nitrogen}</p>
                <p><strong>P:</strong> ${soilAnalysis.phosphorus}</p>
                <p><strong>K:</strong> ${soilAnalysis.potassium}</p>
            </div>
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].irrigation}</h4>
                <p>${crop.irrigation[currentLanguage]}</p>
            </div>
            
            ${irrigationScheduleHTML}
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].fertilizers}</h4>
                <p>${crop.fertilizers[currentLanguage]}</p>
            </div>
            
            <div class="detail-section">
                <h4>NPK ${currentLanguage === 'en' ? 'Requirements' : currentLanguage === 'te' ? 'అవసరాలు' : 'आवश्यकताएं'}</h4>
                <p><strong>N:</strong> ${crop.npk.n[0]}-${crop.npk.n[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.nitrogen}%)</p>
                <p><strong>P:</strong> ${crop.npk.p[0]}-${crop.npk.p[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.phosphorus}%)</p>
                <p><strong>K:</strong> ${crop.npk.k[0]}-${crop.npk.k[1]}% 
                   (${currentLanguage === 'en' ? 'Your' : currentLanguage === 'te' ? 'మీది' : 'आपका'}: ${inputs.potassium}%)</p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

// Initialize
translatePage(currentLanguage);
