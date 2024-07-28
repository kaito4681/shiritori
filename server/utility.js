import { v4 } from "https://deno.land/std@0.113.0/uuid/mod.ts";
import { wordMap } from "./solo.js";

//UUIDを生成
export function getId() {
	const uuid = v4.generate();
	console.log(`新しいUUID: ${uuid}`);

	wordMap.set(
		uuid,
		{
			previousWord: "しりとり",
			wordHistories: new Set(["しりとり"])
		}
	);

	return new Response(
		uuid,
		{
			headers: { "Content-Type": "text/plain; charset=utf-8" }
		}
	);
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