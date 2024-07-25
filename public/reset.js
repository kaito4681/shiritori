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
