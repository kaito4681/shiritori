onload = async (_event) => {
	// 前のワードを取得
	const response = await fetch("/shiritori", { method: "GET" });
	const previousWord = await response.text();

	// 前のワードの書き換え
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;
}

// 送信ボタン
document.querySelector("#nextWordSendButton").onclick = async (_event) => {
	// Inputタグの中のテキストを取得
	const nextWordInput = document.querySelector("#nextWordInput");
	const nextWordInputText = nextWordInput.value;

	if (nextWordInputText.trim() === "") {
		alert("単語を入力してください。");
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

	//エラー処理
	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		const message = errorObj["errorMessage"];
		if (errorObj["errorCode"] === "10002") {
			message += "\nあなたの負けです。\nもう一度最初からするにはリセットボタンを押してください。"
			const sendButton = document.querySelector("#nextWordSendButton");
			sendButton.disabled = true;
		}
		alert(message);

	}

	// previousWordの更新
	const previousWord = await response.text();
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	// Inputタグの中を空にする
	nextWordInput.value = "";
}


// リセットボタン
document.querySelector("#resetButton").onclick = async (_event) => {
	if (!confirm("ゲームをリセットします。")) {
		return;
	}

	// サーバーにリセットリクエストを送信
	const response = await fetch(
		"/reset",
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
		}
	);

	if (response.status !== 200) {
		alert("リセットに失敗しました。");
		return;
	}

	// 前のワードを取得,置き換え
	const previousWordResponse = await fetch("/shiritori", { method: "GET" });
	const previousWord = await previousWordResponse.text();
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	// input、ボタンのリセット
	document.querySelector("#nextWordInput").value = "";
	const sendButton = document.querySelector("#nextWordSendButton");
	sendButton.disabled = false;
}
