// بيانات الوحدات والاختبارات
const units = [
    {
        id: 1,
        title: "الوحدة الأولى",
        description: "القواعد الأساسية والكلمات الشائعة",
        icon: "fas fa-book",
        progress: 30
    },
    {
        id: 2,
        title: "الوحدة الثانية",
        description: "الأزمنة البسيطة",
        icon: "fas fa-clock",
        progress: 10
    },
    {
        id: 3,
        title: "الوحدة الثالثة",
        description: "الأزمنة المستمرة",
        icon: "fas fa-hourglass-half",
        progress: 0
    },
    {
        id: 4,
        title: "الوحدة الرابعة",
        description: "المبني للمعلوم والمجهول",
        icon: "fas fa-exchange-alt",
        progress: 0
    },
    {
        id: 5,
        title: "الوحدة الخامسة",
        description: "الأسماء والضمائر",
        icon: "fas fa-font",
        progress: 0
    },
    {
        id: 6,
        title: "الوحدة السادسة",
        description: "الصفات والظروف",
        icon: "fas fa-adjust",
        progress: 0
    },
    {
        id: 7,
        title: "الوحدة السابعة",
        description: "أدوات الربط",
        icon: "fas fa-link",
        progress: 0
    },
    {
        id: 8,
        title: "الوحدة الثامنة",
        description: "الجمل الشرطية",
        icon: "fas fa-code-branch",
        progress: 0
    },
    {
        id: 9,
        title: "الوحدة التاسعة",
        description: "المقارنات",
        icon: "fas fa-balance-scale",
        progress: 0
    },
    {
        id: 10,
        title: "الوحدة العاشرة",
        description: "المصادر والأفعال الناقصة",
        icon: "fas fa-infinity",
        progress: 0
    },
    {
        id: 11,
        title: "الوحدة الحادية عشر",
        description: "الاختبارات المتقدمة",
        icon: "fas fa-graduation-cap",
        progress: 0
    },
    {
        id: 12,
        title: "الوحدة الثانية عشر",
        description: "المراجعة النهائية",
        icon: "fas fa-star",
        progress: 0
    }
];

const tests = [
    { id: 1, title: "الاختبار الأول", description: "اختبار أساسيات القواعد", icon: "fas fa-pencil-alt" },
    { id: 2, title: "الاختبار الثاني", description: "اختبار المفردات", icon: "fas fa-font" },
    { id: 3, title: "الاختبار الثالث", description: "اختبار التحدث", icon: "fas fa-microphone" },
    { id: 4, title: "الاختبار الرابع", description: "اختبار الاستماع", icon: "fas fa-headphones" },
    { id: 5, title: "الاختبار الخامس", description: "اختبار القراءة", icon: "fas fa-book-reader" },
    { id: 6, title: "الاختبار السادس", description: "اختبار الكتابة", icon: "fas fa-edit" },
    { id: 7, title: "الاختبار السابع", description: "اختبار الترجمة", icon: "fas fa-language" },
    { id: 8, title: "الاختبار الثامن", description: "اختبار القواعد المتقدم", icon: "fas fa-chart-bar" },
    { id: 9, title: "الاختبار التاسع", description: "اختبار المفردات المتقدم", icon: "fas fa-bookmark" },
    { id: 10, title: "الاختبار العاشر", description: "الاختبار الشامل", icon: "fas fa-tasks" }
];

// أسئلة الاختبارات
const quizQuestions = [
    {
        id: 1,
        question: "ما هو الفعل المضارع من 'go' في الجملة: 'I ___ to school every day'?",
        options: [
            "go",
            "goes",
            "going",
            "went"
        ],
        correctAnswer: 0
    },
    {
        id: 2,
        question: "ما مرادف كلمة 'happy'?",
        options: [
            "Sad",
            "Angry",
            "Joyful",
            "Tired"
        ],
        correctAnswer: 2
    },
    {
        id: 3,
        question: "اختر الإجابة الصحيحة: 'She ___ a book now.'",
        options: [
            "read",
            "reads",
            "is reading",
            "reading"
        ],
        correctAnswer: 2
    }
];

// متغيرات الحالة
let currentUnit = null;
let currentTest = null;
let currentQuestion = 0;
let userAnswers = [];
let startTime = null;
let timerInterval = null;

// عناصر DOM
const unitsSection = document.getElementById('units-section');
const testsSection = document.getElementById('tests-section');
const quizSection = document.getElementById('quiz-section');
const resultsSection = document.getElementById('results-section');
const unitsContainer = document.querySelector('.units-container');
const testsContainer = document.querySelector('.tests-container');
const quizContainer = document.querySelector('.quiz-container');
const currentUnitElement = document.getElementById('current-unit');
const currentTestElement = document.getElementById('current-test');
const timeElement = document.getElementById('time');
const progressText = document.querySelector('.progress-text');
const progressBar = document.querySelector('.progress-bar');
const prevQuestionBtn = document.getElementById('prev-question');
const nextQuestionBtn = document.getElementById('next-question');
const submitQuizBtn = document.getElementById('submit-quiz');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const correctCountElement = document.getElementById('correct-count');
const wrongCountElement = document.getElementById('wrong-count');
const percentageElement = document.getElementById('percentage');
const timeTakenElement = document.getElementById('time-taken');

// تهيئة الواجهة
function initApp() {
    renderUnits();
    setupEventListeners();
}

// عرض الوحدات
function renderUnits() {
    unitsContainer.innerHTML = '';
    
    units.forEach(unit => {
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.innerHTML = `
            <i class="${unit.icon}"></i>
            <h3>${unit.title}</h3>
            <p>${unit.description}</p>
            <div class="unit-progress">
                <div class="unit-progress-bar" style="width: ${unit.progress}%"></div>
            </div>
        `;
        
        unitCard.addEventListener('click', () => {
            currentUnit = unit.id;
            showTestsSection();
        });
        
        unitsContainer.appendChild(unitCard);
    });
}

// عرض الاختبارات
function renderTests() {
    testsContainer.innerHTML = '';
    
    tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <i class="${test.icon}"></i>
            <h3>${test.title}</h3>
            <p>${test.description}</p>
        `;
        
        testCard.addEventListener('click', () => {
            currentTest = test.id;
            showQuizSection();
        });
        
        testsContainer.appendChild(testCard);
    });
}

// عرض السؤال الحالي
function renderQuestion() {
    quizContainer.innerHTML = '';
    
    const question = quizQuestions[currentQuestion];
    
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `
        <div class="question-number">السؤال ${currentQuestion + 1}</div>
        <div class="question-text">${question.question}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <label class="option">
                    <input type="radio" name="answer" value="${index}" 
                        ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span class="option-text">${option}</span>
                </label>
            `).join('')}
        </div>
    `;
    
    // إضافة مستمعات الأحداث للإجابات
    const radioInputs = questionElement.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            userAnswers[currentQuestion] = parseInt(e.target.value);
        });
    });
    
    quizContainer.appendChild(questionElement);
    
    // تحديث شريط التقدم
    const progressPercent = ((currentQuestion + 1) / quizQuestions.length) * 100;
    document.querySelector('.progress-bar').style.width = `${progressPercent}%`;
    progressText.textContent = `السؤال ${currentQuestion + 1} من ${quizQuestions.length}`;
    
    // تحديث حالة الأزرار
    prevQuestionBtn.disabled = currentQuestion === 0;
    nextQuestionBtn.disabled = currentQuestion === quizQuestions.length - 1;
    submitQuizBtn.style.display = currentQuestion === quizQuestions.length - 1 ? 'block' : 'none';
}

// بدء المؤقت
function startTimer() {
    startTime = new Date();
    
    // تعيين الوقت الابتدائي
    let minutes = 10;
    let seconds = 0;
    
    timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            minutes--;
            seconds = 59;
        }
        
        if (minutes < 0) {
            clearInterval(timerInterval);
            submitQuiz();
            return;
        }
        
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// إيقاف المؤقت
function stopTimer() {
    clearInterval(timerInterval);
}

// حساب النتائج
function calculateResults() {
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    
    let correctCount = 0;
    
    userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correctAnswer) {
            correctCount++;
        }
    });
    
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    return {
        score: correctCount,
        total: totalQuestions,
        correctCount,
        wrongCount: totalQuestions - correctCount,
        percentage,
        timeTaken
    };
}

// عرض النتائج
function showResults() {
    const results = calculateResults();
    
    scoreElement.textContent = results.score;
    totalElement.textContent = results.total;
    correctCountElement.textContent = results.correctCount;
    wrongCountElement.textContent = results.wrongCount;
    percentageElement.textContent = results.percentage;
    timeTakenElement.textContent = results.timeTaken;
    
    // تحديث شارة النتائج
    const resultBadge = document.querySelector('.result-badge');
    if (results.percentage >= 80) {
        resultBadge.style.background = 'linear-gradient(135deg, #28a745, #4cc9f0)';
    } else if (results.percentage >= 50) {
        resultBadge.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
    } else {
        resultBadge.style.background = 'linear-gradient(135deg, #dc3545, #f72585)';
    }
    
    showSection(resultsSection);
}

// تقديم الاختبار
function submitQuiz() {
    stopTimer();
    saveResults();
    showResults();
}

// حفظ النتائج
function saveResults() {
    const results = calculateResults();
    const resultData = {
        unit: currentUnit,
        test: currentTest,
        date: new Date().toISOString(),
        score: results.score,
        total: results.total,
        percentage: results.percentage,
        timeTaken: results.timeTaken
    };
    
    // هنا يمكنك إضافة كود لحفظ النتائج في localStorage أو قاعدة البيانات
    console.log('نتيجة الاختبار:', resultData);
}

// إظهار قسم معين وإخفاء الآخرين
function showSection(section) {
    [unitsSection, testsSection, quizSection, resultsSection].forEach(sec => {
        sec.classList.remove('active');
    });
    section.classList.add('active');
}

// إظهار قسم الوحدات
function showUnitsSection() {
    showSection(unitsSection);
}

// إظهار قسم الاختبارات
function showTestsSection() {
    renderTests();
    showSection(testsSection);
}

// إظهار قسم الاختبار
function showQuizSection() {
    currentQuestion = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    renderQuestion();
    startTimer();
    
    // تحديث معلومات الاختبار
    const unitTitle = units.find(u => u.id === currentUnit).title;
    const testTitle = tests.find(t => t.id === currentTest).title;
    currentUnitElement.textContent = unitTitle;
    currentTestElement.textContent = testTitle;
    
    showSection(quizSection);
}

// إعداد مستمعات الأحداث
function setupEventListeners() {
    // أزرار التنقل
    document.getElementById('back-to-units').addEventListener('click', showUnitsSection);
    document.getElementById('back-to-tests').addEventListener('click', showTestsSection);
    document.getElementById('back-to-tests-from-results').addEventListener('click', showTestsSection);
    
    // أزرار التنقل بين الأسئلة
    prevQuestionBtn.addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    });
    
    nextQuestionBtn.addEventListener('click', () => {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            renderQuestion();
        }
    });
    
    // زر تقديم الاختبار
    submitQuizBtn.addEventListener('click', submitQuiz);
    
    // أزرار النتائج
    document.getElementById('restart-quiz').addEventListener('click', () => {
        showQuizSection();
    });
    
    document.getElementById('view-answers').addEventListener('click', () => {
        alert('هذه الميزة ستكون متاحة في الإصدارات القادمة!');
    });
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);