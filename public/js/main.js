let counter = 0;

async function _mainInitialize(pathname) {
	// セッションストレージからUUIDを取得
	let uuid = sessionStorage.getItem("uuid");
	if (!uuid) uuid = await getUUID();
	console.log(`uuid: ${uuid}`);

	// 前のワードを取得
	await changePrevWord(pathname, uuid);

	//カウンター
	const countText = document.querySelector("#counter");
	countText.innerHTML = `続けた回数: ${counter}回`;

}

//頭文字の挿入
function addInitialLetter() {
	const nextWordInput = document.querySelector("#nextWordInput");
	const toggle = document.querySelector('#toggle');
	// チェックボックスがオンのとき
	if (toggle.classList.contains('checked')) {
		let prevWord = document.querySelector("#previousWord").textContent;;
		// 最後が「ー」のとき
		if (prevWord.slice(-1) === "ー") {
			do {
				prevWord = prevWord.slice(0, -1);
				console.log(prevWord.slice(0, -1));
			} while (prevWord.slice(-1) === "ー");
		}

		//最後が小さい文字のとき
		let lastLetter = prevWord.slice(-1);
		const smallLetter = new Map([
			["ぁ", "あ"], ["ぃ", "い"], ["ぅ", "う"], ["ぇ", "え"], ["ぉ", "お"],
			["ゃ", "や"], ["ゅ", "ゆ"], ["ょ", "よ"], ["っ", "つ"]
		]);

		if (smallLetter.has(lastLetter)) {
			lastLetter = smallLetter.get(lastLetter);
		}

		// inputに次の単語の頭文字を挿入
		nextWordInput.value = lastLetter;
	} else {// チェックボックスがオフのとき
		// inputを空に
		nextWordInput.value = "";
	}

}

// 前のワードの書き換え
async function changePrevWord(pathname, uuid) {
	let response = await fetch(
		pathname,
		{
			method: "GET",
			headers: {
				"UUID": uuid
			}
		});
	console.log(response);

	// エラー処理
	if (response.status !== 200) {
		const errorJson = await response.text();
		const errorObj = JSON.parse(errorJson);
		if (errorObj["errorCode"].slice(0, 1) === "3") {
			//uuidの変更
			uuid = await getUUID();
			// 前のワードを取得
			response = await fetch(
				pathname, {
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


	const previousWordText = document.querySelector("#previousWord");
	if (pathname === "/solo") {
		const previousWord = await response.text();
		previousWordText.innerHTML = `前の単語: ${previousWord}`;
		//頭文字の挿入
		addInitialLetter();
	} else if (pathname === "/computer") {
		const wordsJson = await response.text();
		const wordsObj = JSON.parse(wordsJson);
		previousWordText.innerHTML = `前の単語(相手): ${wordsObj["previousWord"]}`;
		const secondLastWordText = document.querySelector("#secondLastWord");
		secondLastWordText.innerHTML = `2つ前の単語(自分): ${wordsObj["secondLastWord"]}`;
		//頭文字の挿入
		addInitialLetter();
	}
}

async function getUUID() {
	const response = await fetch("/getId", { method: "GET" });
	const uuid = await response.text();

	// セッションストレージにUUIDを保存
	sessionStorage.setItem("uuid", uuid);
	return uuid;
}

function _updateCounter() {
	counter++;
	const countText = document.querySelector("#counter");
	countText.innerHTML = `続けた回数: ${counter}回`;
}

function _resetCounter() {
	counter = 0;
	const countText = document.querySelector("#counter");
	countText.innerHTML = "続けた回数: 0回";
}




// sleep関数
function _sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
