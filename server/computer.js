import { dicedeTurn, isValidWord } from "./utility.js";
import JishoAPI from "npm:unofficial-jisho-api@2.3.4";


async function readJsonFile() {
	const filePath = "./server/ansMap.json";
	try {
		const data = await Deno.readTextFile(filePath);
		const jsonData = JSON.parse(data);
		// console.log(jsonData)
		return jsonData;
	} catch (error) {
		console.error("ファイルの読み込み中にエラーが発生しました:", error);
	}
}

const ansMap = await readJsonFile();

const wordMap = new Map();

function initialize(uuid) {
	wordMap.set(
		uuid,
		{
			secondLastWord: "",
			previousWord: "しりとり",
			wordHistories: new Set(["しりとり"]),
			cpuWord: new Map(Object.entries(ansMap))
		}
	);
}

function start(uuid) {
	const turn = dicedeTurn();
	initialize(uuid);
	const userData = wordMap.get(uuid);
	if (turn  === false) {
		const ansArray = userData.cpuWord.get(userData.previousWord.slice(-1));
		// console.log(ansArray);
		let ans = null;
		while (!ans || userData.wordHistories.has(ans)) {
			//ランダムで続ける単語を返す。
			const randomIndex = Math.floor(Math.random() * ansArray.length);
			ans = ansArray[randomIndex];
			ansArray.splice(randomIndex, 1);
		}

		userData.secondLastWord = userData.previousWord;
		userData.previousWord = ans;
		wordMap.set(uuid, userData);
	}
	wordMap.set(uuid, userData);
}

// GET
export function get(uuid) {
	if (!wordMap.has(uuid)) start(uuid);
	const userData = wordMap.get(uuid);
	// return shiritori(uuid, userData);
	wordMap.set(uuid, userData);
	return new Response(
		JSON.stringify({
			secondLastWord: userData.secondLastWord,
			previousWord: userData.previousWord
		}),
		{
			headers: {
				"Content-Type": "text/json; charset=utf-8"
			}
		}
	);
}


// POST 
export async function post(uuid, request) {
	if (!wordMap.has(uuid)) start(uuid);
	const requestJson = await request.json();
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
	const jisho = new JishoAPI();
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
	userData.secondLastWord = nextWord;

	// cpu
	prevWord = nextWord;
	if (prevWord.slice(-1) === "ー") {
		do {
			prevWord = prevWord.slice(0, -1);
			console.log(prevWord.slice(0, -1));
		} while (prevWord.slice(-1) === "ー");
	}
	//最後が小さい文字のとき
	lastLetter = prevWord.slice(-1);
	if (smallLetter.has(lastLetter)) {
		lastLetter = smallLetter.get(lastLetter);
	}

	const ansArray = userData.cpuWord.get(lastLetter);
	let ans = null;
	while (!ans || userData.wordHistories.has(ans)) {
		//ユーザの勝ちの時
		if (ansArray.length === 0) {
			wordMap.delete(uuid)

			return new Response(
				JSON.stringify({
					"errorMessage": "あなたの勝ちです",
					"errorCode": "40001"
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "text/json; charset=utf-8"
					}
				}
			)
		}

		//ランダムで続ける単語を返す。
		const randomIndex = Math.floor(Math.random() * ansArray.length);
		ans = ansArray[randomIndex];
		ansArray.splice(randomIndex, 1);
	}

	userData.previousWord = ans;

	wordMap.set(uuid, userData);
	if (ansArray.length === 0) {
		return new Response(
			JSON.stringify({
				"errorMessage": "あなたの勝ちです",
				"errorCode": "40001"
			}),
			{
				headers: {
					"Content-Type": "text/json; charset=utf-8"
				}
			}
		);
	} else {
		//エラーなし
		wordMap.set(uuid, userData);
		return new Response(
			JSON.stringify({
				secondLastWord: userData.secondLastWord,
				previousWord: userData.previousWord
			}),
			{
				headers: {
					"Content-Type": "text/json; charset=utf-8"
				}
			}
		);
	}
}

//reset 
export function reset(uuid) {
	// 初期化
	if (!wordMap.has(uuid)) start(uuid);
	else initialize(uuid);

	return new Response(
		JSON.stringify({
			errorMessage: "リセットされました。",
		}),
		{
			status: 200,
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		}
	);
}
