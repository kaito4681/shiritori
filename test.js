let prevWord = "おーーーー";
if (prevWord.slice(-1) === "ー") {
	do {
		prevWord = prevWord.slice(0. - 1);
		console.log(prevWord.slice(0, -1));
	} while (prevWord.slice(-1) === "ー");
}