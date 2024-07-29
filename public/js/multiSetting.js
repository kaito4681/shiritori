onload = (_event) => {
	const selectedOpponent = sessionStorage.getItem("opponent");
	// 以前の情報があればラジオボタンにチェックを入れる
	if (selectedOpponent) {
		const opponentRadio = document.querySelector(`input[name="Opponent"][value="${selectedOpponent}"]`);
		if (opponentRadio) {
			opponentRadio.checked = true;
		}
	}
}

document.querySelector("#gameStart").addEventListener("click", function () {
	const selectedOpponent = document.querySelector('input[name="Opponent"]:checked').value;
	// セッションストレージにopponentを保存
	sessionStorage.setItem("opponent", selectedOpponent);


	location.href = selectedOpponent + ".html";
});