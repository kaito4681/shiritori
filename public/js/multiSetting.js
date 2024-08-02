onload = async (_event) => {
	const selectedOpponent = sessionStorage.getItem("opponent");
	const password = sessionStorage.getItem("password");
	let uuid = sessionStorage.getItem("uuid");
	if (!uuid) uuid = await getUUID();
	console.log(`uuid: ${uuid}`);

	// 以前の情報があればを入れる
	if (selectedOpponent) {
		const opponentRadio = document.querySelector(`input[name="Opponent"][value="${selectedOpponent}"]`);
		if (opponentRadio) {
			opponentRadio.checked = true;
		}
	}
	if (password) {
		document.querySelector("#password").value = password;
	}
	togglePasswordContainer(selectedOpponent || document.querySelector('input[name="Opponent"]:checked').value);
}

//ゲームスタートボタン
document.querySelector("#gameStart").addEventListener("click", async function () {
	// opponent
	const selectedOpponent = document.querySelector('input[name="Opponent"]:checked').value;
	sessionStorage.setItem("opponent", selectedOpponent);
	
	//computer対戦のとき
	if (selectedOpponent === "computer") {
		location.href = "/computer.html";
		return;
	}

	//Loading表示
	const loading = document.querySelector("#loading");
	loading.style.display = "block";
	
	// startButton
	const startButton = document.querySelector("#gameStart");
	startButton.disabled = true;

	// uuid
	let uuid = sessionStorage.getItem("uuid");
	if (!uuid) uuid = await getUUID();
	console.log(`uuid: ${uuid}`);

	// password 
	// randomのときは空文字
	let password = document.querySelector("#password").value;
	if (selectedOpponent === "password") {
		if (password === "") {
			alert("合言葉を入力してください。");
		}
	}
	if (selectedOpponent != "password") {
		password = "";
	}

	// 60回アクセス
	let i;
	for (i = 0; i < 60; i++) {
		const response = await fetch(
			"/search",
			{
				method: "POST",
				headers: {
					"UUID": uuid,
					"password": password
				},
			}
		);
		if (response.status !== 200) {
			await _sleep(1000);
			continue;
		} else {
			const resText = await response.text();
			const battelId = await JSON.parse(resText)["battleId"];
			sessionStorage.setItem("battleId", battelId);
			location.href = "/multi.html";
			return;
		}
	}


	loading.style.display = "none";
	startButton.disabled = false;
	alert("対戦相手が見つかりませんでした。");
});


document.querySelectorAll('input[name="Opponent"]').forEach(radio => {
	radio.addEventListener("change", function () {
		togglePasswordContainer(this.value);
	});
})

function togglePasswordContainer(value) {
	const passwordContainer = document.querySelector("#passwordContainer");
	if (value === "password") {
		passwordContainer.style.display = "flex";
	} else {
		passwordContainer.style.display = "none";
	}
}