/**
 * =================================================================
 * SSGS 核心 JavaScript 邏輯 (完整版)
 * 包含學號檢查、學位解析、訊息顯示與會辦邏輯
 * =================================================================
 */

// --- 輔助函數 ---

/**
 * 在首頁 (index.html) 顯示錯誤或提示訊息。
 * @param {string} type - 訊息類型 ('alert-error' 或 'alert-info')
 * @param {string} message - 要顯示的訊息內容
 */
function displayMessage(type, message) {
    const messageContainer = document.getElementById('messageContainer');
    // 如果 messageContainer 不存在，則不執行後續操作
    if (!messageContainer) return; 

    // 使用模板字串顯示訊息
    messageContainer.innerHTML = `<div class="alert-message ${type}">${message}</div>`;
}


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
            requiresParentConsent = true; // 五專需要家長同意書
            break;
        case '3':
            levelName = '二技';
            requiresParentConsent = true; // 二技需要家長同意書
            break;
        case '4':
            levelName = '四技';
            requiresParentConsent = true; // 四技需要家長同意書
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
        case 'F': 
        case '9': 
            levelName = '博士';
            break;
        default:
            levelName = '其他學士學位 (請洽註冊組)';
            requiresParentConsent = true; // 預設學士層級需家長同意
            break;
    }
    
    return { levelName, requiresParentConsent };
}


// --- 核心邏輯函數 ---

/**
 * 處理首頁的學號檢查、身份辨識和頁面導流
 */
function checkStudentId() {
    const studentIdInput = document.getElementById('studentId').value;
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = ''; // 清除舊訊息

    // 基礎檢查
    if (!studentIdInput || isNaN(studentIdInput) || studentIdInput.length === 0) {
        displayMessage('alert-error', '請輸入有效的學號。');
        return;
    }

    // 1. 取得學號的第一個數字 (開頭)
    const firstDigit = studentIdInput.charAt(0);
    const repoPath = '/SSGS-Web-App/'; // **!!! 確保路徑與您的 GitHub Repository 名稱一致 !!!**

    // 2. 判斷並導流
    if (firstDigit === '1') {
        // **日間部學生 (學號1開頭)**
        
        // 解析學位資訊
        const levelInfo = parseStudentLevel(studentIdInput);
        
        displayMessage('alert-info', `身份確認：日間部/${levelInfo.levelName}。正在導向服務選單...`);
        
        // 導向 service_menu.html，並傳遞學號和學位資訊
        setTimeout(() => {
            window.location.href = `${repoPath}service_menu.html?id=${studentIdInput}&level=${levelInfo.levelName}&consent=${levelInfo.requiresParentConsent}`;
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
        
        const message = `本系統為日間部註冊組專用 (學號1開頭)。您的學號開頭為 ${firstDigit}，/n請聯絡：${contactInfo}。`;
        displayMessage('alert-error', message);
        
    } else {
        // **學號輸入有誤 (非 1, 2, 3, 4 開頭)**
        const message = "學號輸入有誤，請重新輸入或來電由專人協助 (電話: #04-22195130)。";
        displayMessage('alert-error', message);
    }
}


/**
 * ------------------------------------------------------------------
 * 休/退學會辦邏輯 (這是為 'withdrawal_guide.html' 準備的邏輯，用於動態生成會辦清單)
 * ------------------------------------------------------------------
 * * 假設以下變數已經從前端輸入或URL參數獲得：
 * @param {string} studentLevel - 學位 ('五專', '四技', '碩士' 等)
 * @param {boolean} requiresParentConsent - 是否需要家長同意書 (由 parseStudentLevel 判斷)
 * @param {string} gender - 性別 ('男', '女') - 需透過前端詢問
 * @param {boolean} isServed - 是否已服兵役 (true/false) - 需透過前端詢問
 * @param {boolean} feeDue - 是否有費用待繳/學貸未結清 (true/false) - 需透過前端詢問
 * @returns {Array<string>} - 需會辦的單位列表
 */
function getWithdrawalApprovals(studentLevel, requiresParentConsent, gender, isServed, feeDue) {
    let requiredApprovals = [];

    // 1. 導師/系所主管 (固定第一關)
    requiredApprovals.push('導師 (需記錄聯絡家長時間)');
    requiredApprovals.push('系所承辦人 / 系所主管');

    // 2. 費用處理 (出納組 / 課外活動組)
    if (feeDue) {
        // 假設有欠費或學貸
        requiredApprovals.push('出納組 (未繳清學雜費或需退費)');
        requiredApprovals.push('課外活動指導組 (學貸/助學金)');
        // 提醒：需同時準備退費申請書 (學期中退費)
    }
    
    // 3. 兵役判斷 (生輔組)
    if (gender === '男' && !isServed && requiresParentConsent) { 
        // 假設未服役男生，且學位在學士層級 (五專, 四技等)
        requiredApprovals.push('生輔組兵役承辦人 (需兵役切結書)');
    }
    
    // 4. 其他根據流程圖的條件會辦 (這裡僅列出流程圖中提到的幾項，實務上可能更多)
    // 假設前端有更多判斷：
    // if (isDormitoryResident) requiredApprovals.push('宿舍組');
    // if (isForeignStudent) requiredApprovals.push('國際事務處');

    // 5. 註冊組 (最終核章)
    requiredApprovals.push('註冊組 (最終審核及發放休/退學證明)');

    return requiredApprovals;
}
