/**
 * هذا الملف مسؤول عن إدارة النتائج وحفظها
 * 
 * الوظائف:
 * 1. حفظ النتائج في localStorage
 * 2. استرجاع النتائج
 * 3. حذف النتائج
 * 4. تصفية النتائج حسب الوحدة/الدرس/الاختبار
 */

// دالة لحفظ النتيجة
function saveResult(result) {
    try {
        // الحصول على النتائج الحالية
        const existingResults = JSON.parse(localStorage.getItem('quizResults')) || [];
        
        // إضافة النتيجة الجديدة
        existingResults.push(result);
        
        // حفظ النتائج المحدثة
        localStorage.setItem('quizResults', JSON.stringify(existingResults));
        
        // حفظ نسخة احتياطية في ملف JSON (محاكاة)
        downloadResultsBackup(existingResults);
        
        return true;
    } catch (error) {
        console.error('حدث خطأ أثناء حفظ النتيجة:', error);
        return false;
    }
}

// دالة لاسترجاع جميع النتائج
function getResults() {
    try {
        return JSON.parse(localStorage.getItem('quizResults')) || [];
    } catch (error) {
        console.error('حدث خطأ أثناء استرجاع النتائج:', error);
        return [];
    }
}

// دالة لتصفية النتائج حسب المعايير
function filterResults(criteria) {
    const results = getResults();
    return results.filter(result => {
        return (!criteria.unitId || result.unitId === criteria.unitId) &&
               (!criteria.lessonId || result.lessonId === criteria.lessonId) &&
               (!criteria.testId || result.testId === criteria.testId);
    });
}

// دالة لتنزيل نسخة احتياطية من النتائج (محاكاة)
function downloadResultsBackup(results) {
    // في تطبيق حقيقي، هنا سيتم إرسال البيانات إلى الخادم
    // لكننا سنحاكي هذه العملية
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // هذا الكود للتوضيح فقط ولن يعمل فعلياً في المتصفح
    console.log('تم إنشاء نسخة احتياطية من النتائج:', blob);
}

// دالة لحذف النتائج
function clearResults() {
    try {
        localStorage.removeItem('quizResults');
        return true;
    } catch (error) {
        console.error('حدث خطأ أثناء حذف النتائج:', error);
        return false;
    }
}

// ===== أمثلة استخدام =====
// saveResult({ unit: 1, lesson: 1, test: 1, score: 8, total: 10 });
// const results = getResults();
// const unitResults = filterResults({ unitId: 1 });
