const _pathname = "/computer";

//ロード時
onload = (_event) => {
	_mainInitialize(_pathname);
	_toggleSetting();
}

document.querySelector("#returnSetting").addEventListener("click", function () {
	if (confirm("対戦相手を設定する画面に戻ります\n")) {
		location.href = "./multiSetting.html";
	}
});
