const reset = async () => {
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

	//頭文字の挿入
	addInirialLetter(previousWord);
}


// リセットボタン
document.querySelector("#resetButton").onclick = reset;


//ESCを押すとRESET
document.querySelector("body").addEventListener("keydown", (event) => {
	const sendButton = document.querySelector("#nextWordSendButton");
	if (sendButton.disabled) {
		return;
	}
	if (event.key === "Escape") {
		reset();
	}
});
