onload = async (_event) => {
	// セッションストレージからUUIDを取得
	let uuid = sessionStorage.getItem("uuid");
	if (!uuid) uuid = await getUUID();

	console.log(`uuid: ${uuid}`);

	// 前のワードを取得
	let response = await fetch("/shiritori", {
		method: "GET",
		headers: {
			"UUID": uuid
		}
	});

	// エラー処理
	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		if (errorObj["errorCode"].slice(0, 1) === "3") {
			uuid = await getUUID();
			// 前のワードを取得
			response = await fetch("/shiritori", {
				method: "GET",
				headers: {
					"UUID": uuid
				}
			});
		} else {
			const message = errorObj["errorMessage"];
			alert(message);
			return;
		}

	}

	const previousWord = await response.text();

	// 前のワードの書き換え
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;

	//頭文字の挿入
	addInirialLetter(previousWord);
}

//頭文字の挿入
function addInirialLetter(previousWord) {
	const nextWordInput = document.querySelector("#nextWordInput");
	nextWordInput.value = previousWord.slice(-1);
}

async function getUUID() {
	const response = await fetch("/getId", { method: "GET" });
	const uuid = await response.text();

	// セッションストレージにUUIDを保存
	sessionStorage.setItem("uuid", uuid);
	return uuid;
}