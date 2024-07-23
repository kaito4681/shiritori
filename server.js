import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";

let previousWord = "しりとり";

Deno.serve(async (request) => {
	const pathname = new URL(request.url).pathname;
	console.log(`pathname: ${pathname}`);

	//GET previousWord
	if (request.method === "GET" && pathname === "/shiritori") {
		return new Response(previousWord);
	}

	//POST previousWord
	if (request.method === "POST" && pathname === "/shiritori") {
		const reeequestJson = await request.json();
		const nextWord = reeequestJson["nextWord"];

		// previousWordの末尾とnextWordの先頭が同一か確認
		if (previousWord.slice(-1) === nextWord.slice(0, 1)) {
			previousWord = nextWord;
		}else{
			return new Response(
				JSON.stringify({
					"errorMessage":"前の単語に続いていません",
					"errorCode":"10001"
				}),
				{
					status:400,
					heeders:{"Content-Type": "application/json; charset=utf-8"}
				}
			)
		}

		return new Response(previousWord);
	}


	return serveDir(
		request,
		{
			fsRoot: "./public/",
			urlRoot: "",
			enableCors: true,
		}
	)

});