const reset = async () => {
	if (!confirm("ゲームをリセットします。")) {
		return;
	}

	// UUIDをセッションストレージから取得
	let uuid = sessionStorage.getItem("uuid");

	// サーバーにリセットリクエストを送信
	const response = await fetch(
		_pathname + "/reset",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"UUID": uuid
			},
		}
	);

	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		if (errorObj["errorCode"].slice(0, 1) === "3") {
			uuid = await getUUID();
		} else {
			const message = errorObj["errorMessage"];
			alert("リセットに失敗しました。\n", message);
			return;
		}
	}

	// previousWord の更新
	await changePrevWord(_pathname,uuid);

	//counterのりせっと
	_resetCounter();

	// input、ボタンのリセット
	document.querySelector("#nextWordInput").value = "";
	const sendButton = document.querySelector("#nextWordSendButton");
	sendButton.disabled = false;

	//頭文字の挿入
	addInitialLetter(previousWord);
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