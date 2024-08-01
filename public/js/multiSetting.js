onload = (_event) => {
	const selectedOpponent = sessionStorage.getItem("opponent");
	const password = sessionStorage.getItem("password");

	// 以前の情報があればを入れる
	if (selectedOpponent) {
		const opponentRadio = document.querySelector(`input[name="Opponent"][value="${selectedOpponent}"]`);
		if (opponentRadio) {
			opponentRadio.checked = true;
		}
	}
	if(password){
		document.querySelector("#password").value = password;
	}
	togglePasswordContainer(selectedOpponent || document.querySelector('input[name="Opponent"]:checked').value);
}


document.querySelector("#gameStart").addEventListener("click", function () {
	const selectedOpponent = document.querySelector('input[name="Opponent"]:checked').value;
	sessionStorage.setItem("opponent", selectedOpponent);

	if(selectedOpponent === "password"){
		sessionStorage.setItem("password",document.querySelector("#password").value );
	}


	location.href = selectedOpponent + ".html";
});

document.querySelectorAll('input[name="Opponent"]').forEach(radio => {
	radio.addEventListener("change", function () {
		togglePasswordContainer(this.value);
	});
});

function togglePasswordContainer(value) {
	const passwordContainer = document.querySelector("#passwordContainer");
	if (value === "password") {
		passwordContainer.style.display = "flex";
	} else {
		passwordContainer.style.display = "none";
	}
}