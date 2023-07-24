const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d') ;
canvas.width =window.innerWidth;
canvas.height =window.innerHeight;
 
ctx.fillStyle ="black";
ctx.fillRect(0,0,canvas.width,canvas.height);
 
class Player{
    constructor({position,velocity} ){
        this.position = position //{x,y} 
        this.velocity = velocity
        this.rotation = 0 
    }

    draw(){
        ctx.save()
        ctx.translate(this.position.x,this.position.y)
        ctx.rotate(this.rotation);
        ctx.translate(-this.position.x,-this.position.y)
        // ctx.fillStyle='red';
        // ctx.fillRect(this.position.x,this.position.y,100,100);
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,5,0,Math.PI *2 , false)
         ctx.fillStyle = 'red';
         ctx.fill();
         ctx.closePath()
         ctx.beginPath();
        ctx.moveTo(this.position.x+30,this.position.y)
        ctx.lineTo(this.position.x-10,this.position.y-10)
        ctx.lineTo(this.position.x-10,this.position.y+10)
        ctx.closePath();
        ctx.strokeStyle ='white';
        ctx.stroke();

        ctx.restore();
    }
    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;  
    }
    getVertices() {
    const cos = Math.cos(this.rotation)
    const sin = Math.sin(this.rotation)

    return [
      {
        x: this.position.x + cos * 30 - sin * 0,
        y: this.position.y + sin * 30 + cos * 0,
      },
      {
        x: this.position.x + cos * -10 - sin * 10,
        y: this.position.y + sin * -10 + cos * 10,
      },
      {
        x: this.position.x + cos * -10 - sin * -10,
        y: this.position.y + sin * -10 + cos * -10,
      },
    ]
  }
}


class projectile{
    constructor ({position,velocity}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 5;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI *2 ,false)
        ctx.closePath();
        ctx.fillStyle='white';
        ctx.fill();

    }
    update(){
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y 
    }
}

class asteroid{
    constructor ({position,velocity,radius}){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI *2 ,false)
        ctx.closePath();
        ctx.strokeStyle='white';
        ctx.stroke();

    }
    update(){
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y 
    }
}


const player = new Player({position:{x:canvas.width /2,y:canvas.height /2},
    velocity:{x:0,y:0}});

player.draw();
const keys ={
    w:{
        pressed : false,
    },
    a:{
        pressed : false,
    },
    d:{
        pressed : false,
    }
    
}

const SPEED =4
const RSPEED =0.05
const FRICTION=0.97
 
const projectiles =[]
const asteroids =[]

 const intervalid =   window.setInterval(()=> {
const index =  Math.floor(Math.random()*4)
let x,y
let vx,vy
let radius =50*Math.random() +10;
switch (index){
    case 0: //left
     x= 0 - radius 
     y= Math.random()* canvas.height
     vx =1
     vy=0
     break

     case 1: //bottom
     x= Math.random()* canvas.width
     y= canvas.height + radius
     vx =0
     vy=-1
     break

     case 2: //right
     x= canvas.width + radius 
     y= Math.random()* canvas.height
     vx =-1
     vy=0
     break

     case 3: //top
     x= Math.random()* canvas.width
     y= 0 - radius
     vx =0
     vy=1
     break
}
asteroids.push(new asteroid({
    position:{
        x:x,
        y:y,
    },
velocity:{
    x:vx,
    y:vy,
},
radius,
    })
)
},3000)

function collision(circle1,circle2){
    const xdiff = circle2.position.x - circle1.position.x
    const ydiff =circle2.position.y - circle1.position.y

    const distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff)
     if( distance<=circle1.radius + circle2.radius)
     {
        return true;
     }
     return false ; 
}
function circleTriangleCollision(circle, triangle) {
  // Check if the circle is colliding with any of the triangle's edges
  for (let i = 0; i < 3; i++) {
    let start = triangle[i]
    let end = triangle[(i + 1) % 3]

    let dx = end.x - start.x
    let dy = end.y - start.y
    let length = Math.sqrt(dx * dx + dy * dy)

    let dot =
      ((circle.position.x - start.x) * dx +
        (circle.position.y - start.y) * dy) /
      Math.pow(length, 2)

    let closestX = start.x + dot * dx
    let closestY = start.y + dot * dy
    if (!isPointOnLineSegment(closestX, closestY, start, end)) {
      closestX = closestX < start.x ? start.x : end.x
      closestY = closestY < start.y ? start.y : end.y
    }

    dx = closestX - circle.position.x
    dy = closestY - circle.position.y

    let distance = Math.sqrt(dx * dx + dy * dy)

    if (distance <= circle.radius) {
      return true
    }
  }

  // No collision
  return false
}

function isPointOnLineSegment(x, y, start, end) {
  return (
    x >= Math.min(start.x, end.x) &&
    x <= Math.max(start.x, end.x) &&
    y >= Math.min(start.y, end.y) &&
    y <= Math.max(start.y, end.y)
  )


  }





function animate(){
   const animationid   =  window.requestAnimationFrame(animate); 
//    console.log("works");
ctx.fillStyle ="black";
ctx.fillRect(0,0,canvas.width,canvas.height);
player.update();
    
for(let i=projectiles.length -1 ;i>=0;i--){
    const projectile = projectiles[i]
    projectile.update()
//garbage collection
    if(projectile.position.x + projectile.radius <0||
        projectile.position.x- projectile.radius>canvas.width||
        projectile.position.y - projectile.radius>canvas.height||
        projectile.position.y + projectile.radius <0
        ){
        projectiles.splice(i,1);
    }
}
 //asteroid management
 for(let i=asteroids.length-1 ;i>=0;i--){
    const asteroid =asteroids[i]
    asteroid.update()

if(circleTriangleCollision(asteroid,player.getVertices())){
console.log('GAME OVER')
window.cancelAnimationFrame(animationid)
clearInterval(intervalid)
}



    if(asteroid.position.x + asteroid.radius <0||
        asteroid.position.x- asteroid.radius>canvas.width||
        asteroid.position.y - asteroid.radius>canvas.height||
        asteroid.position.y + asteroid.radius <0
        ){
        asteroids.splice(i,1);
    }
    //projectile
for(let j=projectiles.length -1 ;j>=0;j--){
  const projectile = projectiles[j]
  if(collision(asteroid,projectile)){
    // console.log("collision successful")
     projectiles.splice(j,1);
     asteroids.splice(i,1);
  }
}


//garbage management
 

}
 
    if(keys.w.pressed)
  { player.velocity.x = Math.cos(player.rotation)*SPEED
   player.velocity.y = Math.sin(player.rotation)*SPEED}
   else if(!keys.w.pressed){
    player.velocity.x *=FRICTION
   player.velocity.y *=FRICTION
   }
   if (keys.d.pressed)
   player.rotation +=0.05 //radians
   else if(keys.a.pressed)
   player.rotation -= 0.05
}
animate();

window.addEventListener('keydown',(event) =>{
    switch(event.code){
        case 'KeyW':
          keys.w.pressed = true;  
            break
            case 'KeyA':
                  keys.a.pressed = true    
                      break 
            case 'KeyD':
               keys.d.pressed =true    
                  break 
             case 'Space' :
                projectiles.push(
                    new projectile({
                    position :{
                        x : player.position.x + Math.cos(player.rotation)*30,
                        y : player.position.y +Math.sin(player.rotation)*30,
                    },
                    velocity:{
                        x:Math.cos(player.rotation)*3,
                        y:Math.sin(player.rotation)*3,
                    }
                }))

    }
})
window.addEventListener('keyup',(event) =>{
    switch(event.code){
        case 'KeyW':
          keys.w.pressed = false;  
            break
            case 'KeyA':
                  keys.a.pressed = false   
                      break 
            case 'KeyD':
               keys.d.pressed =false    
                  break 
                //    case 'space' : 
                   
                //    break;
    }
})













