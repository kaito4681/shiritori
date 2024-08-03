// 送信処理
const sendWord = async () => {
	// Inputタグの中のテキストを取得
	const input = document.querySelector("#nextWordInput");

	if (input.value === "") {
		return;
	}

	//sendButtonを一旦オフにする
	const sendButton = document.querySelector("#nextWordSendButton");
	sendButton.disabled = true;

	// UUIDをセッションストレージから取得
	const uuid = sessionStorage.getItem("uuid");
	const battleId = sessionStorage.getItem("battleId");

	// POST
	const response = await fetch(
		"/multi",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"UUID": uuid
			},
			body: JSON.stringify({
				"nextWord": input.value,
				"battleId": battleId
			})
		}
	);

	const battleObj = await response.json();
	// エラー処理
	if (response.status !== 200) {
		const message = battleObj["errorMessage"];

		//ゲーム終了にする時
		switch (battleObj["errorCode"].slice(0, 1)) {
			// ゲームを続ける時
			case "1": {
				sendButton.disabled = false;
				alert(message + "\n送信する単語を変更してください。");
				return;
			}

			//ゲームを終了するとき
			case "2": {
				if (confirm(message + "\nあなたの負けです。\nもう一度最初からしますか？")) {
					// reset();
				}
				return;
			}
			
			default:
				return;
		}
	} else {
		input.value = "";
	}

	//ターン,ワード表示
	const turn = document.querySelector("#turn");
	if (uuid === battleObj["turn"]) {
		sendButton.disabled = false;
		input.disabled = false;
		turn.innerHTML = "あなたのターンです";
		document.querySelector("#previousWord").innerHTML = `前の単語(相手):${battleObj["previousWord"]}`;
		document.querySelector("#secondLastWord").innerHTML = `2つ前の単語(自分):${battleObj["secondLastWord"] === undefined ? "" : battleObj["secondLastWord"]}`;
		addInitialLetter();
	} else {
		nextWordInput.value = "";
		sendButton.disabled = true;
		input.disabled = true;
		turn.innerHTML = "あいてのターンです";
		document.querySelector("#previousWord").innerHTML = `前の単語(自分):${battleObj["previousWord"]}`;
		document.querySelector("#secondLastWord").innerHTML = `2つ前の単語(相手):${battleObj["secondLastWord"] === undefined ? "" : battleObj["secondLastWord"]}`;
	}

	//counterの更新
	_updateCounter();
}

// 送信ボタンをクリックしたとき
document.querySelector("#nextWordSendButton").addEventListener("click", async () => await sendWord());

// 入力後にEnterを押したとき
document.querySelector("#nextWordInput").addEventListener("keydown", async (event) => {
	const sendButton = document.querySelector("#nextWordSendButton");

	if (event.key === "Enter" && !sendButton.disabled) {
		if (event.isComposing || event.keyCode === 229) {
			// 変換中の場合は送信しない
			return;
		}

		event.preventDefault();
		await sendWord();
	}
});
