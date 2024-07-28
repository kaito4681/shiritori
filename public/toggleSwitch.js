/* 参考文献 */
/* コピペOK！】ON/OFFスイッチのデザイン７個｜iOS風スイッチもあるよ！ */
/* https://hajimete.org/on-off-switch-design-7 */

/* 参考文献 */
/* コピペOK！】ON/OFFスイッチのデザイン７個｜iOS風スイッチもあるよ！ */
/* https://hajimete.org/on-off-switch-design-7 */

// #toggle 要素を取得
const toggle = document.querySelector('#toggle');

// スイッチがクリックされたときの処理
toggle.addEventListener('click', function () {
	// .checked クラスをトグルする
	toggle.classList.toggle('checked');

	// チェックボックスのチェック状態をトグルする
	const input = toggle.querySelector('input[name="check"]');
	if (!input.checked) {
		input.checked = true;
		sessionStorage.setItem("autoInitial", "true");
	} else {
		input.checked = false;
		sessionStorage.setItem("autoInitial", "false");
	}
});

//セッションストレージから初期値を読み取り
function _toggleSetting() {
	const autoInitial = sessionStorage.getItem("autoInitial");
	const input = document.querySelector('#toggle').querySelector('input[name="check"]');

	if (autoInitial === null) {
		input.checked = true;
		sessionStorage.setItem("autoInitial", "true");
	} else if (autoInitial === "true") {
		toggle.classList.add('checked');
		input.checked = true;
	} else {
		toggle.classList.remove('checked');
		input.checked = false;
	}
}