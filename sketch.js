//variáveis para o t-rex
var trex, trexImgCorrendo, trexC;
//variável para as bordas
var edges;
//variáveis para o chão
var ground, groundImg;
//sounds
var deathSound, jumpSound, checkpointSound;
//variável para o chão invisível
var invisible_ground;
//nuvens
var clouds, cloudImg, score = 0;
//obstáculos
var cacto1, cacto2, cacto3, cacto4, cacto5, cacto6
//game
var gameOver, gameOverImg, restart, restartImg;
//gameState
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//pré carregamento de imagens 
function preload() {
//imagens do t-rex sendo carregadas na var auxiliar 
  trexImgCorrendo = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trexC = loadImage("trex_collided.png");

//imagem do chão sendo carregada na var auxiliar 
  groundImg = loadImage("ground2.png");

//imagem das nuvens
  cloudImg = loadImage("cloud.png");

//imagem dos cactos
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");

//game
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

//sons
  deathSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

//função de configuração
function setup() {
//área do game
  createCanvas(windowWidth, windowHeight);

//t-rex sprite e caracteristicas
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("trexCorrendo", trexImgCorrendo);
  trex.addAnimation("trexColidindo", trexC);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 40);

//sprite do chão e características 
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("ground", groundImg);

//sprite do chão invisível
  invisible_ground = createSprite(width/2, height-10, width, 10);
  invisible_ground.visible = false;

//bordas
  edges = createEdgeSprites();

//grupo
  cactoG = new Group();
  cloudG = new Group();

//game
  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(width/2, height/2+40);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
}

//executa várias vezes 
function draw() {
//cor de fundo
  background("white");

//texto
  text("score: " + score, width-100, 50);
  
//gameState
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
//velocidade do chão
    ground.velocityX = -(6+score/100);
//checkpointSound
    if(score > 0 && score % 500 === 0){
      checkpointSound.play();
    }
//recarregamento do chão
    if(ground.x < 0){
      ground.x = ground.width/2
    }
//código para o trex pular
    if(touches.length > 0 || keyDown("space")){
      if(trex.y >= height-40){
        trex.velocityY = -10;
        jumpSound.play();
        touches = [];
      }
    }

//gravidade
  trex.velocityY = trex.velocityY + 0.5;
  
//chamando a função
  createClouds();
  createObstacles();

//end
  if(cactoG.isTouching(trex)){
    gameState = END;
    deathSound.play();
  }
  }

  else if(gameState === END){
    restart.visible = true;
    gameOver.visible = true;
    ground.velocityX = 0;
    cactoG.setVelocityXEach(0);
    cloudG.setVelocityXEach(0);
    trex.changeAnimation("trexColidindo", trexC);
    cactoG.setLifetimeEach(-1);
    cloudG.setLifetimeEach(-1);
    trex.velocityY = 0;

    if(mousePressedOver(restart) || touches.length > 0){
      reset();
      touches = [];
    }
  }

//trex colidindo
  trex.collide(invisible_ground);
  
//desenha os sprites 
  drawSprites();
}

function reset(){
  gameState = PLAY;
  cactoG.destroyEach();
  cloudG.destroyEach();
  score = 0;
  trex.changeAnimation("trexCorrendo", trexImgCorrendo);
  gameOver.visible = false;
  restart.visible = false;
}

function createClouds(){
  if(frameCount % 60 === 0){
    clouds = createSprite(width+10, height-100, 10, 10);
    clouds.addAnimation("nuvem", cloudImg);
    clouds.scale = 0.5;
    clouds.velocityX = -(6+score/100);
    clouds.y = Math.round(random(height-150,height-100));
    clouds.depth = trex.depth;
    trex.depth = trex.depth +1;
    console.log("nuvens: ", clouds.depth);
    console.log("trex: ", trex.depth);
    clouds.lifetime = width+10;
    cloudG.add(clouds);
  }
}

function createObstacles(){
  if(frameCount % 60 === 0){
    var cacto = createSprite(width+10, height-35, 10, 40);
    cacto.velocityX = -(6+score/100);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1 : cacto.addImage(cacto1);
      break;
      case 2 : cacto.addImage(cacto2);
      break;
      case 3 : cacto.addImage(cacto3);
      break;
      case 4 : cacto.addImage(cacto4);
      break;
      case 5 : cacto.addImage(cacto5);
      break;
      case 6 : cacto.addImage(cacto6);
      break;
    }
    cacto.scale = 0.5;
    cacto.lifetime = width+10;
    cactoG.add(cacto);
  } 
}
