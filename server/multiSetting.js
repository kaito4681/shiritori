import { dicedeTurn, getBattleId } from "./utility.js";
import { Mutex } from 'npm:async-mutex';

const mutex = new Mutex();

export const battleMap = new Map();
const waitingMap = new Map();
const matchedMap = new Map();


export async function search(uuid, request) {
	const release = await mutex.acquire();

	try {
		console.log("battleMap");
		console.log(battleMap);
		console.log("waitingMap");
		console.log(waitingMap);
		console.log("matching");
		console.log(matchedMap);

		const password = await request.headers.get("password");
		console.log(password);


		check(uuid, password);

		// 自分が待っていて、相手が見つかった時
		if (matchedMap.has(uuid)) {
			const battleId = matchedMap.get(uuid);
			matchedMap.delete(uuid);
			const battle = JSON.parse(battleMap.get(battleId));
			console.log("対戦成立1人目IN,2人目IN");
			return new Response(
				JSON.stringify({
					"battleId": battleId,
					"uuid0": battle.uuid0,
					"uuid1": battle.uuid1,
					"turn": battle.uuid0,
					"exit": "false"
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				}
			);
		} else if (waitingMap.has(password) && uuid !== waitingMap.get(password)) {//相手が待っている時
			const opponentId = waitingMap.get(password);
			waitingMap.delete(password);

			//先攻、後攻を決める。
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

			//battleId発行,battle情報の保存
			const battleId = getBattleId();
			battleMap.set(
				battleId,
				JSON.stringify(
					{
						uuid0: uuid0,
						uuid1: uuid1,
						turn: uuid0,
						exit: "false",
						previousWord: "しりとり",
						secondLastWord: "",
						wordHistories: new Set(["しりとり"]),
					}
				)
			);
			matchedMap.set(opponentId, battleId);
			console.log("対戦成立:1人目waiting,2人目IN");

			return new Response(
				JSON.stringify({
					"battleId": battleId,
					"uuid0": uuid0,
					"uuid1": uuid1,
					"turn": uuid0,
					"exit": "false"
				}),
				{
					status: 200,
					headers: { "Content-Type": "application/json; charset=utf-8" },
				}
			);
		} else if (!waitingMap.has(password)) { //待っていることと伝えてないい時
			waitingMap.set(password, uuid);
		}
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

	} finally {
		release();
	}
}

function check(uuid, password) {
	console.log(`uuid = ${uuid}, password = ${password}`);
}