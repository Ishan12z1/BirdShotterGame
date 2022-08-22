/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width =window.innerWidth
canvas.height = window.innerHeight
ctx.font='60px impact'

const collisionCanvas = document.getElementById('collisionCanvas')
const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width =window.innerWidth
collisionCanvas.height = window.innerHeight

let ravens = []
let score =0
let gameOver = false

let timeToNextRaven = 0 // add miliSecond values between frames
let ravenInterval = 500  // at what time the next raven should spawn
let lastTime =0 // hold value of timeStamp from previous loop

class Raven
{
    constructor()
    {
        this.spriteWidth=271,
        this.spriteHeight =194,
        this.sizeModifier=Math.random()*0.3+0.4
        this.width= this.spriteWidth * this.sizeModifier,
        this.height = this.spriteHeight * this.sizeModifier,
        this.x= canvas.width,
        this.y = Math.random()*(canvas.height-this.height),
        this.directionX = Math.random()* 5 + 3,
        this.directionY = Math.random()*5-2.5
        this.markForDeletion = false
        this.image = new Image()
        this.image.src = 'raven.png'
        this.frame=0,
        this.maxFrame =4,
        this.timeSinceFlap=0,
        this.flapInterval=Math.random()* 50 + 50
       // this.angle=0
        //this.angleSpeed=0.3
        this.randomColors=[Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)]
        this.color='rgb('+this.randomColors[0]+','+this.randomColors[1]+','+this.randomColors[2]+')'
    
    }
    draw()
    {
        collisionCtx.fillStyle=this.color
        collisionCtx.fillRect(this.x,this.y,this.width,this.height)
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight
            ,this.x,this.y,this.width,this.height)
        }
    update(deltatime)
    {   
     
        this.x-=this.directionX
        //this.angle+=this.angleSpeed
        //this.directionY = 5*Math.sin(this.angle)
      if(this.y+this.height >= canvas.height || this.y  < 0)
      {
        this.directionY*=-1
      }
        this.y+=this.directionY
        if(this.x < 0 - this.width) this.markForDeletion =true   
        this.timeSinceFlap+=deltatime
        if(this.timeSinceFlap >= this.flapInterval)
           { if(this.frame >=  this.maxFrame)
                this.frame=0
                else this.frame++
                this.timeSinceFlap=0
                for(let i=0;i<5;i++){
                particels.push(new Particels(this.x,this.y,this.width,this.color))
                }
            }
        if(this.x < 0 - this.width)
        {
            gameOver =true
        }
       
}
 
}
let particels = []
class Particels 
{
    constructor(x,y,size,color)
    {
        this.size = size,
        this.x=x+this.size*0.8+Math.random()*50-25,
        this.y=y+this.size/3+Math.random()*50-25,
        this.color = color ,
        this.radius = Math.random()*this.size/10,
        this.maxRadius = Math.random()*20+15,
        this.markForDeletion = false
        this.speedX = Math.random()*1+0.5

    }
update()
{
    this.x+=this.speedX
    this.radius+=0.5
    if(this.radius >this.maxRadius-2)
    {
        this.markForDeletion = true
    }
}
draw()
{
    ctx.save();
    ctx.globalAlpha =1-this.radius/this.maxRadius
    ctx.beginPath()
    ctx.fillStyle=this.color
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2)
    ctx.fill();
    ctx.restore()
}
}
let explosions=[]
class Explosion
{
    constructor(x,y,size)
    {
        this.x=x,
        this.y=y,
        this.spriteWidth=200,
        this.spriteHeight=179,
        this.size=size,
        this.image = new Image(),
        this.image.src = 'boom.png',
        this.sound = new Audio()
        this.sound.src = 'mutantdie.wav'
        this.frame=0,
        this.maxFrame=5,
        this.markForDeletion=false,
        this.nextFrameTime=150,
        this.frameTime=0
    }
    draw()
    {
        this.sound.play()
        ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,
            this.x,this.y-this.size/4,this.size,this.size)
      
    }
    update(deltatime)
    {
        if(this.frame >= this.maxFrame)
            this.markForDeletion = true
        else{
            this.frameTime+=deltatime
            if(this.frameTime >=this.nextFrameTime){
                this.frame++
                this.frameTime=0}}
   

    }
}

function drawScore()
{
    ctx.fillStyle='black'
    ctx.fillText('Score: '+score,50,75)
    ctx.fillStyle='white'
    ctx.fillText('Score: '+score,55,80)

}
window.addEventListener('click',function(e)
{
    let detectPixelColor = collisionCtx.getImageData(e.x,e.y,1,1)
    const pc = detectPixelColor.data
    ravens.forEach(object=>
        {
            if(object.randomColors[0] == pc[0] && 
                object.randomColors[1] == pc[1] && 
                object.randomColors[2] == pc[2])
                {   
                    explosions.push(new Explosion(object.x,object.y,object.width))
                    object.markForDeletion = true

                    score++;
                }
        })
})
const backGround = new Image()
backGround.src='final.png'

function drawGameOver()
{
    ctx.textAlign = 'center'
    ctx.fillStyle ='black'
    ctx.fillText('Game Over',canvas.width/2,canvas.height/2)
    ctx.fillStyle ='rgb(255, 111, 97)'
    ctx.fillText('Game Over',canvas.width/2-5,canvas.height/2-5)

}

function animate(timeStamp)
{
    ctx.clearRect(0,0,canvas.width,canvas.height)
    collisionCtx.clearRect(0,0,canvas.width,canvas.height)
   ctx.drawImage(backGround,0,0,canvas.width,canvas.height)
   let deltatime = timeStamp - lastTime//this a value between this loop and previous loop
    lastTime = timeStamp
    timeToNextRaven+=deltatime
    if(timeToNextRaven > ravenInterval)
    {
        ravens.push(new Raven())
        timeToNextRaven = 0
        ravens.sort(function(a,b)                // a array function which is used to perform sorting 
        {
            return a.width - b.width;          //here we sorting in ascending width size 
        })
    }
    drawScore();
    [...particels,...ravens,...explosions].forEach(object => object.update(deltatime));
    //[] is called an array literal and the 3 dots '...' are called spread operator, it is used if we want to call all the elements in an array to a function
    [...particels,...ravens,...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object=> !object.markForDeletion);
    explosions = explosions.filter(object=> !object.markForDeletion)
    particels = particels.filter(object=> !object.markForDeletion)





    
    //array method which return the current arraay except the elemnts which are false for the given condition 
//in the case above if markForDeleteion is false that means the condtion is true and the object will not be deleted else vice versa 

if(!gameOver)
{
    requestAnimationFrame(animate)

}
else
{
drawGameOver()
}
}
animate(0)
