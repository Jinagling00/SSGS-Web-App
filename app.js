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
        // **日間部學生 (學號1開頭) - 導向服務選單**
        displayMessage('alert-info', '身份確認：日間部註冊組。正在導向服務選單...');
        
        // 傳遞學號到下一頁，以便進行後續的身份判斷（例如：性別、學位）
        setTimeout(() => {
            window.location.href = `service_menu.html?id=${studentIdInput}`;
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
