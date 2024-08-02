import { battleMap } from "./multiSetting.js";

export function get(request) {
	const battleId = request.body.battleId;
	if (battleId) {
		const battle = battleMap.get(battleId);
		return new Response(
			JSON.stringify({
				"battleId": battleId,
				"uuid0": battle.uuid0,
				"uuid1": battle.uuid1,
				"turn": battle.turn,
				"previousWord": battle.previousWord,
				"secondLastWord": battle.secondLastWord,
				"exit": false
			}),
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