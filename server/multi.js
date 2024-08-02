import { battleMap } from "./multiSetting.js";

export async function update(request) {
	const data = await request.json();
	const battleId = data.battleId;
	console.log(`battleId:${battleId}`);

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