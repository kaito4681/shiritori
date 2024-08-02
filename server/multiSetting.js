import { dicedeTurn, getBattleId } from "./utility.js";
import { Mutex } from 'npm:async-mutex';

// ミューテックスのインスタンスを作成
const mutex = new Mutex();

export const battleMap = new Map();
const waitingMap = new Map();
const matching = new Map();


// export async function search(uuid, request) {
// 	console.log("battleMap");
// 	console.log(battleMap);
// 	console.log("waitingMap");
// 	console.log(waitingMap);
// 	console.log("matching");
// 	console.log(matching);


// 	const password = await request.headers.get("password");
// 	if (waitingMap.has(password) && uuid !== waitingMap.get(password)) {
// 		const opponentId = waitingMap.get(password);
// 		waitingMap.delete(password);

// 		const battleId = start(uuid, opponentId);
// 		const battle = battleMap.get(battleId);
// 		console.log("対戦成立1");

// 		matching.set(battle.opponentId, battleId);

// 		return new Response(
// 			JSON.stringify({
// 				"battleId": battleId,
// 				"uuid0": battle.uuid0,
// 				"uuid1": battle.uuid1,
// 				"turn": battle.turn,
// 				"exit": false
// 			}),
// 			{
// 				status: 200,
// 				headers: { "Content-Type": "application/json; charset=utf-8" },
// 			}
// 		);
// 	} else if (matching.has(uuid)) {
// 		const battleId = matching.get(uuid);
// 		matching.delete(uuid);
// 		const battle = battleMap.get(battleId);
// 		console.log("対戦成立2");

// 		return new Response(
// 			JSON.stringify({
// 				"battleId": battleId,
// 				"uuid0": battle.uuid0,
// 				"uuid1": battle.uuid1,
// 				"turn": battle.turn,
// 				"exit": "false"
// 			}),
// 			{
// 				status: 200,
// 				headers: { "Content-Type": "application/json; charset=utf-8" },
// 			}
// 		);
// 	} else {
// 		waitingMap.set(password, uuid);
// 		return new Response(
// 			JSON.stringify({
// 				"errorMessage": "対戦相手を探し中です",
// 				"errorCode": "50001"
// 			}),
// 			{
// 				status: 400,
// 				headers: { "Content-Type": "application/json; charset=utf-8" }
// 			}
// 		)
// 	}
// }



export async function search(uuid, request) {
	// ミューテックスをロック
	const release = await mutex.acquire();

	try {
		console.log("battleMap");
		console.log(battleMap);
		console.log("waitingMap");
		console.log(waitingMap);
		console.log("matching");
		console.log(matching);

		const password = await request.headers.get("password");
		console.log(password);

		if (waitingMap.has(password) && uuid !== waitingMap.get(password)) {
			check(uuid,password);
			const opponentId = waitingMap.get(password);
			waitingMap.delete(password);

			const battleId = start(uuid, opponentId);
			const battle = battleMap.get(battleId);
			console.log("対戦成立1");
			
			return new Response(
				JSON.stringify({
					"battleId": battleId,
					"uuid0": battle.uuid0,
					"uuid1": battle.uuid1,
					"turn": battle.turn,
					"exit": false
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				}
			);
		} else if (matching.has(uuid)) {
			const battleId = matching.get(uuid);
			matching.delete(uuid);
			const battle = battleMap.get(battleId);
			console.log("対戦成立2");

			return new Response(
				JSON.stringify({
					"battleId": battleId,
					"uuid0": battle.uuid0,
					"uuid1": battle.uuid1,
					"turn": battle.turn,
					"exit": "false"
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				}
			);
		} else {
			waitingMap.set(password, uuid);
			return new Response(
				JSON.stringify({
					"errorMessage": "対戦相手を探し中です",
					"errorCode": "50001"
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json; charset=utf-8" }
				}
			)
		}
	} finally {
		// 処理が終了したらミューテックスを解放
		release();
	}
}

function start(uuid, opponentId) {
	const turn = dicedeTurn();
	let uuid0;
	let uuid1;
	if (turn === true) {
		uuid0 = uuid;
		uuid1 = opponentId;
	} else {
		uuid0 = opponentId;
		uuid1 = uuid;

	}
	const battleId = getBattleId();
	console.log(`battleId:${battleId}, firstId:${uuid0}, second:${uuid1}`);

	matching.set(opponentId, battleId);
	const exit = false;
	battleMap.set(
		battleId,
		{
			uuid0: uuid0,
			uuid1: uuid1,
			turn: uuid0,
			exit: exit,
			previousWord: "しりとり",
			secondLastWord: "",
			wordHistories: new Set(["しりとり"]),
		}
	);
	return battleId;
}

function check(uuid,password){
	console.log(`uuid = ${uuid}, password = ${password}`);
}