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
		"/shiritori",
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
		let message = errorObj["errorMessage"];

		//ゲーム終了にする時
		if (errorObj["errorCode"].slice(0, 1) === "2") {
			sendButton.disabled = true;
			message += "あなたの負けです。\nもう一度最初からしますか？";
			if (confirm(message)) {
				reset();
			}
			return;

		} else {
			// ゲームを続ける時
			message += "\n送信する単語を変更してください。";
			sendButton.disabled = false;
			alert(message);
			return;
		}

	}

	// previousWord の更新
	const previousWord = await response.text();
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	//頭文字の挿入
	addInirialLetter(previousWord);

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
