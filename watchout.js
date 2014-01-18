var gameOptions = {
  height: 450,
  width: 700,
  padding: 10,
  enemies: 20
};

var gameStats = {
  score : 0,
  bestScore : 0
};

var axis = {
  x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
};

var gameBoard = d3.select('body').select('.container').append('svg:svg')
          .attr('width', gameOptions.width)
          .attr('height', gameOptions.height);

var updateScore = function() {
  d3.select('#currentScore').text(gameStats.score.toString());
};

var updateBestScore = function() {
  this.bestScore = Math.max(this.bestScore, this.score);
  d3.select('#bestScore').text(gameStats.bestScore.toString());
};

var Player = function(gameOptions){
  this.gameOptions = gameOptions;
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  // this.r = 5;
};

Player.prototype.render = function(to) {
  this.el = to.append('svg:path')
    .attr('d', this.path)
    .attr('fill', this.fill);

  this.transform({
    x : this.gameOptions.width * 0.5,
    y : this.gameOptions.height * 0.5
  });

  this.setupDragging();
  return this;
};

Player.prototype.getX = function() {
  return this.x;
};

Player.prototype.setX =  function(x) {
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  if(x >= maxX) {
    x = maxX;
  } else if(x <= minX) {
    x = minX;
  }
  this.x = x;
};

Player.prototype.getY = function() {
  return this.y;
};

Player.prototype.setY =  function(y) {
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.height - this.gameOptions.padding;
  if(y >= maxY) {
    y = maxY;
  } else if(y <= minY) {
    y = minY;
  }
  this.y = y;
};

Player.prototype.transform = function(options){
  this.angle = options.angle || this.angle;
  this.x = options.x || this.x;
  this.y = options.y || this.y;
  this.el.attr('transform', "rotate(" + this.angle +","+this.x+","+this.y+")");
  this.el.attr('transform', "translate("+this.x+","+this.y+")");
};

Player.prototype.relativeMove = function(xOffest, yOffset){
  this.setX(this.x + xOffest);
  this.setY(this.y + yOffset);
  this.el.attr('transform', "translate("+this.x+","+this.y+")");
};

Player.prototype.setupDragging = function() {
  var dragMove = function() {
    this.relativeMove(d3.event.dx, d3.event.dy);
  };

  var drag = d3.behavior.drag()
      .on('drag', dragMove.bind(this));
  this.el.call(drag);
};

var player = new Player(gameOptions);
player.render(gameBoard);

var Enemy = function(gameOptions) {
  this.gameOptions = gameOptions;
  this.fill = 'red';
  this.class = 'enemy';
  this.r = 5;
  this.angle = 0;
};

var Friend = function(gameOptions) {
  Enemy.call(this, gameOptions);
  this.fill = 'green';
  this.class = 'friend';
};

Friend.prototype = Object.create(Enemy.prototype);
Friend.prototype.constructor = Friend;

Enemy.prototype.render = function(to, figure){
  this.el = to.append('svg:circle').data(figure)
    .attr('class', function(d){return d.class})
    .attr('r', this.r)
    .attr('fill', function(d){return d.fill})
    .attr('cx', function(d){return Math.random()*500})
    .attr('cy', function(d){return Math.random()*500});
};

Enemy.prototype.move = function(figureClass) {
  d3.selectAll(figureClass)
    .transition()
    .duration(2000)
    .attr('cx', function(d){return Math.random()*gameOptions.width})
    .attr('cy', function(d){return Math.random()*gameOptions.height});
};

Friend.prototype.move = function(figureClass) {
  d3.selectAll(figureClass)
    .transition()
    .duration(2000)
    .attr('cx', function(d){return Math.random()*gameOptions.width})
    .attr('cy', function(d){return Math.random()*gameOptions.height});
    //.attr('r', 20);
    // .transition()
    // .duration(500)
    // .attr('r', 5); 
};

var enemies = [];
var generateEnemies = function(){
  for(var i = 0; i < gameOptions.enemies; i++) {
    var enemy = new Enemy(gameOptions);
    enemy.render(gameBoard, [enemy]);
    enemies.push(enemy);
  }
};

var friends = [];
var generateFriends = function(){
  for(var i = 0; i < 5; i++) {
    var friend = new Friend(gameOptions);
    friend.render(gameBoard, [friend]);
    friends.push(friend);
  }
};

generateEnemies();
generateFriends();
setInterval(function(){Enemy.prototype.move('.enemy')}, 2000);
setInterval(function(){Enemy.prototype.move('.friend')}, 2000);

var collisionDetection = function(){
  var collision = false;
  var playerX = player.x;
  var playerY = player.y;
  for(var i = 0; i < enemies.length; i++) {

    var enemyX = parseFloat(enemies[i].el.attr('cx'));
    var enemyY = parseFloat(enemies[i].el.attr('cy'));
    if(Math.abs(player.x - enemyX) < 15 && Math.abs(player.y - enemyY) < 15){
      if(gameStats.score > gameStats.bestScore) {
        gameStats.bestScore = gameStats.score;
        d3.select('#HighScore').text(gameStats.bestScore);
      }
      gameStats.score = 0;
    }
  }
};



var increaseScore = function() {
  gameStats.score++;
  d3.select('#CurrentScore').text(gameStats.score);
};

setInterval(collisionDetection, 1);
setInterval(increaseScore, 100);

