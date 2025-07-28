/**
 * هذا الملف يحتوي على المنطق الرئيسي للتطبيق
 * 
 * الهيكلية:
 * 1. تعريف المتغيرات العامة
 * 2. تهيئة التطبيق
 * 3. عرض الوحدات
 * 4. عرض الدروس
 * 5. عرض الاختبارات
 * 6. إدارة الأسئلة
 * 7. حساب النتائج
 * 8. مستمعات الأحداث
 */

// ==================== 1. المتغيرات العامة ====================
let appData = {
    units: [],
    currentUnit: null,
    currentLesson: null,
    currentTest: null,
    currentQuestion: 0,
    userAnswers: [],
    startTime: null,
    timerInterval: null
};

// عناصر DOM
const sections = {
    units: document.getElementById('units-section'),
    lessons: document.getElementById('lessons-section'),
    tests: document.getElementById('tests-section'),
    quiz: document.getElementById('quiz-section'),
    results: document.getElementById('results-section')
};

const containers = {
    units: document.querySelector('.units-container'),
    lessons: document.querySelector('.lessons-container'),
    tests: document.querySelector('.tests-container'),
    quiz: document.querySelector('.quiz-container')
};

const navButtons = {
    backToUnits: document.getElementById('back-to-units'),
    backToLessons: document.getElementById('back-to-lessons'),
    backToTests: document.getElementById('back-to-tests'),
    backToTestsFromResults: document.getElementById('back-to-tests-from-results')
};

const quizElements = {
    time: document.getElementById('time'),
    progressText: document.querySelector('.progress-text'),
    progressBar: document.querySelector('.progress-bar-inner'),
    prevQuestion: document.getElementById('prev-question'),
    nextQuestion: document.getElementById('next-question'),
    submitQuiz: document.getElementById('submit-quiz')
};

const resultElements = {
    score: document.getElementById('score'),
    total: document.getElementById('total'),
    correctCount: document.getElementById('correct-count'),
    wrongCount: document.getElementById('wrong-count'),
    percentage: document.getElementById('percentage'),
    restartQuiz: document.getElementById('restart-quiz')
};

// ==================== 2. تهيئة التطبيق ====================
function initApp() {
    // تحميل البيانات من ملف data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            appData.units = data.units;
            renderUnits();
            setupEventListeners();
        })
        .catch(error => {
            console.error('حدث خطأ في تحميل البيانات:', error);
            alert('تعذر تحميل البيانات، يرجى إعادة تحميل الصفحة');
        });
}

// ==================== 3. عرض الوحدات ====================
function renderUnits() {
    containers.units.innerHTML = '';
    
    appData.units.forEach(unit => {
        const unitCard = document.createElement('div');
        unitCard.className = 'unit-card';
        unitCard.innerHTML = `
            <div class="badge">الوحدة ${unit.id}</div>
            <i class="${unit.icon}"></i>
            <h3>${unit.title}</h3>
            <p>${unit.description}</p>
        `;
        
        unitCard.addEventListener('click', () => {
            appData.currentUnit = unit;
            showLessonsSection();
        });
        
        containers.units.appendChild(unitCard);
    });
}

// ==================== 4. عرض الدروس ====================
function renderLessons() {
    containers.lessons.innerHTML = '';
    
    appData.currentUnit.lessons.forEach(lesson => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        lessonCard.innerHTML = `
            <div class="badge">الدرس ${lesson.id}</div>
            <i class="${lesson.icon}"></i>
            <h3>${lesson.title}</h3>
            <p>${lesson.description}</p>
        `;
        
        lessonCard.addEventListener('click', () => {
            appData.currentLesson = lesson;
            showTestsSection();
        });
        
        containers.lessons.appendChild(lessonCard);
    });
}

// ==================== 5. عرض الاختبارات ====================
function renderTests() {
    containers.tests.innerHTML = '';
    
    appData.currentLesson.tests.forEach(test => {
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
            <div class="badge">اختبار ${test.id}</div>
            <i class="${test.icon}"></i>
            <h3>${test.title}</h3>
            <p>${test.description}</p>
        `;
        
        testCard.addEventListener('click', () => {
            appData.currentTest = test;
            startQuiz();
        });
        
        containers.tests.appendChild(testCard);
    });
}

// ==================== 6. إدارة الأسئلة ====================
function startQuiz() {
    appData.currentQuestion = 0;
    appData.userAnswers = Array(appData.currentTest.questions.length).fill(null);
    appData.startTime = new Date();
    
    renderQuestion();
    startTimer();
    showSection(sections.quiz);
}

function renderQuestion() {
    const question = appData.currentTest.questions[appData.currentQuestion];
    
    containers.quiz.innerHTML = `
        <div class="question">
            <div class="question-number">السؤال ${appData.currentQuestion + 1}</div>
            <div class="question-text">${question.text}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option ${getOptionClass(index)}">
                        <input type="radio" name="answer" value="${index}" 
                            ${appData.userAnswers[appData.currentQuestion] === index ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // إضافة مستمعات الأحداث للإجابات
    const radioInputs = containers.quiz.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            appData.userAnswers[appData.currentQuestion] = parseInt(e.target.value);
        });
    });
    
    // تحديث شريط التقدم
    const progressPercent = ((appData.currentQuestion + 1) / appData.currentTest.questions.length) * 100;
    quizElements.progressBar.style.width = `${progressPercent}%`;
    quizElements.progressText.textContent = `السؤال ${appData.currentQuestion + 1} من ${appData.currentTest.questions.length}`;
    
    // تحديث حالة الأزرار
    quizElements.prevQuestion.disabled = appData.currentQuestion === 0;
    quizElements.nextQuestion.disabled = appData.currentQuestion === appData.currentTest.questions.length - 1;
    quizElements.submitQuiz.style.display = 
        appData.currentQuestion === appData.currentTest.questions.length - 1 ? 'block' : 'none';
}

function getOptionClass(optionIndex) {
    if (appData.userAnswers[appData.currentQuestion] === optionIndex) {
        return 'selected';
    }
    return '';
}

function startTimer() {
    // تعيين الوقت الابتدائي (10 دقائق)
    let minutes = 10;
    let seconds = 0;
    
    clearInterval(appData.timerInterval);
    
    appData.timerInterval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            minutes--;
            seconds = 59;
        }
        
        if (minutes < 0) {
            clearInterval(appData.timerInterval);
            submitQuiz();
            return;
        }
        
        quizElements.time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// ==================== 7. حساب النتائج ====================
function submitQuiz() {
    clearInterval(appData.timerInterval);
    
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - appData.startTime) / 1000);
    
    let correctCount = 0;
    
    appData.userAnswers.forEach((answer, index) => {
        const question = appData.currentTest.questions[index];
        if (answer === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const totalQuestions = appData.currentTest.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    // حفظ النتائج
    saveResult({
        unitId: appData.currentUnit.id,
        lessonId: appData.currentLesson.id,
        testId: appData.currentTest.id,
        date: new Date().toISOString(),
        score: correctCount,
        total: totalQuestions,
        percentage: percentage,
        timeTaken: timeTaken
    });
    
    // عرض النتائج
    showResults(correctCount, totalQuestions, percentage, timeTaken);
}

function showResults(correctCount, totalQuestions, percentage, timeTaken) {
    resultElements.score.textContent = correctCount;
    resultElements.total.textContent = totalQuestions;
    resultElements.correctCount.textContent = correctCount;
    resultElements.wrongCount.textContent = totalQuestions - correctCount;
    resultElements.percentage.textContent = percentage;
    
    // تحديث شارة النتائج
    const resultBadge = document.querySelector('.result-badge');
    if (percentage >= 80) {
        resultBadge.style.background = 'linear-gradient(135deg, #28a745, #4cc9f0)';
    } else if (percentage >= 50) {
        resultBadge.style.background = 'linear-gradient(135deg, #ffc107, #fd7e14)';
    } else {
        resultBadge.style.background = 'linear-gradient(135deg, #dc3545, #f72585)';
    }
    
    showSection(sections.results);
}

// ==================== 8. مستمعات الأحداث ====================
function setupEventListeners() {
    // أزرار التنقل
    navButtons.backToUnits.addEventListener('click', showUnitsSection);
    navButtons.backToLessons.addEventListener('click', showLessonsSection);
    navButtons.backToTests.addEventListener('click', showTestsSection);
    navButtons.backToTestsFromResults.addEventListener('click', showTestsSection);
    
    // أزرار التنقل بين الأسئلة
    quizElements.prevQuestion.addEventListener('click', () => {
        if (appData.currentQuestion > 0) {
            appData.currentQuestion--;
            renderQuestion();
        }
    });
    
    quizElements.nextQuestion.addEventListener('click', () => {
        if (appData.currentQuestion < appData.currentTest.questions.length - 1) {
            appData.currentQuestion++;
            renderQuestion();
        }
    });
    
    // زر تقديم الاختبار
    quizElements.submitQuiz.addEventListener('click', submitQuiz);
    
    // زر إعادة الاختبار
    resultElements.restartQuiz.addEventListener('click', startQuiz);
}

// وظائف العرض
function showSection(section) {
    Object.values(sections).forEach(sec => {
        sec.classList.remove('active');
    });
    section.classList.add('active');
}

function showUnitsSection() {
    appData.currentUnit = null;
    showSection(sections.units);
}

function showLessonsSection() {
    renderLessons();
    showSection(sections.lessons);
}

function showTestsSection() {
    renderTests();
    showSection(sections.tests);
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
