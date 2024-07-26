import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
import JishoAPI from "npm:unofficial-jisho-api@2.3.4";

let previousWord = "しりとり";
let wordHistories = new Set(["しりとり"]);
const jisho = new JishoAPI();

Deno.serve(async (request) => {
	const pathname = new URL(request.url).pathname;
	console.log(`pathname: ${pathname}`);

	//GET previousWord
	if (request.method === "GET" && pathname === "/shiritori") {
		return new Response(previousWord);
	}

	//POST previousWord
	if (request.method === "POST" && pathname === "/shiritori") {
		const requestJson = await request.json();
		const nextWord = requestJson["nextWord"]

		//ひらがな以外が入力されたとき
		if (!/^[ぁ-んー]*$/.test(nextWord)) {
			return new Response(
				JSON.stringify({
					"errorMessage": "ひらがな以外が入力されています。ひらがなのみに変更してください。",
					"errorCode": "10001"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			);
		}

		// 	前のワードに繋がっていないとき
		if (previousWord.slice(-1) !== nextWord.slice(0, 1)) {
			return new Response(
				JSON.stringify({
					"errorMessage": "前の単語に続いていません",
					"errorCode": "10002"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			);
		}


		//最後の文字が「ん」の時
		if (nextWord.slice(-1) === "ん") {
			return new Response(
				JSON.stringify({
					"errorMessage": "最後の文字が「ん」になっています。",
					"errorCode": "20001"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			)
		}

		//過去ににゅ力された単語のとき
		if (wordHistories.has(nextWord)) {
			return new Response(
				JSON.stringify({
					"errorMessage": "過去に入力した単語が入力されました。",
					"errorCode": "20002"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			)
		}


		// 実在する単語ではない時
		const result = await jisho.searchForPhrase(nextWord);
		// console.log(result);
		const wordExists = isValidWord(nextWord, result);
		if (!wordExists) {
			return new Response(
				JSON.stringify({
					"errorMessage": `${nextWord} は実在する単語ではありません。`,
					"errorCode": "10003"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			);
		}

		//エラーなしの時
		wordHistories.add(nextWord);
		previousWord = nextWord;
		return new Response(previousWord, {
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		});
	}


	//リセット
	if (request.method === "POST" && pathname === "/reset") {
		previousWord = "しりとり";
		wordHistories = new Set(["しりとり"]);
		return new Response(
			"リセットされました。",
			{
				status: 200,
				headers: { "Content-Type": "text/plain; charset=utf-8" }
			}
		);
	}


	return serveDir(
		request,
		{
			fsRoot: "./public/",
			urlRoot: "",
			enableCors: true,
		}
	)

});

// nextWordが実在する単語か判定する関数
function isValidWord(nextWord, result) {
	// 結果データの中から単語をチェック
	return result.data.some(entry =>
		entry.japanese.some(wordEntry =>
			toHiragana(wordEntry.reading) === nextWord
		)
	);
}

// カタカナをひらがなに変換する関数
function toHiragana(str) {
    return str.replace(/[ァ-ン]/g, function(ch) {
		// ひらがなにずらす
        return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
}
