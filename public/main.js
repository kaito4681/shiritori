onload = async (_event) => {
	// 前のワードを取得
	const response = await fetch("/shiritori", { method: "GET" });
	const previousWord = await response.text();

	// 前のワードの書き換え
	const paragraph = document.querySelector("#previousWord");
	paragraph.innerHTML = `前の単語: ${previousWord}`;
}