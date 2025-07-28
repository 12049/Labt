// هذا الملف سيتعامل مع حفظ واسترجاع النتائج
// يمكن استخدام localStorage لحفظ النتائج محلياً

// دالة لحفظ النتائج
function saveResult(result) {
    // الحصول على النتائج الحالية من localStorage
    const existingResults = JSON.parse(localStorage.getItem('quizResults')) || [];
    
    // إضافة النتيجة الجديدة
    existingResults.push(result);
    
    // حفظ النتائج المحدثة
    localStorage.setItem('quizResults', JSON.stringify(existingResults));
}

// دالة لاسترجاع النتائج
function getResults() {
    return JSON.parse(localStorage.getItem('quizResults')) || [];
}

// دالة لحذف النتائج
function clearResults() {
    localStorage.removeItem('quizResults');
}

// دالة للحصول على نتائج وحدة محددة
function getResultsByUnit(unitId) {
    const results = getResults();
    return results.filter(result => result.unit === unitId);
}

// دالة للحصول على نتائج اختبار محدد
function getResultsByTest(unitId, testId) {
    const results = getResults();
    return results.filter(result => result.unit === unitId && result.test === testId);
}