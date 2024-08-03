import { battleMap } from "./multiSetting.js";
import { isValidWord } from "./utility.js";
import JishoAPI from "npm:unofficial-jisho-api@2.3.4";

export async function update(request) {
	const data = await request.json();
	const battleId = data.battleId;
	// console.log(`battleId:${battleId}`);

	if (battleId) {
		const battle = battleMap.get(battleId);
		console.log(battle);
		
		return new Response(
			battle,
			{
				status: 200,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			}
		);
	} else {
		return new Response(
			JSON.stringify({
				"errorMessage": "battleIdが指定されていません。",
				"errorCode": "40001"
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			}
		);
	}
}


export async function post(request) {
	const data = await request.json();
	const battleId = data.battleId;
	const nextWord = data.nextWord;
	console.log(`battleId:${battleId}`);

	if (!battleId) {
		return new Response(
			JSON.stringify({
				"errorMessage": "battleIdが指定されていません。",
				"errorCode": "40001"
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			}
		);
	}

	if (!battleMap.has(battleId)) {
		return new Response(
			JSON.stringify({
				"errorMessage": "battleIdが登録されていません。",
				"errorCode": "40002"
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			}
		);
	}

	// let battle = battleMap.get(battleId);
	let battle = JSON.parse(battleMap.get(battleId));


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
	let prevWord = battle.previousWord;
	if (prevWord.slice(-1) === "ー") {
		do {
			prevWord = prevWord.slice(0, -1);
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
		battleMap.set(
			battleId,
			JSON.stringify(
				{
					uuid0: battle.uuid0,
					uuid1: battle.uuid1,
					turn: (battle.turn === battle.uuid0) ? battle.uuid1 : battle.uuid0,
					exit: true,
					previousWord: battle.previousWord,
					secondLastWord: battle.secondLastWord,
					wordHistories: battle.wordHistories
				}
			)
		);
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
	const wordHistories = new Set(Object.keys(battle.wordHistories))
	if (wordHistories.has(nextWord)) {
		battleMap.set(
			battleId,
			JSON.stringify(
				{
					uuid0: battle.uuid0,
					uuid1: battle.uuid1,
					turn: (battle.turn === battle.uuid0) ? battle.uuid1 : battle.uuid0,
					exit: true,
					previousWord: battle.previousWord,
					secondLastWord: battle.secondLastWord,
					wordHistories: battle.wordHistories
				}
			)
		);
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
	wordHistories.add(nextWord);
	const secondLastWord = battle.previousWord;
	//ターン変更
	const turn = (battle.turn === battle.uuid0) ? battle.uuid1 : battle.uuid0;

	
	battleMap.set(
		battleId,
		JSON.stringify(
			{
				uuid0: battle.uuid0,
				uuid1: battle.uuid1,
				turn: turn,
				exit: false,
				previousWord: nextWord,
				secondLastWord: secondLastWord,
				wordHistories: new Set(wordHistories)
			}
		)
	);

	battle = battleMap.get(battleId);
	return new Response(
		battle,
		{
			status: 200,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		}
	);

}