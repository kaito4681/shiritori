// import { serveDir } from "https://deno.land/std@0.223.0/http/file_server.ts";
// import { handleShiritoriGet, handleShiritoriPost, handleReset, wordMap } from "./solo.js";
// import { getId } from "./utility.js";

// Deno.serve(async (request) => {
// 	const pathname = new URL(request.url).pathname;

// 	//id発行
// 	if (request.method === "GET" && pathname === "/getId") {
// 		return getId();
// 	}

// 	const uuid = request.headers.get("UUID");
// 	console.log(`pathname: ${pathname}, UUID: ${uuid}`);

// 	// if (pathname === "/") {
// 	// 	return serveFile(request, "/public/html/index.html");
// 	// }

// 	//初回アクセス
// 	if (!uuid) {
// 		return serveDir(
// 			request,
// 			{
// 				fsRoot: "../public",
// 				urlRoot: "",
// 				enableCors: true,
// 				index: "index.html"
// 			}
// 		);
// 	}

// 	//server再起動後アクセス
// 	if (!wordMap.has(uuid)) {
// 		return new Response(
// 			JSON.stringify({
// 				"errorMessage": "UUIDが正しくありません。ページを再読み込みしてください",
// 				"errorCode": "30001"
// 			}),
// 			{
// 				status: 400,
// 				headers: { "Content-Type": "application/json; charset=utf-8" }
// 			}
// 		);
// 	}

// 	if (request.method === "GET" && pathname === "/solo") {
// 		return handleShiritoriGet(uuid);
// 	}

// 	if (request.method === "POST" && pathname === "/solo") {
// 		const requestJson = await request.json();
// 		return handleShiritoriPost(uuid, requestJson);
// 	}

// 	if (request.method === "POST" && pathname === "/reset") {
// 		return handleReset(uuid);
// 	}

// 	return serveDir(
// 		request,
// 		{
// 			fsRoot: "../public/",
// 			urlRoot: "",
// 			enableCors: true,
// 			index: "index.html"
// 		}
// 	);
// });

// server/main.js
import { serveDir, serveFile } from "https://deno.land/std@0.223.0/http/file_server.ts";
import { handleShiritoriGet, handleShiritoriPost, handleReset, wordMap } from "./solo.js";
import { getId } from "./utility.js";
import { join } from "https://deno.land/std@0.223.0/path/mod.ts";

const publicDir = join(Deno.cwd(), "public");

Deno.serve(async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // id発行
    if (request.method === "GET" && pathname === "/getId") {
        return getId();
    }
    
    const uuid = request.headers.get("UUID");
    console.log(`pathname: ${pathname}, UUID: ${uuid}`);
    
    // 初回アクセス
    if (!uuid) {
        // ルートパスにアクセスされた場合、index.htmlを表示
        if (pathname === "/") {
            return serveFile(request, join(publicDir, "html/index.html"));
        }
        return serveDir(
            request,
            {
                fsRoot: publicDir,
                urlRoot: "",
                enableCors: true,
                index: "html/index.html"
            }
        );
    }

    // server再起動後アクセス
    if (!wordMap.has(uuid)) {
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

    if (request.method === "GET" && pathname === "/solo") {
        return handleShiritoriGet(uuid);
    }

    if (request.method === "POST" && pathname === "/solo") {
        const requestJson = await request.json();
        return handleShiritoriPost(uuid, requestJson);
    }

    if (request.method === "POST" && pathname === "/reset") {
        return handleReset(uuid);
    }

    // ルートパスにアクセスされた場合、index.htmlを表示
    if (pathname === "/") {
        return serveFile(request, join(publicDir, "html/index.html"));
    }

    // 静的ファイルの提供
    return serveDir(
        request,
        {
            fsRoot: publicDir,
            urlRoot: "",
            enableCors: true,
            index: "html/index.html"
        }
    );
});
