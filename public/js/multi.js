const _pathname = "/multi";

//ロード時
onload = async (_event) => {
	_mainInitialize(_pathname);
	_toggleSetting();

	const uuid = sessionStorage.getItem("uuid");
	const battleId = sessionStorage.getItem("battleId");

	if (!uuid) {
		alert("対戦相手選択に戻って、もう一度進めてください。");
		location.href = "multiSetting.html";
		return;
	} else {
		let response;
		console.log(`battleId:${battleId}`);
		while (1) {
			response = await fetch(
				"/update",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"UUID": uuid,
					},
					body: JSON.stringify({
						"battleId": battleId
					})
				}
			);

			const battleObj = await response.json();
			// console.log(battleObj);
			// console.log(battleObj["exit"]);
			if (battleObj["exit"] === true) {
				winner = battleObj["turn"];
				if (uuid === winner) {
					alert("相手が「ん」で終わる単語、または、過去に使った単語を入力しました。\nあなたの勝ちです。\n5秒後に前の画面に戻ります。");
				}
				setTimeout(() => {
					location.href = "multiSetting.html";
				}, 5000);
				return;
			}

			//ターン,ワード表示
			const turn = document.querySelector("#turn");
			const sendButton = document.querySelector("#nextWordSendButton");
			const input = document.querySelector("#nextWordInput");
			if (uuid === battleObj["turn"]) {
				sendButton.disabled = false;
				input.disabled = false;
				turn.innerHTML = "あなたのターンです";
				document.querySelector("#previousWord").innerHTML = `前の単語(相手):${battleObj["previousWord"]}`;
				document.querySelector("#secondLastWord").innerHTML = `2つ前の単語(自分):${battleObj["secondLastWord"] === undefined ? "" : battleObj["secondLastWord"]}`;
				if (document.querySelector("#nextWordInput").value === "") addInitialLetter();
			} else {
				sendButton.disabled = true;
				input.disabled = true;
				turn.innerHTML = "あいてのターンです";
				document.querySelector("#previousWord").innerHTML = `前の単語(自分):${battleObj["previousWord"]}`;
				document.querySelector("#secondLastWord").innerHTML = `2つ前の単語(相手):${battleObj["secondLastWord"] === undefined ? "" : battleObj["secondLastWord"]}`;
			}
			await _sleep(1000);
		}
	};
}