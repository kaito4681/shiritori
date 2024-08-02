// 送信処理
const sendWord = async () => {
	// Inputタグの中のテキストを取得
	const nextWordInput = document.querySelector("#nextWordInput");
	const nextWordInputText = nextWordInput.value;

	if (nextWordInputText === "") {
		return;
	}

	//sendButtonを一旦オフにする
	const sendButton = document.querySelector("#nextWordSendButton");
	sendButton.disabled = true;

	// UUIDをセッションストレージから取得
	const uuid = sessionStorage.getItem("uuid");

	// POST
	const response = await fetch(
		_pathname,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"UUID": uuid
			},
			body: JSON.stringify({ nextWord: nextWordInputText })
		}
	);

	// エラー処理
	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		const message = errorObj["errorMessage"];

		//ゲーム終了にする時
		switch (errorObj["errorCode"].slice(0, 1)) {
			// ゲームを続ける時
			case "1": {
				sendButton.disabled = false;
				alert(message + "\n送信する単語を変更してください。");
				return;
			}

			//ゲームを終了するとき
			case "2": {
				if (confirm(message + "\nあなたの負けです。\nもう一度最初からしますか？")) {
					reset();
				}
				return;
			}

			// UUIDのエラー
			case "3":
				alert(message + "\nゲームをリセットします");
				await getUUID();
				await reset();
				return;

			default:
				return;
		}
	}

	// previousWord の更新
	await changePrevWord(_pathname, uuid);

	//counterの更新
	_updateCounter();

	//頭文字の挿入
	addInitialLetter(previousWord);

	// ボタンを有効にする
	sendButton.disabled = false;
}

// 送信ボタンをクリックしたとき
document.querySelector("#nextWordSendButton").onclick = sendWord;

// 入力後にEnterを押したとき
document.querySelector("#nextWordInput").addEventListener("keydown", (event) => {
	const sendButton = document.querySelector("#nextWordSendButton");

	if (event.key === "Enter" && !sendButton.disabled) {
		if (event.isComposing || event.keyCode === 229) {
			// 変換中の場合は送信しない
			return;
		}

		event.preventDefault();
		sendWord();
	}
});
