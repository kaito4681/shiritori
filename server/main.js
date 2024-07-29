import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

import { soloGet, soloPost, Reset } from "./solo.js";
import { get as cpGet, post as cpPost } from "./computer.js"
import { getId, idList } from "./utility.js"

Deno.serve(async (request) => {
	const url = new URL(request.url);
	const pathname = url.pathname;

	// id発行
	if (request.method === "GET" && pathname === "/getId") {
		console.log("id発行");
		return new Response(getId());
	}

	const uuid = request.headers.get("UUID");
	console.log(`pathname: ${pathname}, method: ${request.method}, UUID: ${uuid}`);

	// 初回アクセス
	if (!uuid) {
		return serveDir(
			request,
			{
				fsRoot: "./public/",
				urlRoot: "",
				enableCors: true,
			}
		);
	}

	// server再起動後アクセス
	if (!idList.includes(uuid)) {
		return new Response(
			JSON.stringify({
				"errorMessage": "UUIDが正しくありません。ページを再読み込みしてください",
				"errorCode": "30001"
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json; charset=utf-8" }
			}
		);
	}

	//solo用
	if (request.method === "GET" && pathname === "/solo") {
		return await soloGet(uuid);
	}

	if (request.method === "POST" && pathname === "/solo") {
		return await soloPost(uuid, request);
	}

	if (request.method === "POST" && pathname === "/solo/reset") {
		return await Reset(uuid);
	}

	//vsComputer用
	if (request.method === "GET" && pathname === "/computer") {
		console.log("a");
		return await cpGet(uuid);
	}
	
	if (request.method === "POST" && pathname === "/computer") {
		console.log("b");
		return await cpPost(uuid, request);
	}
	
	if (request.method === "POST" && pathname === "computer/reset") {
		console.log("c");
		return await Reset(uuid);
	}






	return serveDir(
		request,
		{
			fsRoot: "./public/",
			urlRoot: "",
			enableCors: true,
		}
	);
});