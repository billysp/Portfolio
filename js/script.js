// JS for game

var myGamePiece;    //Εδω εχουμε την δημιουργια μεταβλητης  για το πιονι μας
var myObstacles = []; //Εδω εχουμε την δημιουργια μεταβλητης για τα εμποδια
var myScore; //Εδω εχουμε την δημιουργια μεταβλητης  για το score

function startGame() {
    myGamePiece = new component(45, 45, "black", 50, 250);
    myScore = new component("30px", "Consolas", "red", 280, 40, "text");
    myGameArea.start();
} //Δημιουργια μιας Function  οποια καθοριζει την εναρξη του παιχνιδιου , και του πιονιου μας
function restartGame() {
document.getElementById("myfilter").style.display = "none";
document.getElementById("myrestartbutton").style.display = "none";
myGameArea.stop();
myGameArea.clear();
myGameArea = {};
myGamePiece = {};
myObstacles = [];
myscore = {};
document.getElementById("canvascontainer").innerHTML = "";
startGame()
} //Δημιουργια μιας Function για το reset button

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1200;
        this.canvas.height = 515;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
} 	//Δημιουργουμε τον χωρο παιχνιδιου(μεσα στον κανβα) καθως και το μεγεθος της περιοχης 
	//του παιχνιδιου και bindaroume τα κουμπια UP DOWN και το ποσο γρηγορα θα κανει update(κινηση) το game area μας

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom();
		this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
	this.hitTop = function() {
        var rocktop = 0;
        if (this.y < 0) {
            this.y = 0;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}// Οι functions η οποιες ειναι υπευθηνες για τα ορια του παιχνιδιου

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
		    myGameArea.stop();
            document.getElementById("myfilter").style.display = "block";
            document.getElementById("myrestartbutton").style.display = "block";
            return;
        } 
    }
    myGameArea.clear();
	myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();    
    myGamePiece.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(360)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 250;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 70;
        maxGap = 90;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "black", x, 0));
        myObstacles.push(new component(10, x - height - gap, "black", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}//Η function αυτη ειναι υπευθυνη για τους ποντους για το μεγεθος των εμποδιων για το κενο αναμεσα στα εμποδια για την κινηση του πιονιου (πανω κατω) και την ταχυτητα ανταποκρισης

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}//The everyinterval function returns true if the current framenumber corresponds with the given interval

function clickPlayagain() {
     reset();
     startGame();

}//reset button-->
startGame();
