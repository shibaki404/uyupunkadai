document.addEventListener('DOMContentLoaded', () => {
    const postalCodeInput = document.getElementById('postal-code');
    const searchBtn = document.getElementById('search-btn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const prefectureInput = document.getElementById('prefecture');
    const cityInput = document.getElementById('city');
    const townInput = document.getElementById('town');
    const fullAddressInput = document.getElementById('full-address');

    // 検索ボタンのクリックイベント
    searchBtn.addEventListener('click', searchAddress);

    // Enterキーでも検索できるように
    postalCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchAddress();
        }
    });

    // 数字のみ入力できるようにする
    postalCodeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    async function searchAddress() {
        const postalCode = postalCodeInput.value.replace(/[^0-9]/g, '');

        // バリデーション
        if (postalCode.length !== 7) {
            showError('郵便番号は7桁で入力してください');
            clearAddressFields();
            return;
        }

        // UI更新
        hideError();
        clearAddressFields();
        showLoading();

        try {
            // 郵便番号APIを使用（zipcloud API - 無料）
            const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
            const data = await response.json();

            hideLoading();

            if (data.status === 200 && data.results) {
                const result = data.results[0];

                // 各フィールドに値を設定
                prefectureInput.value = result.address1;
                cityInput.value = result.address2;
                townInput.value = result.address3;
                fullAddressInput.value = result.address1 + result.address2 + result.address3;
            } else {
                showError('該当する住所が見つかりませんでした');
            }
        } catch (error) {
            hideLoading();
            showError('住所の取得に失敗しました。ネットワーク接続を確認してください。');
            console.error('Error:', error);
        }
    }

    function showLoading() {
        loading.style.display = 'block';
        searchBtn.disabled = true;
    }

    function hideLoading() {
        loading.style.display = 'none';
        searchBtn.disabled = false;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function clearAddressFields() {
        prefectureInput.value = '';
        cityInput.value = '';
        townInput.value = '';
        fullAddressInput.value = '';
    }
});
