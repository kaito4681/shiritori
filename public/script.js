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
		alert(errorObj["errorMessage"]);
	}

	// previousWordの更新
	const previousWord = await response.text();
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	// Inputタグの中を空にする
	nextWordInput.value = "";
}