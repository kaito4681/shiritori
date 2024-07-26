// 送信処理
const sendWord = async () => {
	// Inputタグの中のテキストを取得
	const nextWordInput = document.querySelector("#nextWordInput");
	const nextWordInputText = nextWordInput.value;

	if (nextWordInputText.trim() === "") {
		// alert("単語を入力してください。");
		return;
	}

	// POST
	const response = await fetch(
		"/shiritori",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ nextWord: nextWordInputText })
		}
	);

	// エラー処理
	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		let message = errorObj["errorMessage"];
		if (errorObj["errorCode"].slice(0, 1) === "2") {
			const sendButton = document.querySelector("#nextWordSendButton");
			sendButton.disabled = true;
			message += "\nあなたの負けです。\nもう一度最初からするにはリセットボタンをクリックするか、ENTERを2回押してください。";
		}

		alert(message);
		addInirialLetter(previousWord);
		return;

	}

	// previousWord の更新
	const previousWord = await response.text();
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	//頭文字の挿入
	addInirialLetter(previousWord);
}

// 送信ボタンをクリックしたとき
document.querySelector("#nextWordSendButton").onclick = sendWord();

// 入力後にEnterを押したとき
document.querySelector("#nextWordInput").addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		if (event.isComposing || event.keyCode === 229) {
			// 変換中の場合は送信しない
			return;
		}

		event.preventDefault();
		sendWord();
	}
});

