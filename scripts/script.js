window.addEventListener('load',function(){
    // canvas setup
    const canvas =document.getElementById('canvas1');
    const ctx=canvas.getContext('2d');
    canvas.width= 1500;
    canvas.height=500;



    //class handling (object oriented programming)

    class InputHandler
    {
        //handle inputs
        constructor(game)
        {
            this.game=game;
            window.addEventListener('keydown',e =>{
                if(((e.key==='ArrowUp')||
                    (e.key==='ArrowDown'))
                 && (this.game.keys.indexOf(e.key)===-1))
                {
                    this.game.keys.push(e.key);
                }
                else if(e.key === ' ')
                {
                    this.game.player.shootTop();
                }
                else if(e.key === 'd')
                {
                    this.game.debug=!this.game.debug;
                }
                //console.log(this.game.keys);

            });
            window.addEventListener('keyup',e =>{
                if(this.game.keys.indexOf(e.key)>-1)
                {
                    this.game.keys.splice(this.game.keys.indexOf(e.key),1);
                }
                //console.log(this.game.keys);
            });
        }
    }
    class Projectile
    {
        //handle projectiles.
        constructor(game,x,y)
        {
            this.game=game;
            this.x=x;
            this.y=y;
            this.width=10;
            this.height=3;
            this.speed=3;  
            this.markForDeletion=false;
            this.image=document.getElementById('projectile');
            this.audio=new Audio();
            this.audio.src='audio/laser.wav';
            this.audioPlayed=false;
        }
        update()
        {
            this.x +=this.speed;
            if(this.x > this.game.width*0.88)this.markForDeletion=true;

        }
        playAudio()
        {
            if(!this.audioPlayed)this.audio.play();
            this.audioPlayed=true;
        }
        draw(context)
        {
            //context.fillStyle='yellow';
            context.drawImage(this.image,this.x,this.y);
            this.playAudio();
           //context.fillRect(this.x,this.y,this.width,this.height);
        }

    }
    class Particle
    {
        constructor(game,x,y)
        {
            this.game=game;
            this.x=x;
            this.y=y;
            this.image=document.getElementById('gears');
            this.frameX=Math.floor(Math.random()*3);
            this.frameY=Math.floor(Math.random()*3);
            this.spriteSize=50;
            this.sizeModifier=(Math.random()*0.5+0.5);
            this.size=this.spriteSize*this.sizeModifier;
            this.speedX=Math.random()*6-3;
            this.speedY=Math.random()*-15;
            this.gravity=0.5;
            this.markForDeletion=false;
            this.angle=0;
            this.va=Math.random()*0.2-0.1;
            this.bounced=0;
            this.bottomBouncedBoundary=Math.random()*100+60;
            this.audio=new Audio();
            this.audio.src='audio/gears.wav';
            this.audioPlayed=false;
            

        }
        update()
        {
            this.angle+=this.va;
            this.speedY+=this.gravity;
            this.x-=this.speedX+this.game.speed;
            this.y+=this.speedY;
            if(this.y>this.game.height+this.size||this.x<0-this.size)this.markForDeletion=true;
            console.log(this.speeds);
            if(this.y > this.game.height - this.bottomBouncedBoundary && this.bounced<Math.floor(Math.random()*5))
            {
                this.bounced++;
                this.speedY *= -0.75;
            }
        }  
        playAudio()
        {
            this.audio.volume=0.07;
            if(!this.audioPlayed)this.audio.play();
            this.audioPlayed=true;
        }
        draw(context)
        {
            context.save();
            context.translate(this.x,this.y);//remove if you dont want rotation of particles.
            context.rotate(this.angle);
            this.playAudio();
            //context.drawImage(this.image,this.frameX*this.spriteSize,this.frameY*this.spriteSize,this.spriteSize,this.spriteSize,this.x,this.y,this.size,this.size);
            context.drawImage(this.image,this.frameX*this.spriteSize,this.frameY*this.spriteSize,this.spriteSize,this.spriteSize,this.size*-0.5,this.size*-0.5,this.size*1.2,this.size*1.2);
            context.restore();
            
        }
    }
    class explosion
    {
        constructor(game,x,y)
        {
            this.game=game;
            this.frameX=0;
            this.frameY=0;
            this.spriteHeight=200;
            this.fps=25;
            this.timer=0;
            this.interval=1000/this.fps;
            this.maxFrame=8;
        }
        update(deltaTime)
        {
            this.x-=this.game.speed;
            if(this.timer>this.interval){
            this.frameX++;
            this.timer=0;
            }else
            {
                this.timer+=deltaTime;
            }
            if(this.frameX>this.maxFrame)this.markForDeletion=true;
        }
        draw(context)
        {
            context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.width,this.height,this.x,this.y,this.width,this.height);
        }
    }
    class fire extends explosion
    {
        constructor(game,x,y)
        {
            super(game,x,y);
            this.image=document.getElementById('fireExplosion');
            this.spriteWidth=200;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.x=x-this.width*0.5;
            this.y=y-this.height*0.5;
        }
    }
    class smoke extends explosion
    {
        constructor(game,x,y)
        {
            super(game,x,y);   
            this.image=document.getElementById('smokeExplosion');
            this.spriteWidth=200;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.x=x-this.width*0.5;
            this.y=y-this.height*0.5;
        }
        
    }
    class Player
    {
        //handle player
        constructor(game){
            this.game=game;
            this.width=120;
            this.height=190;
            this.x=20;
            this.y=100;
            this.frameX=0;
            this.frameY=0;
            this.speedY=0;
            this.maxFrame=37;
            this.maxSpeed=1.5;
            this.projectiles=[];
            this.powerUp=false;
            this.powerUpTimer=0;
            this.powerUpLimit=10000;
            this.image=document.getElementById('player');
        }
        update(deltaTime)
        {
            if(this.game.keys.includes('ArrowUp'))this.speedY=-this.maxSpeed;
            else if(this.game.keys.includes('ArrowDown'))this.speedY=this.maxSpeed;
            else this.speedY=0;
            this.y += this.speedY;


            // handling boundaries
            if(this.y>this.game.height-this.height*0.5)this.y=this.game.height-this.height*0.5;
            else if(this.y<-this.height*0.5)this.y=-this.height*0.5;
            //handling projectiles
            this.projectiles.forEach(projectile =>{
                projectile.update(); 
            });
            this.projectiles=this.projectiles.filter(projectile => !projectile.markForDeletion);
            if(this.frameX<this.maxFrame){
                this.frameX++;
            }else{
                this.frameX=0;
            }
            // powerup
            if(this.powerUp){
                if(this.powerUpTimer > this.powerUpLimit)
                {
                    this.powerUpTimer=0;
                    this.powerUp=false;
                    this.frameY=0;
                    this.maxSpeed=1.5;
                    this.game.ammo=this.game.maxAmmo;
                }
                else
                {
                    this.powerUpTimer += deltaTime;
                    this.frameY=1;
                    this.maxSpeed=3;
                    this.game.ammo+=0.1;
                }
            }
        }
        draw(context)
        {
            if (this.game.debug) context.strokeRect(this.x,this.y,this.width,this.height);
            this.projectiles.forEach(projectile =>{
                projectile.draw(context); 
            });
            context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
            
        } 
        shootTop()
        {
           if(this.game.ammo>0) {
           this.projectiles.push(new Projectile(this.game,this.x+80,this.y+30)) ;
           this.game.ammo--;
           //console.log(this.projectiles);
           }
           if(this.powerUp)this.shootBottom();
        }
        shootBottom()
        {
           if(this.game.ammo>0) {
           this.projectiles.push(new Projectile(this.game,this.x+80,this.y+175)) ;
           this.game.ammo--;
           //console.log(this.projectiles);
           }
        }
        enterPowerup()
        {
           this.powerUpTimer=0;
           this.powerUp=true;
           if(this.game.ammo<this.game.maxAmmo)this.game.ammo=this.game.maxAmmo;
        }
    }
    class enemy
    {
        //handle enemies
         constructor(game)
         {
            this.game=game;
            this.x=this.game.width;
            //lives scores width height y position is given in sub or child classes
            this.speedX=Math.random()*-1.2;
            this.frameX=0;
            this.frameY=0;
            this.maxframe=37;
            this.audio=new Audio();
            this.audioPlayed=false;
         }
         update()
         {
            this.x+=this.speedX-this.game.speed;
            if(this.x+this.width<0)this.markForDeletion=true;
            if(this.frameX<this.maxframe)
            {
                this.frameX++;
            }else{
                this.frameX=0;
            }
         }
         playAudio()
        {
            if(!this.audioPlayed)this.audio.play();
            this.audioPlayed=true;
        }
         draw(context)
         {
           if(this.game.debug)context.strokeRect(this.x,this.y,this.width,this.height);
           this.playAudio();
            context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
            context.font='30px arial';
            if(this.game.debug)context.fillText(this.lives,this.x,this.y);
         }
    }
    // making child classes using enemy class
    class Angler1 extends enemy{
        constructor(game)
        {
            super(game);
            this.lives=3;
            this.score=5;
            this.width=228;
            this.height=169;
            this.y=Math.random()*(this.game.height*0.95-this.height);
            this.image=document.getElementById('angler1');
            this.frameY=Math.floor(Math.random()*3);
            //this.type='angler1';
        }
    }
    class Angler2 extends enemy{
        constructor(game)
        {
            super(game);
            this.lives=5;
            this.score=10;
            this.width=213;
            this.height=165;
            this.y=Math.random()*(this.game.height*0.95-this.height);
            this.image=document.getElementById('angler2');
            this.frameY=Math.floor(Math.random()*2);
            //this.type='angler2';
        }
    }
    class luckyfish extends enemy{
        constructor(game)
        {
            super(game);
            this.lives=8;
            this.score=20;
            this.width=99;
            this.height=95;
            this.type='lucky';
            this.y=Math.random()*(this.game.height*0.95-this.height);
            this.image=document.getElementById('lucky');
            this.frameY=Math.floor(Math.random()*2);

        }
    }
    class hivewhale extends enemy{
        constructor(game)
        {
            super(game);
            this.lives=15;
            this.score=30;
            this.width=400;
            this.height=227;
            this.type='hivewhale';
            this.y=Math.random()*(this.game.height*0.9-this.height);
            this.image=document.getElementById('hivewhale');
            this.frameY=0;
            this.speedX=Math.random()*-0.6-0.2;
            this.audio.src='audio/hivewhale.wav';

        }
    }
    class drone extends enemy{
        constructor(game,x,y)
        {
            super(game);
            this.lives=3;
            this.score=5;
            this.width=115;
            this.height=95;
            this.type='drone';
            this.x=x;
            this.y=y;
            this.image=document.getElementById('drone');
            this.frameY=Math.floor(Math.random()*2);
            this.speedX=Math.random()*-3-0.5;
            this.audio.src='audio/drones.wav';

        }
    }






    class Layer
    {
        //handle paralax effects
        constructor(game,image,speedModifier)
        {
            this.game=game;
            this.image=image;
            this.speedModifier=speedModifier;
            this.width=1768;
            this.height=500;
            this.x=0;
            this.y=0;
        }
        update()
        {
            if(this.x<=-this.width)this.x=0;
            this.x-=this.game.speed*this.speedModifier;
        }
        draw(context)
        {
            context.drawImage(this.image,this.x,this.y);
            context.drawImage(this.image,this.x+this.width,this.y);
        }
    }



    class Background
    {
        //handle background
        constructor(game){
            this.game=game;
            this.image1=document.getElementById('layer1');
            this.image2=document.getElementById('layer2');
            this.image3=document.getElementById('layer3');
            this.image4=document.getElementById('layer4');

            this.layer1=new Layer(this.game,this.image1,0.2);
            this.layer2=new Layer(this.game,this.image2,0.4);
            this.layer3=new Layer(this.game,this.image3,1);
            this.layer4=new Layer(this.game,this.image4,1.5);
            this.layers=[this.layer1,this.layer2,this.layer3];
        }
        update(){
            this.layers.forEach(layer=>layer.update());
        }
        draw(context){
            this.layers.forEach(layer=>layer.draw(context));
        }
    }
    class UI 
    {
        //handle user interface
        constructor(game)
        {   
            this.game=game;
            this.fontSize=35;
            this.fontFamily='Bangers';
            this.color='white';
        }
        draw(context)
        {
            context.save();
            context.fillStyle=this.color;
            context.font=this.fontSize+'px '+this.fontFamily;
            context.shadowOffsetX=2;
            context.shadowOffsetY=2;
            context.shadowColor='black';
            //score
            context.fillText('Score : '+this.game.score,20,40); 
            
            //timer
            const formattedTime=(this.game.gameTime*0.001).toFixed(1);
            context.fillText('Timer : '+formattedTime+'s',20,100);

            //gameover messages
            if(this.game.gameOver)
            {
                context.textAlign='center';
                let message1,message2;
                if(this.game.score>=this.game.winningScore)
                {
                    message1='Superior Tactics Win';
                    message2='Celebrate peasant!';
                }
                else
                {
                    message1='Resistance is Futile.';
                    message2=' Surrender';
                }
                context.font='70px '+this.fontFamily;
                context.fillText(message1,this.game.width*0.5,this.game.height*0.5-20);
                context.font='35px '+this.fontFamily;
                context.fillText(message2,this.game.width*0.5,this.game.height* 0.5 + 20);

            }
            //ammo
            if(this.game.player.powerUp)context.fillStyle='#ffff4d';
            for (let i=0;i<this.game.ammo;i++)
            {
                context.fillRect(20+5*i,50,3,20);
            }  
            context.restore(); 
        }
          
    }
    class Game
    {
        //brain of game
        constructor(width,height)
        {
        this.height=height;
        this.width=width;
        //new objects
        this.player=new Player(this); 
        this.input=new InputHandler(this);
        this.ui=new UI(this);
        this.background=new Background(this);

        //arrays
        this.keys=[];
        this.enemies=[];
        this.particles=[];
        this.explosions=[];
        

        //variacles & constants
        this.score=0;
        this.winningScore=100;
        this.ammo=20;
        this.maxAmmo=50;
        this.ammoTimer=0;
        this.ammoInterval=300;
        this.enemyTimer=0;
        this.enemyInterval=1000;
        this.gameOver=false;
        this.gameTime=0;
        this.timeLimit=30000;
        this.speed=1;
        this.debug=false;

        }
        update(deltaTime)
        {
            if(!this.gameOver)this.gameTime +=deltaTime;
            if(this.gameTime>=this.timeLimit)this.gameOver=true;
            this.background.update();
            this.background.layer4.update();
            this.player.update(deltaTime); 
            if(this.ammoTimer > this.ammoInterval)
            {
                if(this.ammo<this.maxAmmo)this.ammo++;
                this.ammoTimer=0;
            }
            else
            {
                this.ammoTimer+=deltaTime;
            }
            // for particles
            this.particles.forEach(particle=>
                particle.update() );
            this.particles=this.particles.filter(particle=>!particle.markForDeletion);

            // for explosions
            this.explosions.forEach(explosion=>explosion.update(deltaTime));
            this.explosions=this.explosions.filter(explosion=>!explosion.markForDeletion);
            
            // for enemies
            this.enemies.forEach(enemy=>
                {
                    enemy.update();
                    if(this.checkCollision(this.player,enemy)){
                        enemy.markForDeletion=true;
                        for(let i=0;i<enemy.score*0.2;i++)
                        {
                            this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
                        }
                        // adding explsions
                        this.addExplosions(enemy);

                        // collision with luckyfish detection
                        if((enemy.type ==='lucky')) this.player.enterPowerup();
                        else if (!this.gameOver)this.score-=10;
                        
                    }
                    this.player.projectiles.forEach(projectile=>{
                        if(this.checkCollision(projectile,enemy))
                        {
                            enemy.lives--;
                            projectile.markForDeletion=true;
                            this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
                           
                            if(enemy.lives<=0)
                            {
                                enemy.markForDeletion=true;
                                if(enemy.type==='hivewhale')
                            {
                                for (let i=0;i<5;i++)
                                {
                                    this.enemies.push(new drone(this,enemy.x+Math.random()*enemy.width,enemy.y+Math.random()*enemy.height*0.5));
                                }
                            }
                                for(let i=0;i<3;i++)
                                {
                                    this.particles.push(new Particle(this,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
                                }
                                this.addExplosions(enemy);
                                if(!this.gameOver)this.score += enemy.score;
                                if(this.score>=this.winningScore)this.gameOver=true;
                            }
                        }
                    });
                });
            this.enemies=this.enemies.filter(enemy => !enemy.markForDeletion);
            //adding new enemies after delta timer filled .
            if(this.enemyTimer>this.enemyInterval && !this.gameOver)
            {
                this.addEnemy();
                this.enemyTimer=0;
            }else
            { 
                this.enemyTimer+=deltaTime;
            }
        }

        draw(context)
        {
            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);
            this.particles.forEach(particle=>particle.draw(context));
            this.enemies.forEach(enemy=>enemy.draw(context));
            this.explosions.forEach(explosion=>explosion.draw(context));
            this.background.layer4.draw(context);
        }

        //for adding enemies
        addEnemy()
        {
            const randomize=Math.random();
            if(randomize<0.35)this.enemies.push(new Angler1(this));
            else if(randomize<0.7)this.enemies.push(new Angler2(this));
            else if(randomize<0.79)this.enemies.push(new hivewhale(this));
            else this.enemies.push(new luckyfish(this));
            
            //console.log(this.enemies);
        }
        // for adding explosions
        addExplosions(enemy)
        {
            const randomize=Math.random();
            if(randomize<0.5)this.explosions.push(new smoke(this,enemy.x,enemy.y));
            else this.explosions.push(new fire(this,enemy.x+enemy.width*0.5,enemy.y+enemy.width*0.5));
        }
        checkCollision(rect1,rect2)
        {
            return(
                rect1.x<rect2.x+rect2.width &&
                rect1.x+rect1.width>rect2.x &&
                rect1.y<rect2.y+rect2.height &&
                rect1.height+rect1.y >rect2.y
            )
        }
    }
    // make a new game
    const game= new Game(canvas.width,canvas.height);
    let lastTime=0;

    // animation loop
    function animate(timeStamp)
    {
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp; 
        //console.log(deltaTime)
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0);
});

