import { v4 } from "https://deno.land/std@0.113.0/uuid/mod.ts";
import JishoAPI from "npm:unofficial-jisho-api@2.3.4";

export const idList = [];
export const battleIdList = [];

//UUIDを生成
export function getId() {
	const uuid = v4.generate();
	// console.log(`新しいUUID: ${uuid}`);
	idList.push(uuid);
	return uuid;
}

//nextWordの条件判定
export async function validateNextWord(prevWord, nextWord, wordHistories) {
	// ひらがな以外が入力されたとき
	if (!/^[ぁ-んー]*$/.test(nextWord)) {
		return {
			isValid: false,
			errorMessage: "ひらがな以外が入力されています。ひらがなのみに変更してください。",
			errorCode: "10001"
		};
	}

	// 前のワードに繋がっていないとき
	let adjustedPrevWord = prevWord;
	if (adjustedPrevWord.slice(-1) === "ー") {
		do {
			adjustedPrevWord = adjustedPrevWord.slice(0, -1);
		} while (adjustedPrevWord.slice(-1) === "ー");
	}

	let lastLetter = adjustedPrevWord.slice(-1);
	const smallLetter = new Map([
		["ぁ", "あ"], ["ぃ", "い"], ["ぅ", "う"], ["ぇ", "え"], ["ぉ", "お"],
		["ゃ", "や"], ["ゅ", "ゆ"], ["ょ", "よ"], ["っ", "つ"]
	]);

	if (smallLetter.has(lastLetter)) {
		lastLetter = smallLetter.get(lastLetter);
	}

	if (lastLetter !== nextWord.slice(0, 1)) {
		return {
			isValid: false,
			errorMessage: "前の単語に続いていません",
			errorCode: "10002"
		};
	}

	// 最後の文字が「ん」��時
	if (nextWord.slice(-1) === "ん") {
		return {
			isValid: false,
			errorMessage: "最後の文字が「ん」になっています。",
			errorCode: "20001"
		};
	}

	// 過去に入力された単語のとき
	if (wordHistories.has(nextWord)) {
		return {
			isValid: false,
			errorMessage: "過去に入力した単語が入力されました。",
			errorCode: "20002"
		};
	}

	// 実在する単語ではない時
	const jisho = new JishoAPI();
	const result = await jisho.searchForPhrase(nextWord);
	const wordExists = isValidWord(nextWord, result);
	if (!wordExists) {
		return {
			isValid: false,
			errorMessage: `${nextWord} は実在する単語ではありません。`,
			errorCode: "10003"
		}
	}

	return { isValid: true };
}

// nextWordが実在する単語か判定する関数
export function isValidWord(nextWord, result) {
	// 結果データの中から単語をチェック
	return result.data.some(entry =>
		entry.japanese.some(wordEntry =>
			toHiragana(wordEntry.reading) === nextWord
		)
	);
}

// カタカナをひらがなに変換する関数
function toHiragana(str) {
	return str.replace(/[ァ-ン]/g, function (ch) {
		return String.fromCharCode(ch.charCodeAt(0) - 0x60);
	});
}

//"You","Opponent"のどちらかを返す
export function dicedeTurn(){
	const rand = Math.random();
	if(rand < 0.5){
		return true;
	}else{
		return false;
	}
}

//battleIdを生成
export function getBattleId() {
	const battleId = v4.generate();
	battleIdList.push(battleId);
	return battleId;
}