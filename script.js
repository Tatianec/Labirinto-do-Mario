const cont = document.getElementById("container");
const maze = document.getElementById("maze");
const thingie = document.getElementById("thingie");
const home = document.getElementById("home");
const emo = document.getElementById("emo");
var modal = document.getElementById('myModal');
var playing = true;
var msgEnd = document.getElementById('msgEnd');
var modalImg = document.getElementById("modal-img");

const bu = document.getElementById("bu");
const bd = document.getElementById("bd");
const bl = document.getElementById("bl");
const br = document.getElementById("br");

const step = 20;
const size = 20;
const bwidth = 4;
const mazeHeight = 200;
const mazeWidth = 300;
let nogoX = [];
let nogoX2 = [];
let nogoY = [];
let nogoY2 = [];
let prevDist = mazeWidth * 2;

let lastUD = 0;
let lastLR = 0;
const mThreshold = 15;
let firstMove = true;
let allowTilt = true;

const sThreshold = 10;

const scThreshold = 20;

genSides();

let my = mazeHeight / step;
let mx = mazeWidth / step;

let grid = [];
for (let i = 0; i < my; i++) {
	let sg = [];
	for (let a = 0; a < mx; a++) {
		sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
	}
	grid.push(sg);
}

let dirs = ["u", "d", "l", "r"];
let modDir = {
	u: { y: -1, x: 0, o: "d" },
	d: { y: 1, x: 0, o: "u" },
	l: { y: 0, x: -1, o: "r" },
	r: { y: 0, x: 1, o: "l" }
};

genMaze(0, 0, 0);
drawMaze();

const barriers = document.getElementsByClassName("barrier");
for (let b = 0; b < barriers.length; b++) {
	nogoX.push(barriers[b].offsetLeft);
	nogoX2.push(barriers[b].offsetLeft + barriers[b].clientWidth);
	nogoY.push(barriers[b].offsetTop);
	nogoY2.push(barriers[b].offsetTop + barriers[b].clientHeight);
}

document.addEventListener("keydown", keys);

function keys(e) {
	let code = e.code;
	switch (code) {
		case "ArrowUp":
			up();
			break;
		case "ArrowDown":
			down();
			break;
		case "ArrowLeft":
			left();
			break;
		case "ArrowRight":
			right();
			break;
		case "KeyW":
			up();
			break;
		case "KeyS":
			down();
			break;
		case "KeyA":
			left();
			break;
		case "KeyD":
			right();
			break;
	}
}

bu.addEventListener("click", (e) => {
	up();
	firstMove = true;
});
bd.addEventListener("click", (e) => {
	down();
	firstMove = true;
});
bl.addEventListener("click", (e) => {
	left();
	firstMove = true;
});
br.addEventListener("click", (e) => {
	right();
	firstMove = true;
});

function up() {
	animKeys(bu);
	if (checkYboundry("u")) {
		thingie.style.top = thingie.offsetTop - step + "px";
		updateEmo(false);
	}
}

function down() {
	animKeys(bd);
	if (checkYboundry("d")) {
		thingie.style.top = thingie.offsetTop + step + "px";
		updateEmo(false);
	}
}

function left() {
	animKeys(bl);
	if (checkXboundry("l")) {
		thingie.style.left = thingie.offsetLeft - step + "px";
	}
	updateEmo(true);
}

function right() {
	animKeys(br);
	if (checkXboundry("r")) {
		thingie.style.left = thingie.offsetLeft + step + "px";
	}
	updateEmo(true);
}

function checkXboundry(dir) {
	let x = thingie.offsetLeft;
	let y = thingie.offsetTop;
	let ok = [];
	let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

	let check = 0;
	for (let i = 0; i < len; i++) {
		check = 0;
		if (y < nogoY[i] || y > nogoY2[i] - size) {
			check = 1;
		}
		if (dir === "r") {
			if (x < nogoX[i] - size || x > nogoX2[i] - size) {
				check = 1;
			}
		}
		if (dir === "l") {
			if (x < nogoX[i] || x > nogoX2[i]) {
				check = 1;
			}
		}
		ok.push(check);
	}
	let res = ok.every(function (e) {
		return e > 0;
	});
	return res;
}

function checkYboundry(dir) {
	let x = thingie.offsetLeft;
	let y = thingie.offsetTop;
	let ok = [];
	let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

	let check = 0;
	for (let i = 0; i < len; i++) {
		check = 0;
		if (x < nogoX[i] || x > nogoX2[i] - size) {
			check = 1;
		}
		if (dir === "u") {
			if (y < nogoY[i] || y > nogoY2[i]) {
				check = 1;
			}
		}
		if (dir === "d") {
			if (y < nogoY[i] - size || y > nogoY2[i] - size) {
				check = 1;
			}
		}
		ok.push(check);
	}
	let res = ok.every(function (e) {
		return e > 0;
	});
	return res;
}

function genSides() {
	let max = mazeHeight / step;
	let l1 = Math.floor(Math.random() * max) * step;
	let l2 = mazeHeight - step - l1;

	let lb1 = document.createElement("div");
	lb1.style.top = step + "px";
	lb1.style.left = step + "px";
	lb1.style.height = l1 + "px";

	let lb2 = document.createElement("div");
	lb2.style.top = l1 + step * 2 + "px";
	lb2.style.left = step + "px";
	lb2.style.height = l2 + "px";

	let rb1 = document.createElement("div");
	rb1.style.top = step + "px";
	rb1.style.left = mazeWidth + step + "px";
	rb1.style.height = l2 + "px";

	let rb2 = document.createElement("div");
	rb2.style.top = l2 + step * 2 + "px";
	rb2.style.left = mazeWidth + step + "px";
	rb2.style.height = l1 + "px";

	nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
	nogoX2.push(
		0 + bwidth,
		mazeWidth + 2 * step + bwidth,
		step,
		step,
		mazeWidth + 2 * step,
		mazeWidth + 2 * step
	);
	nogoY.push(
		l1 + step,
		l2 + step,
		l1 + step,
		l1 + 2 * step,
		l2 + step,
		l2 + 2 * step
	);
	nogoY2.push(
		l1 + 2 * step,
		l2 + 2 * step,
		l1 + step + bwidth,
		l1 + 2 * step + bwidth,
		l2 + step + bwidth,
		l2 + 2 * step + bwidth
	);
	thingie.style.top = l1 + step + "px";
	thingie.style.left = 0 + "px";

	home.style.top = l2 + step + "px";
	home.style.left = mazeWidth + step + "px";

	let els = [lb1, lb2, rb1, rb2];
	for (let i = 0; i < els.length; i++) {
		confSideEl(els[i]);
		maze.appendChild(els[i]);
	}
}

function confSideEl(el) {
	el.setAttribute("class", "barrier");
	el.style.width = bwidth + "px";
}

function genMaze(cx, cy, s) {
	let d = limShuffle(dirs, s);

	for (let i = 0; i < d.length; i++) {
		let nx = cx + modDir[d[i]].x;
		let ny = cy + modDir[d[i]].y;
		grid[cy][cx].v = 1;

		if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
			grid[cy][cx][d[i]] = 1;
			grid[ny][nx][modDir[d[i]].o] = 1;
			genMaze(nx, ny, i);
		}
	}
}

function drawMaze() {
	for (let x = 0; x < mx; x++) {
		for (let y = 0; y < my; y++) {
			let l = grid[y][x].l;
			let r = grid[y][x].r;
			let u = grid[y][x].u;
			let d = grid[y][x].d;

			drawLines(x, y, l, r, u, d);
		}
	}
}

function drawLines(x, y, l, r, u, d) {
	let top = (y + 1) * step;
	let left = (x + 1) * step;
	if (l === 0 && x > 0) {
		let el = document.createElement("div");
		el.style.left = left + "px";
		el.style.height = step + "px";
		el.style.top = top + "px";
		el.setAttribute("class", "barrier");
		el.style.width = bwidth + "px";
		maze.appendChild(el);
	}

	if (d === 0 && y < my - 1) {
		let el = document.createElement("div");
		el.style.left = left + "px";
		el.style.height = bwidth + "px";
		el.style.top = top + step + "px";
		el.setAttribute("class", "barrier");
		el.style.width = step + bwidth + "px";
		maze.appendChild(el);
	}
}

function limShuffle(array, s) {
	let con = array.slice(0, s);
	let ran = array.slice(s, array.length);

	for (let i = ran.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		
		[ran[i], ran[j]] = [ran[j], ran[i]];
	}
	let comb = con.concat(ran);
	return comb;
}

function animKeys(key) {
	if (key.id === "bu") {
		key.style.border = "1px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.transform = "translateY(-1px)";
	}
	if (key.id === "bd") {
		key.style.border = "1px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.transform = "translateY(-1px)";
	}
	if (key.id === "bl") {
		key.style.border = "1px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.transform = "translateY(-1px)";
	}
	if (key.id === "br") {
		key.style.border = "1px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.transform = "translateY(-1px)";
	}

	
	setTimeout(() => {
		key.style.border = "1px #fff solid";
		key.style.borderTop = "1px #fff solid";
		key.style.borderBottom = "1px #fff solid";
		key.style.borderLeft = "1px #fff solid";
		key.style.borderRight = "1px #fff solid";
		key.style.transform = "translateY(0px)";
		key.style.transform = "translateX(0px)";
	}, "150");
}

modelfungo = function() {
	modal.style.display = "block";
	x = document.querySelector(".gamehead");
	modalImg.src = "img/looser.png";
	x.textContent ="Game Over!";
}

modelfunwin = function() {
	modal.style.display = "block";
	x = document.querySelector(".gamehead");
	modalImg.src = "img/end.png";
	x.textContent = "Congrats! You Win";
}

document.getElementById("demo").addEventListener("click", myFunction);

var span = document.getElementsByClassName("close")[0];

function myFunction() {
	document.location.reload();
}

span.onclick = function() {
	modal.style.display = "none";
}

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

let maxl = 0;
let prevl = 0;
var img= new Image(); 

function updateEmo(lr) {
	
	if (lr) {
		if (
			thingie.offsetLeft > mazeWidth - step &&
			thingie.offsetTop === home.offsetTop
		) {
			emo.innerHTML = "<img src=img/looser.png  class=emo>";
			home.innerHTML = "<img src=img/star.png  class=emo>";
		}
		if (thingie.offsetLeft > mazeWidth) {
			emo.innerHTML = "";
			home.innerHTML = "<img src=img/star.png  class=emo>";
			this.playing = false;
			modelfunwin();
		}
		prevl = thingie.offsetLeft;
	} else {
		if (thingie.offsetLeft > (mazeWidth - step) && thingie.offsetTop === home.offsetTop) {
			emo.innerHTML = "<img src=img/looser.png class=emo>";
		}else{
			if(thingie.offsetLeft > (mazeWidth - step) && thingie.offsetTop != home.offsetTo){
				emo.innerHTML = "<img src=img/mario.png  class=emo>";
			}
		}
	}
}

window.addEventListener("deviceorientation", handleOrientation);

function tiltTimer() {
	allowTilt = false;
	setTimeout(() => {
		allowTilt = true;
	}, "200");
}

function handleOrientation(e) {

	if (firstMove) {
		lastUD = e.beta;
		lastLR = e.gamma;
		firstMove = false;
	}
	if (allowTilt) {
		if (e.beta < lastUD - mThreshold) {
			up();
			tiltTimer();
		}
		if (e.beta > lastUD + mThreshold) {
			down();
			tiltTimer();
		}
		if (e.gamma < lastLR - mThreshold) {
			left();
			tiltTimer();
		}
		if (e.gamma > lastLR + mThreshold) {
			right();
			tiltTimer();
		}
	}
}

let haveEvents = "ongamepadconnected" in window;
let gp = [];
let allowU = true;
let allowD = true;
let allowL = true;
let allowR = true;

let allowAU = true;
let allowAD = true;
let allowAL = true;
let allowAR = true;

window.addEventListener("gamepadconnected", connectGamepad);
window.addEventListener("gamepaddisconnected", disconnectGamepad);

function disconnectGamepad() {
	gp = [];
}

function connectGamepad(e) {
	gp[0] = e.gamepad;
	requestAnimationFrame(updateStatus);
}

function updateStatus() {
	if (!haveEvents) {
		scangamepads();
	}

	for (let i = 0; i < gp[0].buttons.length; i++) {
	
		if (gp[0].buttons[12].pressed) {
			if (allowU) {
				up();
				gpTimer("u");
			}
		}
		if (gp[0].buttons[12].pressed === false) {
			allowU = true;
		}

		
		if (gp[0].buttons[13].pressed) {
			if (allowD) {
				down();
				gpTimer("d");
			}
		}
		if (gp[0].buttons[13].pressed === false) {
			allowD = true;
		}

		
		if (gp[0].buttons[14].pressed) {
			if (allowL) {
				left();
				gpTimer("l");
			}
		}
		if (gp[0].buttons[14].pressed === false) {
			allowL = true;
		}

		
		if (gp[0].buttons[15].pressed) {
			if (allowR) {
				right();
				gpTimer("r");
			}
		}
		if (gp[0].buttons[15].pressed === false) {
			allowR = true;
		}
	}

	for (let j = 0; j < gp[0].axes.length; j++) {
		if (gp[0].axes[1] < -0.8 || gp[0].axes[3] < -0.8) {
			if (allowAU) {
				up();
				gpATimer("u");
			}
		}
		if (gp[0].axes[1] > 0.8 || gp[0].axes[3] > 0.8) {
			if (allowAD) {
				down();
				gpATimer("d");
			}
		}
		if (gp[0].axes[0] < -0.8 || gp[0].axes[2] < -0.8) {
			if (allowAL) {
				left();
				gpATimer("l");
			}
		}
		if (gp[0].axes[0] > 0.8 || gp[0].axes[2] > 0.8) {
			if (allowAR) {
				right();
				gpATimer("r");
			}
		}
	}

	requestAnimationFrame(updateStatus);
}

function scangamepads() {
	var gamepads = navigator.getGamepads
		? navigator.getGamepads()
		: navigator.webkitGetGamepads
		? navigator.webkitGetGamepads()
		: [];
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i]) {
			if (gamepads[i].index in gp) {
				gp[gamepads[i].index] = gamepads[i];
			} else {
				addgamepad(gamepads[i]);
			}
		}
	}
}

if (!haveEvents) {
	setInterval(scangamepads, 500);
}

function gpTimer(adir) {
	switch (adir) {
		case "u":
			allowU = false;
			break;

		case "d":
			allowD = false;
			break;

		case "l":
			allowL = false;
			break;

		case "r":
			allowR = false;
			break;
	}

	setTimeout(() => {
		allowU = true;
		allowD = true;
		allowL = true;
		allowR = true;
	}, "200");
}

function gpATimer(adir) {
	switch (adir) {
		case "u":
			allowAU = false;
			break;

		case "d":
			allowAD = false;
			break;

		case "l":
			allowAL = false;
			break;

		case "r":
			allowAR = false;
			break;
	}

	setTimeout(() => {
		allowAU = true;
		allowAD = true;
		allowAL = true;
		allowAR = true;
	}, "200");
}

let lasttouchpY = 0;
let lasttouchpX = 0;
cont.addEventListener("touchstart", (e) => {
	lasttouchpY = e.changedTouches[0].pageY;
	lasttouchpX = e.changedTouches[0].pageX;
});

cont.addEventListener("touchmove", (e) => {
	e.preventDefault();
	let diffY = e.changedTouches[0].pageY - lasttouchpY;
	let diffX = e.changedTouches[0].pageX - lasttouchpX;
	if (diffY > sThreshold) {
		down();
		lasttouchpY = e.changedTouches[0].pageY;
	} else {
		if (diffY < -1 * sThreshold) {
			up();
			lasttouchpY = e.changedTouches[0].pageY;
		}
	}
	if (diffX > sThreshold) {
		right();
		lasttouchpX = e.changedTouches[0].pageX;
	} else {
		if (diffX < -1 * sThreshold) {
			left();
			lasttouchpX = e.changedTouches[0].pageX;
		}
	}
});

let lastscrollpY = 0;
let lastscrollpX = 0;
cont.addEventListener("wheel", (e) => {
	
	lastscrollpY = lastscrollpY + e.deltaY;
	if (lastscrollpY > 0 && e.deltaY < 0) {
		lastscrollpY = 0;
	}
	if (lastscrollpY < 0 && e.deltaY > 0) {
		lastscrollpY = 0;
	}

	if (lastscrollpY > scThreshold) {
		up();
		lastscrollpY = 0;
	}
		if (lastscrollpY < (-1 * scThreshold)) {
		down();
		lastscrollpY = 0;
	}
	
	lastscrollpX = lastscrollpX + e.deltaX;
	if (lastscrollpX > 0 && e.deltaX < 0) {
		lastscrollpX = 0;
	}
	if (lastscrollpX < 0 && e.deltaX > 0) {
		lastscrollpX = 0;
	}

	if (lastscrollpX > scThreshold) {
		left();
		lastscrollpX = 0;
	}
		if (lastscrollpX < (-1 * scThreshold)) {
		right();
		lastscrollpX = 0;
	}
});

window.onload = function () {
	duration = 30;
	x = document.querySelector("#timerel");
	startTimer(duration,x)
}

function startTimer(duration, display) {
	var start = Date.now(),
		diff,
		minutes,
		seconds;

	function timer() {
		if(this.playing) {
			diff = duration - (((Date.now() - start) / 1000) | 0);
			minutes = (diff / 60) | 0;
			seconds = (diff % 60) | 0;
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			display.textContent = "Game ends in " + minutes + ":" + seconds;

			if (diff <= 0) {
				start = Date.now() + 1000;	
				this.playing = false;
				this.msgEnd.style.display = "none";
				modelfungo();	
			}
		}
		this.msgEnd.textContent = "Você venceu em " +  (duration - (minutes + seconds)) + " s";
	};
	timer();
	setInterval(timer, 1000);
}