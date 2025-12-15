/**
 * SSGS 核心 JavaScript 邏輯
 * 包含學號檢查、非日間部導流，以及未來的休/退學會辦邏輯
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
        displayMessage('alert-info', '身份確認：日間部註冊組。正在導向流程辨識...');
        
        // 模擬延遲，讓使用者看到訊息後再導向
        setTimeout(() => {
            // 導向日間部 SSGS 決策樹頁面
            window.location.href = 'decision_flow.html';
        }, 1500);

    } else {
        // **非日間部學生 (提供聯絡資訊，並拒絕使用系統)**
        
        let contactInfo = "";
        
        // 根據我們討論的邏輯，設置聯絡資訊
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
            default:
                contactInfo = "其他單位 (日間部註冊組電話: #04-22195130)";
        }
        
        const message = `本系統為日間部註冊組專用 (學號1開頭)。您的學號開頭為 ${firstDigit}，請聯絡：${contactInfo}。`;
        const note = `日間部註冊組電話：#04-22195130。`;
        
        displayMessage('alert-error', `${message}<br><br>${note}`);
    }
}

function displayMessage(type, message) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = `<div class="alert-message ${type}">${message}</div>`;
}


/**
 * ------------------------------------------------------------------
 * 休/退學會辦邏輯 (這是下一個步驟要實作在 decision_flow.html 中的函數)
 * ------------------------------------------------------------------
 * * 這是我們討論的「流程 B：休/退學類」的邏輯偽代碼，將在後續頁面使用。
 * 假設以下變數已經從決策樹 (decision_flow.html) 頁面獲得：
 * @param {string} studentLevel - 學位 ('學士', '碩士', '博士', '五專')
 * @param {string} gender - 性別 ('男', '女')
 * @param {boolean} isServed - 是否已服兵役 (true/false)
 * @param {boolean} feeDue - 是否有費用待繳/學貸未結清 (true/false)
 * @returns {Array<string>} - 需會辦的單位列表
 */
function getWithdrawalApprovals(studentLevel, gender, isServed, feeDue) {
    let requiredApprovals = [];

    // 1. 判斷是否需要家長同意書
    // 邏輯: 大學部 (學士、五專) 需要；研究所 (碩士、博士) 不用
    if (studentLevel === '學士' || studentLevel === '五專') {
        requiredApprovals.push('家長或監護人同意書');
    }

    // 2. 判斷是否需要會辦生輔組兵役
    // 邏輯: 男生 且 (學士、五專) 且 未服役 需要
    if (gender === '男' && (studentLevel === '學士' || studentLevel === '五專') && !isServed) {
        requiredApprovals.push('生輔組兵役承辦人');
        // 提醒：需同時準備兵役切結書
    }
    
    // 3. 判斷是否需要會辦財務/學貸相關單位
    // 邏輯: 有費用待繳 (未繳清學雜費) 或 有學貸 (課外活動組)
    if (feeDue) {
        requiredApprovals.push('出納組 (未繳清費用)');
        requiredApprovals.push('課外活動指導組 (學貸/助學金)');
        // 提醒：需同時準備退費申請書 (學期中退費)
    }
    
    // 4. 固定會辦單位 (根據流程圖，導師/系所是第一關)
    requiredApprovals.unshift('導師');
    requiredApprovals.push('系所主管');
    
    // 5. 其他根據身分別的會辦單位 (外籍生、住宿生、原住民等)
    // 這裡我們只處理您定義的核心邏輯。
    
    // 流程圖顯示最終必須將申請表送回註冊組
    requiredApprovals.push('註冊組 (最終核章)');

    return requiredApprovals;
}
