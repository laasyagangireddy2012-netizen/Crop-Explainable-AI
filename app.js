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
        // Restore body scroll when any modal closes
        document.body.style.overflow = 'auto';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === infoModal) {
        infoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === profileModal) {
        profileModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === voiceModal) {
        voiceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === insuranceModal) {
        insuranceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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
            // Check if location and soil type are selected
            const location = document.getElementById('location').value;
            const soilType = document.getElementById('soilType').value;
            
            if (!location || !soilType) {
                voiceTranscript.textContent += '\n\n' + (currentLanguage === 'en' ? 'Please select location and soil type first' :
                    currentLanguage === 'te' ? 'దయచేసి ముందుగా స్థానం మరియు నేల రకాన్ని ఎంచుకోండి' :
                    'कृपया पहले स्थान और मिट्टी का प्रकार चुनें');
                return;
            }
            
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
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('soilPh').value = params.ph.toFixed(1);
    }
});

autoNBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('nitrogen').value = params.nitrogen.toFixed(1);
    }
});

autoPBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
        return;
    }
    
    const params = autoDetectSoilParameters(climate, soilType);
    if (params) {
        document.getElementById('phosphorus').value = params.phosphorus.toFixed(1);
    }
});

autoKBtn.addEventListener('click', () => {
    const location = document.getElementById('location').value;
    const soilType = document.getElementById('soilType').value;
    
    if (!location || !soilType) {
        alert(translations[currentLanguage].location + ' and ' + translations[currentLanguage].soilType + ' required!');
        return;
    }
    
    // Get climate from location
    const climate = getClimateFromLocation(location);
    if (!climate) {
        alert('Unable to determine climate for selected location');
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
    const location = document.getElementById('location').value;
    const inputs = {
        climate: getClimateFromLocation(location), // Convert location to climate
        area: parseFloat(document.getElementById('area').value),
        season: document.getElementById('season').value,
        soilType: document.getElementById('soilType').value,
        soilPh: parseFloat(document.getElementById('soilPh').value),
        nitrogen: parseFloat(document.getElementById('nitrogen').value),
        phosphorus: parseFloat(document.getElementById('phosphorus').value),
        potassium: parseFloat(document.getElementById('potassium').value)
    };

    if (!location || !inputs.season || !inputs.soilType || 
        isNaN(inputs.area) || isNaN(inputs.soilPh) || 
        isNaN(inputs.nitrogen) || isNaN(inputs.phosphorus) || isNaN(inputs.potassium)) {
        alert(translations[currentLanguage].inputTitle);
        return;
    }

    if (!inputs.climate) {
        alert('Unable to determine climate for selected location');
        return;
    }

    // Use Explainable AI to analyze all crops
    const results = explainableAI.analyzeAllCrops(inputs, cropDatabase);
    
    // Get top 3 recommendations
    const topRecommendations = results.slice(0, 3);
    
    if (topRecommendations.length > 0) {
        // Generate explanations for all top crops
        const recommendationsWithExplanations = topRecommendations.map(result => ({
            crop: result.crop,
            cropKey: result.cropKey,
            scores: result.scores,
            confidence: result.confidence,
            explanation: explainableAI.generateExplanation(
                inputs, 
                result.crop, 
                result.scores, 
                result.confidence, 
                currentLanguage
            )
        }));
        
        displayMultipleRecommendations(recommendationsWithExplanations, inputs, location);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
});


function displayRecommendation(crop, inputs, explanation, location) {
    const resultsDiv = document.getElementById('recommendationResults');
    
    // Get soil analysis
    const soilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, currentLanguage);
    
    // Get location details
    const locationDetails = getLocationDetails(location, currentLanguage);
    const locationName = locationDetails ? locationDetails.name : location;
    
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
            
            <div class="detail-section">
                <h4>📍 ${translations[currentLanguage].location}</h4>
                <p><strong>${locationName}</strong></p>
                <p>${currentLanguage === 'en' ? 'Climate' : currentLanguage === 'te' ? 'వాతావరణం' : 'जलवायु'}: ${inputs.climate}</p>
            </div>
            
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


// Display Multiple Recommendations
function displayMultipleRecommendations(recommendations, inputs, location) {
    const resultsDiv = document.getElementById('recommendationResults');
    
    const locationDetails = getLocationDetails(location, currentLanguage);
    const locationName = locationDetails ? locationDetails.name : location;
    const soilAnalysis = getSoilAnalysis(inputs.nitrogen, inputs.phosphorus, inputs.potassium, currentLanguage);
    
    let html = `
        <div class="recommendations-header">
            <h2>${currentLanguage === 'en' ? 'Top Crop Recommendations' : 
                 currentLanguage === 'te' ? 'టాప్ పంట సిఫార్సులు' : 
                 'शीर्ष फसल सिफारिशें'}</h2>
            <button id="readRecommendationsBtn" class="btn-read-aloud" data-translate="readAloud">
                🔊 ${translations[currentLanguage].readAloud}
            </button>
            <div class="location-info">
                <p><strong>📍 ${translations[currentLanguage].location}:</strong> ${locationName}</p>
                <p><strong>${currentLanguage === 'en' ? 'Climate' : currentLanguage === 'te' ? 'వాతావరణం' : 'जलवायु'}:</strong> ${inputs.climate}</p>
            </div>
        </div>
    `;
    
    recommendations.forEach((rec, index) => {
        const isBest = index === 0;
        const rankLabel = currentLanguage === 'en' ? 
            (isBest ? '🏆 BEST RECOMMENDATION' : `#${index + 1} Alternative`) :
            currentLanguage === 'te' ? 
            (isBest ? '🏆 ఉత్తమ సిఫార్సు' : `#${index + 1} ప్రత్యామ్నాయం`) :
            (isBest ? '🏆 सर्वश्रेष्ठ सिफारिश' : `#${index + 1} विकल्प`);
        
        html += generateCropCard(rec, inputs, soilAnalysis, rankLabel, isBest);
    });
    
    html += generateComparisonTable(recommendations, currentLanguage);
    
    resultsDiv.innerHTML = html;
    
    // Add event listener for Read Aloud button
    setTimeout(() => {
        const readBtn = document.getElementById('readRecommendationsBtn');
        if (readBtn) {
            readBtn.addEventListener('click', () => {
                readRecommendationsAloud(recommendations, inputs, location);
            });
        }
    }, 100);
}

function generateCropCard(rec, inputs, soilAnalysis, rankLabel, isBest) {
    const { crop, confidence, explanation, scores } = rec;
    
    let featureScoresHTML = '';
    for (const [feature, score] of Object.entries(scores)) {
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
    
    let recommendationsHTML = '';
    if (explanation.recommendations.length > 0) {
        recommendationsHTML = '<ul style="margin-top: 10px;">';
        explanation.recommendations.forEach(rec => {
            recommendationsHTML += `<li>${rec}</li>`;
        });
        recommendationsHTML += '</ul>';
    }
    
    const cardClass = isBest ? 'recommendation-card best-recommendation' : 'recommendation-card alternative-recommendation';
    
    return `
        <div class="${cardClass}">
            <div class="rank-badge">${rankLabel}</div>
            <div class="crop-name">${crop.name[currentLanguage]}</div>
            
            <div class="ai-explanation-section">
                <h4>🤖 ${translations[currentLanguage].aiExplanation}</h4>
                <p>${explanation.summary}</p>
                
                <div style="margin-top: 15px;">
                    <strong>${translations[currentLanguage].confidenceScore}:</strong>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${confidence}%">
                            ${confidence}%
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
            
            ${isBest ? `
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
            
            <div class="detail-section">
                <h4>${translations[currentLanguage].fertilizers}</h4>
                <p>${crop.fertilizers[currentLanguage]}</p>
            </div>
            ` : ''}
            
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
}

function generateComparisonTable(recommendations, language) {
    const headers = {
        en: { crop: 'Crop', confidence: 'Confidence', climate: 'Climate Match', season: 'Season Match', soil: 'Soil Match', ph: 'pH Match' },
        te: { crop: 'పంట', confidence: 'విశ్వాసం', climate: 'వాతావరణం మ్యాచ్', season: 'సీజన్ మ్యాచ్', soil: 'నేల మ్యాచ్', ph: 'pH మ్యాచ్' },
        hi: { crop: 'फसल', confidence: 'विश्वास', climate: 'जलवायु मेल', season: 'मौसम मेल', soil: 'मिट्टी मेल', ph: 'pH मेल' }
    };
    
    const h = headers[language];
    
    let tableHTML = `
        <div class="comparison-section">
            <h3>${language === 'en' ? '📊 Comparison Table' : language === 'te' ? '📊 పోలిక పట్టిక' : '📊 तुलना तालिका'}</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>${h.crop}</th>
                        <th>${h.confidence}</th>
                        <th>${h.climate}</th>
                        <th>${h.season}</th>
                        <th>${h.soil}</th>
                        <th>${h.ph}</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    recommendations.forEach((rec, index) => {
        const rowClass = index === 0 ? 'best-row' : '';
        tableHTML += `
            <tr class="${rowClass}">
                <td><strong>${rec.crop.name[language]}</strong></td>
                <td><span class="confidence-badge">${rec.confidence}%</span></td>
                <td><span class="score-badge">${rec.scores.climate.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.season.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.soilType.toFixed(0)}%</span></td>
                <td><span class="score-badge">${rec.scores.ph.toFixed(0)}%</span></td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    return tableHTML;
}


// Crop Insurance Feature
const insuranceModal = document.getElementById('insuranceModal');
const insuranceBtn = document.getElementById('insuranceBtn');
const insuranceForm = document.getElementById('insuranceForm');
const insuranceSuccess = document.getElementById('insuranceSuccess');
const closeInsuranceSuccess = document.getElementById('closeInsuranceSuccess');
const premiumAmountDisplay = document.getElementById('premiumAmount');
const scrollToApplyBtn = document.getElementById('scrollToApplyBtn');

// Open insurance modal
if (insuranceBtn) {
    insuranceBtn.addEventListener('click', () => {
        insuranceModal.style.display = 'block';
        insuranceForm.style.display = 'block';
        insuranceSuccess.style.display = 'none';
        
        // Ensure modal content is scrollable
        const modalContent = insuranceModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.overflowY = 'scroll';
            modalContent.scrollTop = 0;
        }
        
        // Prevent body scroll but allow modal scroll
        document.body.style.overflow = 'hidden';
    });
}

// Open insurance modal and scroll to application form directly
const applyNowHeaderBtn = document.getElementById('applyNowHeaderBtn');
if (applyNowHeaderBtn) {
    applyNowHeaderBtn.addEventListener('click', () => {
        // Open the insurance modal
        insuranceModal.style.display = 'block';
        insuranceForm.style.display = 'block';
        insuranceSuccess.style.display = 'none';
        
        // Ensure modal content is scrollable
        const modalContent = insuranceModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.overflowY = 'scroll';
            modalContent.scrollTop = 0;
        }
        
        // Prevent body scroll but allow modal scroll
        document.body.style.overflow = 'hidden';
        
        // Wait for modal to render, then scroll to form
        setTimeout(() => {
            if (modalContent && insuranceForm) {
                // Calculate the position of the form relative to the modal content
                const formPosition = insuranceForm.offsetTop;
                
                // Scroll the modal content to the form
                modalContent.scrollTo({
                    top: formPosition - 20,
                    behavior: 'smooth'
                });
                
                // Focus first input after scroll
                setTimeout(() => {
                    const firstInput = insuranceForm.querySelector('input, select');
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.style.border = '2px solid #48bb78';
                        setTimeout(() => {
                            firstInput.style.border = '';
                        }, 2000);
                    }
                }, 800);
            }
        }, 100);
    });
}

// Scroll to application form
if (scrollToApplyBtn) {
    scrollToApplyBtn.addEventListener('click', () => {
        console.log('Apply Now button clicked - scrolling to form');
        
        // Add visual feedback
        scrollToApplyBtn.textContent = currentLanguage === 'en' ? '⏬ Scrolling to form...' :
                                       currentLanguage === 'te' ? '⏬ ఫారమ్‌కు స్క్రోల్ చేస్తోంది...' :
                                       '⏬ फॉर्म पर स्क्रॉल कर रहा है...';
        
        scrollToApplyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        setTimeout(() => {
            // Get the modal content container
            const modalContent = insuranceModal.querySelector('.modal-content');
            
            if (modalContent && insuranceForm) {
                // Calculate the position of the form relative to the modal content
                const formPosition = insuranceForm.offsetTop;
                
                // Scroll the modal content to the form
                modalContent.scrollTo({
                    top: formPosition - 20, // 20px offset for better visibility
                    behavior: 'smooth'
                });
            }
            
            // Reset button text after scroll
            setTimeout(() => {
                scrollToApplyBtn.textContent = translations[currentLanguage].applyNow;
                scrollToApplyBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
                
                // Focus first input
                const firstInput = insuranceForm.querySelector('input, select');
                if (firstInput) {
                    firstInput.focus();
                    firstInput.style.border = '2px solid #48bb78';
                    setTimeout(() => {
                        firstInput.style.border = '';
                    }, 2000);
                }
            }, 800);
        }, 200);
    });
}

// Scroll to top of insurance modal
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        console.log('Back to Top button clicked - scrolling to top');
        
        // Add visual feedback
        scrollToTopBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        
        // Get the modal content container
        const modalContent = insuranceModal.querySelector('.modal-content');
        
        if (modalContent) {
            // Scroll to the top of the modal content
            modalContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Reset button style after scroll
        setTimeout(() => {
            scrollToTopBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 800);
    });
}

// View Benefits button - same as Back to Top
const viewBenefitsBtn = document.getElementById('viewBenefitsBtn');
if (viewBenefitsBtn) {
    viewBenefitsBtn.addEventListener('click', () => {
        console.log('View Benefits button clicked - scrolling to top');
        
        // Add visual feedback
        viewBenefitsBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        
        // Get the modal content container
        const modalContent = insuranceModal.querySelector('.modal-content');
        
        if (modalContent) {
            // Scroll to the top of the modal content
            modalContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Reset button style after scroll
        setTimeout(() => {
            viewBenefitsBtn.style.background = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
        }, 800);
    });
}

// Close Insurance Modal button
const closeInsuranceModalBtn = document.getElementById('closeInsuranceModalBtn');
if (closeInsuranceModalBtn) {
    closeInsuranceModalBtn.addEventListener('click', () => {
        console.log('Close Insurance Modal button clicked');
        insuranceModal.style.display = 'none';
        insuranceForm.style.display = 'block';
        insuranceSuccess.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Reset form and scroll position
        const modalContent = insuranceModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    });
}

// Scroll to Submit Button
const scrollToSubmitBtn = document.getElementById('scrollToSubmitBtn');
if (scrollToSubmitBtn) {
    scrollToSubmitBtn.addEventListener('click', () => {
        console.log('Scroll to Submit button clicked');
        
        // Add visual feedback
        scrollToSubmitBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        scrollToSubmitBtn.innerHTML = currentLanguage === 'en' ? '⏬ Scrolling...' :
                                      currentLanguage === 'te' ? '⏬ స్క్రోల్ చేస్తోంది...' :
                                      '⏬ स्क्रॉल कर रहा है...';
        
        // Get the modal content container and submit button
        const modalContent = insuranceModal.querySelector('.modal-content');
        const submitBtn = document.getElementById('submitInsuranceBtn');
        
        if (modalContent && submitBtn) {
            // Calculate the position of the submit button relative to the modal content
            const submitPosition = submitBtn.offsetTop;
            
            // Scroll the modal content to the submit button with some offset
            modalContent.scrollTo({
                top: submitPosition - 100, // 100px offset from top for better visibility
                behavior: 'smooth'
            });
            
            // Highlight the submit button
            submitBtn.style.animation = 'none';
            setTimeout(() => {
                submitBtn.style.animation = 'pulse-submit 1s ease-in-out 3';
            }, 10);
        }
        
        // Reset button after scroll
        setTimeout(() => {
            scrollToSubmitBtn.style.background = 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
            scrollToSubmitBtn.innerHTML = '⬇️ <span data-translate="scrollToSubmit">' + 
                                          translations[currentLanguage].scrollToSubmit + '</span>';
        }, 1000);
    });
}

// Hide scroll down indicator when user scrolls
const scrollDownIndicator = document.getElementById('scrollDownIndicator');
if (insuranceModal && scrollDownIndicator) {
    const modalContent = insuranceModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('scroll', () => {
            if (modalContent.scrollTop > 100) {
                scrollDownIndicator.style.display = 'none';
            } else {
                scrollDownIndicator.style.display = 'block';
            }
        });
    }
}

// Calculate premium based on sum insured
const insSumInsured = document.getElementById('insSumInsured');
const insCrop = document.getElementById('insCrop');

if (insSumInsured && insCrop) {
    const calculatePremium = () => {
        const sumInsured = parseFloat(insSumInsured.value) || 0;
        const crop = insCrop.value;
        
        // Premium rates based on crop type (as per PMFBY guidelines)
        const premiumRates = {
            'rice': 0.015,      // 1.5% for Kharif crops
            'maize': 0.015,
            'cotton': 0.015,
            'groundnut': 0.015,
            'soybean': 0.015,
            'wheat': 0.02,      // 2% for Rabi crops
            'chickpea': 0.02,
            'sugarcane': 0.05   // 5% for commercial/horticultural crops
        };
        
        const rate = premiumRates[crop] || 0.02;
        const premium = Math.round(sumInsured * rate);
        
        premiumAmountDisplay.textContent = `₹ ${premium.toLocaleString('en-IN')}`;
    };
    
    insSumInsured.addEventListener('input', calculatePremium);
    insCrop.addEventListener('change', calculatePremium);
}

// Auto-format Aadhar number with spaces (XXXX XXXX XXXX)
const insAadhar = document.getElementById('insAadhar');
if (insAadhar) {
    insAadhar.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, ''); // Remove existing spaces
        value = value.replace(/\D/g, ''); // Remove non-digits
        
        // Limit to 12 digits
        if (value.length > 12) {
            value = value.substring(0, 12);
        }
        
        // Add spaces after every 4 digits
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
        
        // Visual feedback - green border when valid, red when invalid
        if (value.length === 12) {
            e.target.style.borderColor = '#48bb78'; // Green
            e.target.style.borderWidth = '2px';
        } else if (value.length > 0) {
            e.target.style.borderColor = '#f56565'; // Red
            e.target.style.borderWidth = '2px';
        } else {
            e.target.style.borderColor = '#e2e8f0'; // Default
            e.target.style.borderWidth = '2px';
        }
    });
}

// Handle insurance form submission
if (insuranceForm) {
    insuranceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate Aadhar number
        const aadharInput = document.getElementById('insAadhar').value;
        const aadharClean = aadharInput.replace(/\s/g, ''); // Remove spaces
        
        if (aadharClean.length !== 12 || !/^\d{12}$/.test(aadharClean)) {
            alert(currentLanguage === 'en' ? 'Please enter a valid 12-digit Aadhar number' :
                  currentLanguage === 'te' ? 'దయచేసి చెల్లుబాటు అయ్యే 12 అంకెల ఆధార్ నంబర్‌ను నమోదు చేయండి' :
                  'कृपया एक मान्य 12 अंकों का आधार नंबर दर्ज करें');
            document.getElementById('insAadhar').focus();
            return;
        }
        
        // Get form data
        const formData = {
            // Personal Details
            name: document.getElementById('insName').value,
            phone: document.getElementById('insPhone').value,
            aadhar: aadharClean, // Store clean Aadhar without spaces
            
            // Farm Details
            location: document.getElementById('insLocation').value,
            area: document.getElementById('insArea').value,
            crop: document.getElementById('insCrop').value,
            season: document.getElementById('insSeason').value,
            sumInsured: document.getElementById('insSumInsured').value,
            premium: premiumAmountDisplay.textContent,
            
            // Identity Proof Details
            idProofType: document.getElementById('insIdProofType').value,
            idProofNumber: document.getElementById('insIdProofNumber').value,
            fatherName: document.getElementById('insFatherName').value,
            dateOfBirth: document.getElementById('insDateOfBirth').value,
            
            // Bank Details
            bankName: document.getElementById('insBankName').value,
            branchName: document.getElementById('insBranchName').value,
            accountNumber: document.getElementById('insAccountNumber').value,
            ifscCode: document.getElementById('insIfscCode').value,
            accountHolderName: document.getElementById('insAccountHolderName').value,
            
            // Land Ownership Details
            landOwnershipType: document.getElementById('insLandOwnershipType').value,
            surveyNumber: document.getElementById('insSurveyNumber').value,
            village: document.getElementById('insVillage').value,
            district: document.getElementById('insDistrict').value,
            landArea: document.getElementById('insLandArea').value,
            irrigationType: document.getElementById('insIrrigationType').value,
            landDocumentNumber: document.getElementById('insLandDocumentNumber').value,
            
            // Application Metadata
            applicationDate: new Date().toISOString(),
            userId: currentUser ? currentUser.username : 'guest'
        };
        
        // Save to localStorage
        const applications = JSON.parse(localStorage.getItem('cropxai_insurance_applications')) || [];
        applications.push(formData);
        localStorage.setItem('cropxai_insurance_applications', JSON.stringify(applications));
        
        // Show success message
        insuranceForm.style.display = 'none';
        insuranceSuccess.style.display = 'block';
        
        // Reset form
        insuranceForm.reset();
        premiumAmountDisplay.textContent = '₹ 0';
        
        // Voice announcement
        if (currentLanguage === 'en') {
            speak('Your crop insurance application has been submitted successfully');
        } else if (currentLanguage === 'te') {
            speak('మీ పంట బీమా దరఖాస్తు విజయవంతంగా సమర్పించబడింది');
        } else if (currentLanguage === 'hi') {
            speak('आपका फसल बीमा आवेदन सफलतापूर्वक जमा किया गया है');
        }
    });
}

// Close success message
if (closeInsuranceSuccess) {
    closeInsuranceSuccess.addEventListener('click', () => {
        insuranceModal.style.display = 'none';
        insuranceSuccess.style.display = 'none';
        insuranceForm.style.display = 'block';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    });
}

// Voice command for insurance
function processVoiceCommand(text) {
    text = text.toLowerCase();
    
    const messages = {
        en: {
            processing: 'Processing your request...',
            recommend: 'Getting crop recommendation...',
            profile: 'Opening your profile...',
            climate: 'Please select climate from the form',
            soil: 'Please select soil type from the form',
            help: 'You can say: recommend crop, show profile, fill climate, fill soil type, auto detect values, apply for insurance',
            autoFill: 'Auto-filling soil parameters...',
            insurance: 'Opening crop insurance application...',
            notUnderstood: 'Sorry, I did not understand. Try saying: recommend crop, show profile, apply for insurance, or help'
        },
        te: {
            processing: 'మీ అభ్యర్థనను ప్రాసెస్ చేస్తోంది...',
            recommend: 'పంట సిఫార్సును పొందుతోంది...',
            profile: 'మీ ప్రొఫైల్‌ను తెరుస్తోంది...',
            climate: 'దయచేసి ఫారమ్ నుండి వాతావరణాన్ని ఎంచుకోండి',
            soil: 'దయచేసి ఫారమ్ నుండి నేల రకాన్ని ఎంచుకోండి',
            help: 'మీరు చెప్పవచ్చు: పంట సిఫార్సు చేయండి, ప్రొఫైల్ చూపించండి, వాతావరణం నింపండి, నేల రకం నింపండి, విలువలను ఆటో డిటెక్ట్ చేయండి, బీమా కోసం దరఖాస్తు చేయండి',
            autoFill: 'నేల పారామితులను ఆటో-ఫిల్ చేస్తోంది...',
            insurance: 'పంట బీమా దరఖాస్తును తెరుస్తోంది...',
            notUnderstood: 'క్షమించండి, నాకు అర్థం కాలేదు. ప్రయత్నించండి: పంట సిఫార్సు చేయండి, ప్రొఫైల్ చూపించండి, బీమా కోసం దరఖాస్తు చేయండి, లేదా సహాయం'
        },
        hi: {
            processing: 'आपके अनुरोध को प्रोसेस कर रहा है...',
            recommend: 'फसल सिफारिश प्राप्त कर रहा है...',
            profile: 'आपकी प्रोफ़ाइल खोल रहा है...',
            climate: 'कृपया फॉर्म से जलवायु चुनें',
            soil: 'कृपया फॉर्म से मिट्टी का प्रकार चुनें',
            help: 'आप कह सकते हैं: फसल की सिफारिश करें, प्रोफ़ाइल दिखाएं, जलवायु भरें, मिट्टी का प्रकार भरें, मूल्यों का ऑटो पता लगाएं, बीमा के लिए आवेदन करें',
            autoFill: 'मिट्टी के पैरामीटर ऑटो-भर रहा है...',
            insurance: 'फसल बीमा आवेदन खोल रहा है...',
            notUnderstood: 'क्षमा करें, मुझे समझ नहीं आया। कोशिश करें: फसल की सिफारिश करें, प्रोफ़ाइल दिखाएं, बीमा के लिए आवेदन करें, या मदद'
        }
    };
    
    const msg = messages[currentLanguage];
    
    // Insurance commands
    if (text.includes('insurance') || text.includes('bima') || text.includes('बीमा') || 
        text.includes('apply') || text.includes('pmfby') || text.includes('fasal')) {
        voiceTranscript.textContent += '\n\n' + msg.insurance;
        setTimeout(() => {
            if (insuranceBtn) insuranceBtn.click();
            voiceModal.style.display = 'none';
        }, 1000);
        return;
    }
    
    // ... rest of the voice commands remain the same
}

// Text-to-speech function
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'en' ? 'en-US' : 
                        currentLanguage === 'te' ? 'te-IN' : 'hi-IN';
        speechSynthesis.speak(utterance);
    }
}


// Text-to-Speech for Recommendations
let currentSpeech = null;

function readRecommendationsAloud(recommendations, inputs, location) {
    const readBtn = document.getElementById('readRecommendationsBtn');
    
    // If already speaking, stop it
    if (currentSpeech && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
        return;
    }
    
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        alert(currentLanguage === 'en' ? 'Text-to-speech is not supported in your browser' :
              currentLanguage === 'te' ? 'మీ బ్రౌజర్‌లో టెక్స్ట్-టు-స్పీచ్ మద్దతు లేదు' :
              'आपके ब्राउज़र में टेक्स्ट-टू-स्पीच समर्थित नहीं है');
        return;
    }
    
    // Update button to show "Stop Reading"
    if (readBtn) {
        readBtn.textContent = `⏹️ ${translations[currentLanguage].stopReading}`;
        readBtn.classList.add('reading');
    }
    
    // Get location details
    const locationDetails = getLocationDetails(location, currentLanguage);
    const locationName = locationDetails ? locationDetails.name : location;
    
    // Build the text to read
    let textToRead = '';
    
    // Introduction
    if (currentLanguage === 'en') {
        textToRead = `Top Crop Recommendations for ${locationName}. `;
    } else if (currentLanguage === 'te') {
        textToRead = `${locationName} kosam top panta sifarasulu. `;
    } else {
        textToRead = `${locationName} ke liye sheersh fasal sifarishein. `;
    }
    
    // Add each recommendation
    recommendations.forEach((rec, index) => {
        const crop = rec.crop;
        const confidence = rec.confidence;
        const explanation = rec.explanation;
        
        if (index === 0) {
            if (currentLanguage === 'en') {
                textToRead += `Best recommendation: ${crop.name[currentLanguage]}. `;
                textToRead += `Confidence score: ${confidence} percent. `;
                textToRead += `${explanation.summary} `;
            } else if (currentLanguage === 'te') {
                textToRead += `Uttama sifarasu: ${crop.name['en']}. `;
                textToRead += `Vishwasa score: ${confidence} shatam. `;
                // Use English explanation for better pronunciation
                textToRead += `${explanation.summary} `;
            } else {
                textToRead += `Sarvashreshth sifarish: ${crop.name['en']}. `;
                textToRead += `Vishwas score: ${confidence} pratishat. `;
                textToRead += `${explanation.summary} `;
            }
        } else {
            if (currentLanguage === 'en') {
                textToRead += `Alternative ${index + 1}: ${crop.name[currentLanguage]}. `;
                textToRead += `Confidence: ${confidence} percent. `;
            } else if (currentLanguage === 'te') {
                textToRead += `Pratyamnyam ${index + 1}: ${crop.name['en']}. `;
                textToRead += `Vishwasam: ${confidence} shatam. `;
            } else {
                textToRead += `Vikalp ${index + 1}: ${crop.name['en']}. `;
                textToRead += `Vishwas: ${confidence} pratishat. `;
            }
        }
    });
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    let selectedVoice = null;
    
    // Try to find appropriate voice based on language
    if (currentLanguage === 'en') {
        utterance.lang = 'en-US';
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
    } else if (currentLanguage === 'te') {
        // Try Telugu voice first
        utterance.lang = 'te-IN';
        selectedVoice = voices.find(voice => voice.lang.startsWith('te'));
        
        // Fallback to Hindi if Telugu not available
        if (!selectedVoice) {
            utterance.lang = 'hi-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
        }
        
        // Final fallback to English
        if (!selectedVoice) {
            utterance.lang = 'en-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-IN') || voice.lang.startsWith('en'));
        }
    } else {
        // Hindi
        utterance.lang = 'hi-IN';
        selectedVoice = voices.find(voice => voice.lang.startsWith('hi'));
        
        // Fallback to English if Hindi not available
        if (!selectedVoice) {
            utterance.lang = 'en-IN';
            selectedVoice = voices.find(voice => voice.lang.startsWith('en-IN') || voice.lang.startsWith('en'));
        }
    }
    
    // Set the voice if found
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }
    
    // Set speech properties
    utterance.rate = 0.85; // Slower for better clarity in regional languages
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Handle speech end
    utterance.onend = () => {
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
    };
    
    // Handle speech error
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        currentSpeech = null;
        if (readBtn) {
            readBtn.textContent = `🔊 ${translations[currentLanguage].readAloud}`;
            readBtn.classList.remove('reading');
        }
    };
    
    // Wait for voices to load if not already loaded
    if (voices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            const newVoices = speechSynthesis.getVoices();
            if (currentLanguage === 'te') {
                const teluguVoice = newVoices.find(voice => voice.lang.startsWith('te'));
                if (teluguVoice) utterance.voice = teluguVoice;
            }
            currentSpeech = utterance;
            speechSynthesis.speak(utterance);
        }, { once: true });
    } else {
        // Start speaking immediately
        currentSpeech = utterance;
        speechSynthesis.speak(utterance);
    }
}

// Stop speech when language changes
languageSelector.addEventListener('change', () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        currentSpeech = null;
    }
});
