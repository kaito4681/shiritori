import { dicedeTurn, getBattleId } from "./utility.js";

const battleMap = new Map();
const waitingMap = new Map();
const matchiing = new Map();


export async function search(uuid, request) {
	console.log(battleMap);
	console.log(waitingMap);

	const password = await request.headers.get("password");
	if (waitingMap.has(password) && uuid !== waitingMap.get(password)) {
		const opponentId = waitingMap.get(password);
		waitingMap.delete(password);
		const battleId = start(uuid, opponentId);
		const battle = battleMap.get(battleId);
		console.log("対戦成立1");

		return new Response(
			JSON.stringify({
				battleId: battleId,
				uuid0: battle.uuid0,
				uuid1: battle.uuid1,
				turn: battle.turn
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json; charset=utf-8" }
			}
		);
	} else if (matchiing.has(uuid)) {
		const battleId = matchiing.get(uuid);
		const battle = battleMap.get(battleId);
		console.log("対戦成立2");

		return new Response(
			JSON.stringify({
				battleId: battleId,
				uuid0: battle.uuid0,
				uuid1: battle.uuid1,
				turn: battle.turn
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json; charset=utf-8" }
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

	matchiing.set(opponentId, battleId);
	battleMap.set(
		battleId,
		{
			uuid0: uuid0,
			uuid1: uuid1,
			turn: "first",
			secondLastWord: "",
			previousWord: "しりとり",
			wordHistories: new Set(["しりとり"]),
		}
	);
	return battleId;
}

