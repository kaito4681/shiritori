const _pathname = "/solo";

//ロード時
onload = (_event) => {
	_mainInitialize(_pathname);
	_toggleSetting();
}

document.querySelector("#returnButton").addEventListener("click", function () {
	if (confirm("メニューに戻りますか。\n")) {
		location.href = "index.html";
	}
});