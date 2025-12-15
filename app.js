/**
 * SSGS 核心 JavaScript 邏輯
 * (僅列出修改後的 checkStudentId 函數)
 */

function checkStudentId() {
    const studentIdInput = document.getElementById('studentId').value;
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // 清除舊訊息

    if (!studentIdInput || isNaN(studentIdInput) || studentIdInput.length === 0) {
        displayMessage('alert-error', '請輸入有效的學號。');
        return;
    }

    // 1. 取得學號的第一個數字 (開頭)
    const firstDigit = studentIdInput.charAt(0);

    // 2. 判斷並導流
    if (firstDigit === '1') {
        // **日間部學生 (學號1開頭)**
        
        // 解析學位資訊
        const levelInfo = parseStudentLevel(studentIdInput);
        
        displayMessage('alert-info', `身份確認：日間部/${levelInfo.levelName}。正在導向服務選單...`);
        
        // 導向 service_menu.html，並傳遞學號和學位資訊
        setTimeout(() => {
            window.location.href = `service_menu.html?id=${studentIdInput}&level=${levelInfo.levelName}&consent=${levelInfo.requiresParentConsent}`;
        }, 1500);
        
    } else if (['2', '3', '4'].includes(firstDigit)) {
        // **非日間部學生 (學號2, 3, 4開頭) - 顯示聯絡資訊**
        
        let contactInfo = "";
        switch (firstDigit) {
            case '2':
                contactInfo = "進修部夜間班 (電話: #04-22195720)";
                break;
            case '3':
                contactInfo = "進修部平假日班 (電話: #04-22195920)";
                break;
            case '4':
                contactInfo = "空中學院註冊組 (電話: #04-22195820)";
                break;
        }
        
        const message = `本系統為日間部註冊組專用 (學號1開頭)。您的學號開頭為 ${firstDigit}，請聯絡：${contactInfo}。`;
        displayMessage('alert-error', message);
        
    } else {
        // **學號輸入有誤 (非 1, 2, 3, 4 開頭)**
        const message = "學號輸入有誤，請重新輸入或來電由專人協助 (電話: #04-22195130)。";
        displayMessage('alert-error', message);
    }
}
// (getWithdrawalApprovals 等其他函數保持不變)

/**
 * 根據學號第二碼解析學位名稱和是否需要家長同意書
 * @param {string} studentId - 完整的日間部學號 (1開頭)
 * @returns {object} { levelName: string, requiresParentConsent: boolean }
 */
function parseStudentLevel(studentId) {
    if (!studentId || studentId.length < 2) {
        return { levelName: "無法識別學位", requiresParentConsent: false };
    }

    const secondDigit = studentId.charAt(1);
    let levelName;
    let requiresParentConsent = false;

    // 根據學號第二碼進行精準判斷
    switch (secondDigit) {
        case '1':
            levelName = '五專';
            requiresParentConsent = true;
            break;
        case '3':
            levelName = '二技';
            requiresParentConsent = true;
            break;
        case '4':
            levelName = '四技';
            requiresParentConsent = true;
            break;
        case '5':
            levelName = '學士後';
            break;
        case '7':
            levelName = '碩士 (在職專班)';
            break;
        case '8':
            levelName = '碩士';
            break;
        case 'F': // 假設 F 代替博士，通常碩博士使用英文代碼
        case '9': // 為了程式碼簡潔，這裡也假設數字代碼
            levelName = '博士';
            break;
        default:
            levelName = '其他學士學位 (請洽註冊組)';
            requiresParentConsent = true; // 預設學士層級需家長同意
            break;
    }
    
    // 總結：五專、二技、四技 (學士層級) 需要家長同意書
    
    return { levelName, requiresParentConsent };
}
