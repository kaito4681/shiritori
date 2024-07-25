onload = async (_event) => {
	// 前のワードを取得
	const response = await fetch("/shiritori", { method: "GET" });
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