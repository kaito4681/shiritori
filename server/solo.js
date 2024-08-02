import JishoAPI from "npm:unofficial-jisho-api@2.3.4";
import { isValidWord } from "./utility.js";

const wordMap = new Map();
const jisho = new JishoAPI();

function start(uuid) {
	wordMap.set(
		uuid,
		{
			previousWord: "しりとり",
			wordHistories: new Set(["しりとり"])
		}
	);
}

export async function soloGet(uuid) {
	if (!wordMap.has(uuid)) start(uuid);
	const userData = await wordMap.get(uuid);
	console.log(wordMap);
	return new Response(
		userData.previousWord
	);
}

export async function soloPost(uuid, request) {
	const requestJson = await request.json();
	if (!wordMap.has(uuid)) start(uuid);
	const userData = wordMap.get(uuid);
	const nextWord = requestJson["nextWord"];

	// ひらがな以外が入力されたとき
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
	// 最後が「ー」のとき
	let prevWord = userData.previousWord;
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

	if (lastLetter !== nextWord.slice(0, 1)) {
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

	//過去に入力された単語のとき
	if (userData.wordHistories.has(nextWord)) {
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

	// エラーなしの時
	userData.wordHistories.add(nextWord);
	userData.previousWord = nextWord;
	wordMap.set(uuid, userData);

	return new Response(userData.previousWord, {
		headers: { "Content-Type": "text/plain; charset=utf-8" }
	});
}

export function Reset(uuid) {
	if (!wordMap.has(uuid)) start(uuid);
	const userData = wordMap.get(uuid);
	userData.previousWord = "しりとり";
	userData.wordHistories = new Set(["しりとり"]);
	wordMap.set(uuid, userData);

	return new Response(
		"リセットされました。",
		{
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		}
	);
}