
let jumpSound = new Audio('./sound/jump.mp3');
let gameOverSound = new Audio('./sound/collision.mp3');


//board

let board;
let boardWidth = 1250;
let boardHeight = 200;
let context;

//dad

let dadWidth = 88;
let dadHeight = 94;
let dadX = 50;
let dadY = boardHeight - dadHeight;
let dadImg;


let dad = {
x : dadX,
y : dadY,
width : dadWidth,
height : dadHeight
}

//Poopie
let poopieArray = [];

let poopie1Width = 58;
let poopie2Width = 114;
let poopie3Width = 171;

let poopieHeight = 58;
let poopieX = 800;
let poopieY = boardHeight - poopieHeight;

let poopie1Img;
let poopie2Img;
let poopie3Img;

//physics

let velocityX = -5; //poopie moving left
let velocityY = 0; //dad staying in place 
let gravity = .4;
let gameOver = false;
let score = 0;





window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //use for drawing on board

    //boxdad
    // context.fillstyle = "blue";
    // context.fillRect(dad.x, dad.y, dad.width, dad.height)
    dadImg = new Image();
    dadImg.src = "./img/dadd.png";
    dadImg.onload = function(){
    context.drawImage(dadImg,dad.x, dad.y, dad.width, dad.height);
    }

    poopie1Img = new Image();
    poopie1Img.src = "./img/1poopies.png";
    
    poopie2Img = new Image();
    poopie2Img.src = "./img/2poopies.png";
    
    poopie3Img = new Image();
    poopie3Img.src = "./img/3poopies.png";
    
    // dadImg.onload = function(){
    // context.drawImage(dadImg,dad.x, dad.y, dad.width, dad.height);

    requestAnimationFrame(update);
    setInterval (placePoopie,1000); //1000 milliseconds = 1 sec
    document.addEventListener("keydown", moveDad);
    
    document.getElementById("restartButton")
    document.addEventListener("click", function () {
      location.reload(); // simplest way to restart everything
    });

    }

function update (){
requestAnimationFrame(update);  
if (gameOver){
    return; 
    }
context.clearRect(0,0, board.width, board.height);

//dad  
velocityY += gravity;
dad.y = Math.min(dad.y + velocityY,dadY); //apply gravity to current dad.y making sure it doesn't exceed ground

context.drawImage(dadImg,dad.x, dad.y, dad.width, dad.height);
// context.strokeStyle = "blue";
// context.strokeRect(dad.x + 10, dad.y, dad.width - 20, dad.height   );


//poopie
for (let i = 0; i < poopieArray.length; i++){
    let poopie = poopieArray[i];
    poopie.x +=velocityX;
context.drawImage(poopie.img, poopie.x, poopie.y, poopie.width, poopie.height);
// context.strokeStyle = "red";
// context.strokeRect(poopie.x + 10, poopie.y, poopie.width - 20, poopie.height);


if (detectCollision (dad,poopie)) {
    gameOver = true;
    gameOverSound.play();  // play game over sound
    document.getElementById("gameOverText").style.display = "block";

//     dadImg = new Image();
//    dadImg.src = "./img/fallendadd.png";
//    dadImg.onload = function (){
//     context.drawImage(dadImg, dad.x, dad.y, dad.width, dad.height);
 //   }

}
}

//score
context.fillStyle ="#2e1f2f";
context.font = "700 24px 'Press Start 2P', sans-serif";
score++;
context.fillText(score,950,100);


}

function moveDad (e){
   if (gameOver){
    return; 
    }

    if ((e.code =="Space" || e.code == "ArrowUp" && dad.y==dadY )) {
    //jump        
    velocityY = -10;
    jumpSound.play();  // play jump sound

    }
}

function placePoopie (){
if (gameOver){
    return; 
    }
    
    
    

    //place poopie
    const minPoopieGap = 130;

      // Don't place new one if last is too close
  if (poopieArray.length > 0) {
    const lastPoopie = poopieArray[poopieArray.length - 1];
    if (lastPoopie.x > board.width - minPoopieGap) {
      return;
    }
  }

    let poopie = {
        img:null,
        x:poopieX,
        y: poopieY,
        width: null,
        height: poopieHeight
    }

    let placePoopieChance = Math.random();
    if (placePoopieChance > .99)  {  //1% chance of poopie3
    poopie.img = poopie3Img;
    poopie.width = poopie3Width
    poopieArray.push(poopie);
}
    else if (placePoopieChance > .70)  {  //30% chance of poopie3
    poopie.img = poopie2Img;
    poopie.width = poopie2Width
    poopieArray.push(poopie);
}
    else if (placePoopieChance > .50)  {  //50% chance of poopie3
    poopie.img = poopie1Img;
    poopie.width = poopie1Width
    poopieArray.push(poopie);
}
    if (poopieArray.length > 5)  { 
    poopieArray.shift(); //remove first element from array
}
}

function detectCollision (a,b){

    const aPaddingX = 10; // shrink Dad's hitbox horizontally
    const aPaddingY = 10;  // optional: shrink vertically
    const bPaddingX = 8;  // shrink Poopie hitbox


    return a.x + aPaddingX < b.x + b.width - bPaddingX &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width - aPaddingX > b.x + bPaddingX &&   //a's top right corner passes b's top left corner
           a.y + aPaddingY < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height - aPaddingY > b.y;    //a's bottom left corner passes b's top left corner
}