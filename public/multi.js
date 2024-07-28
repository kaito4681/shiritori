onload = (_event) => {
	// セッションストレージからopponentを取得し、表示
	const opponent = sessionStorage.getItem("opponent");
	if (!opponent){
		alert("エラー\n前の画面に戻ります。");
		location.href("multiSetting.html");
	}else{
		const modeMap = new Map([
			["computer","コンピュータ"],
			["random","ランダム"],
			["passward","合言葉"],
		])
		const mode = modeMap.get(opponent);
		document.querySelector("#mode h2").innerHTML = `対戦モード(${mode})`;
	}
}

document.querySelector("#returnSetting").addEventListener("click", function () {
	if (confirm("対戦相手を変更しますか？")) {
		location.href = "multiSetting.html";
	}
});