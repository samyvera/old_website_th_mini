class Player {
    constructor() {
        this.name = "player";
        this.direction = { x:0, y:0 };
        this.speed = 1;
        this.pos = { x:32, y:96 };
        this.size = { x:2, y:2 };
        this.shootCooldown = 0;
        this.isInvincible = false;

        this.act = (keys, game) => {
            
            var bullets = game.bulletsAt(this);
            if (bullets.length > 0) bullets.forEach(bullet => {
                if (bullet.target === 'player') {
                    if (!this.isInvincible) {
                        document.getElementById('canvas').style.display = 'none';
                        document.getElementById('share').style.display = 'flex';
                        document.getElementById('tweet').href = "https://twitter.com/intent/tweet?text=@5amyVera's%20game%20is%20pretty%20fun%20!%20I%20only%20made%20" + game.boss.score + "%20points%20though...";
                        var numbers = game.boss.score.toString();
                        for (let i = 0; i < numbers.length; i++) {
                            var num = document.createElement('div');
                            num.className = "number";
                            num.style.backgroundImage = "url(img/numbers/" + numbers[i] + ".png)";
                            document.getElementById('score').appendChild(num);
                        }
                        game.state = 'retry';
                    }
                }
            });

            this.move(keys, game);
            this.shoot(keys, game);
            if (this.shootCooldown > 0) this.shootCooldown--;
        }

        this.move = (keys, game) => {
            if (keys.get('left') && !keys.get('right') && this.pos.x - this.size.x / 2 > 0) this.direction.x = -1;
            else if (keys.get('right') && !keys.get('left') && this.pos.x + this.size.x / 2 < game.size.x) this.direction.x = 1;
            else this.direction.x = 0;
            this.pos.x += this.speed * this.direction.x;
            if (keys.get('up') && !keys.get('down') && this.pos.y - this.size.y / 2 > 0) this.direction.y = -1;
            else if (keys.get('down') && !keys.get('up') && this.pos.y + this.size.y / 2 < game.size.y) this.direction.y = 1;
            else this.direction.y = 0;
            this.pos.y += this.speed * this.direction.y;
        }

        this.shoot = (keys, game) => {
            if (keys.get('shoot') && this.shootCooldown === 0) {
                game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y - this.size.y }, { x:0, y:-2 }, 'enemy', null));
                this.shootCooldown += 8;
            }
        }
    }
}

class Boss {
    constructor() {
        this.name = "boss";
        this.direction = { x:0, y:0 };
        this.speed = { x:0.5, y:0.25 };
        this.pos = { x:-16, y:0 };
        this.size = { x:8, y:8 };

        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.phase = 3;
        this.isInvincible = true;
        this.showFace = false;

        this.attack1 = false;
        this.attack2 = false;
        this.attack3 = false;
        this.attack4 = false;

        this.limits = [425, 286, 192, 96];

        this.score = 0;

        this.act = game => {
            this.pos.x += this.direction.x * this.speed.x;
            this.pos.y += this.direction.y * this.speed.y;

            var bullets = game.bulletsAt(this);
            if (bullets.length > 0) bullets.forEach(bullet => {
                if (bullet.target === 'enemy') {
                    if (this.health > 0 && !this.isInvincible) {
                        this.health--;
                        this.score++;
                        if (this.phase % 2 === 0) this.health += 0.75;
                    }
                    bullet.hitTarget = true;
                }
            });

            if (this.health === this.maxHealth / 5 && game.levelFrame < (96 * 16) && this.phase === 3) {
                this.score += 96 * 16 - game.levelFrame;
                game.levelFrame = 96 * 16;
            }
            
            if (this.health === 0 && game.levelFrame < (192 * 16) && this.phase === 2) {
                this.score += 192 * 16 - game.levelFrame;
                game.levelFrame = 192 * 16;
            }

            if (this.health === this.maxHealth / 5 && game.levelFrame < (286 * 16) && this.phase === 1) {
                this.score += 286 * 16 - game.levelFrame;
                game.levelFrame = 286 * 16;
            }

            if (this.health === 0 && game.levelFrame < (425 * 16) && this.phase === 0) {
                this.score += 425 * 16 - game.levelFrame;
                game.levelFrame = 425 * 16;
            }

            if (this.attack1) {
                var number = 16;
                if (game.frame % 32 === 0) {
                    for (let i = 0; i < number; i++) {
                        game.bullets.push(new Bullet(
                            { x:this.pos.x, y:this.pos.y },
                            { x:Math.cos(Math.PI * 2 - i * Math.PI * 2 / number), y:Math.sin(Math.PI * 2 - i * Math.PI * 2 / number) }, 'player', null));
                    }
                }
                else if ((game.frame + 16) % 32 === 0) {
                    for (let i = 0.5; i < number + 0.5; i++) {
                        game.bullets.push(new Bullet(
                            { x:this.pos.x, y:this.pos.y },
                            { x:Math.cos(Math.PI * 2 - i * Math.PI * 2 / number), y:Math.sin(Math.PI * 2 - i * Math.PI * 2 / number) }, 'player', null));
                    }
                }
            }

            if (this.attack2) {
                var x = Math.cos(game.frame);
                var y = Math.sin(game.frame);
                game.bullets.push(new Bullet({ x:this.pos.x + this.size.x * x, y:this.pos.y + this.size.y * y }, { x:x, y:y }, 'player', null));
                if (game.frame % 64 === 0) for (let i = 8; i <= game.size.x; i += 16) game.bullets.push(new Bullet({ x:i, y:0 }, { x:0, y:1 }, 'player', 'star'));
                if ((game.frame + 32) % 64 === 0) for (let i = 0; i <= game.size.x; i += 16) game.bullets.push(new Bullet({ x:i, y:0 }, { x:0, y:1 }, 'player', 'star'));
            }

            if (this.attack3) {
                var x = Math.sin(game.frame) / 2;
                var y = Math.cos(game.frame) / 2;
                if (game.frame % 2 === 0) game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y }, { x:x, y:y }, 'player', null));
                else game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y }, { x:-x, y:-y }, 'player', null));
                if (game.frame % 2 === 0) game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y }, { x:y, y:x }, 'player', null));
                else game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y }, { x:-y, y:-x }, 'player', null));
            }

            if (this.attack4) {
                var x = Math.exp(Math.sin(game.frame)) / 2;
                var y = Math.exp(Math.cos(game.frame)) / 2;
                if (game.frame % 8 !== 0 && y > 1) game.bullets.push(new Bullet({ x:this.pos.x, y:this.pos.y }, { x:x-0.5, y:y / 4 }, 'player', 'star'));
                if (game.frame % 32 === 0 && game.frame % 64 !== 0) for (let i = 16; i <= game.size.x; i += 32) game.bullets.push(new Bullet({ x:i, y:0 }, { x:0, y:0.25 }, 'player', null));
                if (game.frame % 32 === 0 && game.frame % 64 !== 0) for (let i = 16; i <= game.size.y; i += 64) game.bullets.push(new Bullet({ x:0, y:i }, { x:0.25, y:0 }, 'player', null));
                if (game.frame % 32 === 0 && game.frame % 64 !== 0) for (let i = 48; i <= game.size.y; i += 64) game.bullets.push(new Bullet({ x:game.size.x - 2, y:i }, { x:-0.25, y:0 }, 'player', null));
            }
        }
    }
}

class Bullet {
    constructor(pos, direction, target, type) {
        this.target = target;
        this.hitTarget = false;
        this.pos = pos;
        this.size = { x:2, y:2 }
        this.direction = direction;
        this.type = type;

        this.lastKeys;

        this.act = () => {
            this.pos.x += this.direction.x;
            this.pos.y += this.direction.y;
        }
    }
}

class Game {
    constructor() {
        this.state = 'title';
        this.frame = 0;
        this.levelFrame = 0;
        this.flash = false;

        this.size = { x:64, y:128 };
        this.player;
        this.boss;
        this.bullets = [];

        this.update = keys => {
            if (this.state === 'title') {
                if (keys.get('shoot')) this.state = 'game';
            }
            else if (this.state === 'game') {
                if (this.player) this.player.act(keys, this);
                if (this.boss) this.boss.act(this);
                this.bullets.forEach((bullet, key) => this.inBounds(bullet.pos, bullet.size) || bullet.hitTarget ? this.bullets.splice(key, 1) : bullet.act());

                this.updateLevel();
                this.frame++;
                this.levelFrame++;
            }
            else if (this.state === 'retry') {
                this.frame = 0;
                this.levelFrame = 0;
                this.player = null;
                this.boss = null;
                this.bullets = [];
                if (keys.get('shoot') && !this.lastKeys.get('shoot')) this.state = 'game';
            }

            this.lastKeys = new Map(keys);
        }

        this.updateLevel = () => {
            switch (this.levelFrame) {
                case 0:
                    document.getElementById('score').innerHTML = "";
                    this.player = new Player();
                    break;
                case 8 * 16:
                    this.boss = new Boss();
                    this.boss.direction.x = 1;
                    this.boss.direction.y = 1;
                    this.boss.showFace = true;
                    break;
                case 14 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 19 * 16:
                    this.boss.showFace = false;
                    break;
                case 20 * 16:
                    this.boss.isInvincible = false;
                    break;
                case 22 * 16:
                        this.boss.direction.x = -1;
                        this.boss.direction.y = -1;
                    break;
                case 24 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    this.boss.attack1 = true;
                    break;
                case 42 * 16:
                    this.boss.direction.x = 1;
                    break;
                case 46 * 16:
                    this.boss.direction.x = 0;
                    break;
                case 64 * 16:
                    this.boss.direction.x = -1;
                    this.boss.direction.y = 1;
                    break;
                case 66 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 96 * 16:
                    this.boss.phase--;
                    this.boss.health = this.boss.maxHealth / 5;
                    this.boss.attack1 = false;
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    this.boss.isInvincible = true;
                    this.boss.pos.x = 32;
                    this.boss.pos.y = 16;
                    this.bullets = [];
                    this.flash = true;
                    break;
                case 97 * 16:
                    this.flash = false;
                    break;
                case 101 * 16:
                    this.boss.showFace = true;
                    break;
                case 109 * 16:
                    this.boss.showFace = false;
                    this.boss.attack2 = true;
                    this.boss.isInvincible = false;
                    break;
                case 192 * 16:
                    this.boss.phase--;
                    this.boss.health = this.boss.maxHealth;
                    this.boss.attack2 = false;
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    this.boss.isInvincible = true;
                    this.boss.pos.x = 32;
                    this.boss.pos.y = 24;
                    this.bullets = [];
                    this.flash = true;
                    break;
                case 193 * 16:
                    this.flash = false;
                    break;
                case 205 * 16:
                    this.boss.attack3 = true;
                    this.boss.isInvincible = false;
                    break;
                case 207 * 16:
                        this.boss.direction.x = -1;
                        this.boss.direction.y = -1;
                    break;
                case 209 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 232 * 16:
                    this.boss.direction.x = 1;
                    break;
                case 236 * 16:
                    this.boss.direction.x = 0;
                    break;
                case 254 * 16:
                    this.boss.direction.x = -1;
                    this.boss.direction.y = 1;
                    break;
                case 256 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 286 * 16:
                    this.boss.phase--;
                    this.boss.health = this.boss.maxHealth / 5;
                    this.boss.attack3 = false;
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    this.boss.isInvincible = true;
                    this.boss.pos.x = 32;
                    this.boss.pos.y = 16;
                    this.bullets = [];
                    this.flash = true;
                    break;
                case 287 * 16:
                    this.flash = false;
                    this.boss.showFace = true;
                    break;
                case 298 * 16:
                    this.boss.showFace = false;
                    break;
                case 299 * 16:
                    this.boss.attack4 = true;
                    this.boss.isInvincible = false;
                    break;
                case 301 * 16:
                        this.boss.direction.x = 1;
                        this.boss.direction.y = 1;
                    break;
                case 303 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 321 * 16:
                    this.boss.direction.x = -1;
                    break;
                case 325 * 16:
                    this.boss.direction.x = 0;
                    break;
                case 343 * 16:
                    this.boss.direction.x = 1;
                    this.boss.direction.y = -1;
                    break;
                case 345 * 16:
                    this.boss.direction.x = 0;
                    this.boss.direction.y = 0;
                    break;
                case 425 * 16:
                    this.boss.attack4 = false;
                    this.boss.isInvincible = true;
                    this.player.isInvincible = true;
                    this.bullets = [];
                    this.flash = true;
                    break;
                case 426 * 16:
                    this.flash = false;
                    break;
                case 428 * 16:
                    this.flash = false;
                    break;
                case 430 * 16:
                    this.flash = false;
                    document.getElementById('canvas').style.display = 'none';
                    document.getElementById('share').style.display = 'flex';
                    document.getElementById('tweet').href = "https://twitter.com/intent/tweet?text=@5amyVera's%20game%20is%20pretty%20fun%20!%20I%20won%20with%20" + this.boss.score + "%20points%20!";
                    var numbers = this.boss.score.toString();
                    for (let i = 0; i < numbers.length; i++) {
                        var num = document.createElement('div');
                        num.className = "number";
                        num.style.backgroundImage = "url(img/numbers/" + numbers[i] + ".png)";
                        document.getElementById('score').appendChild(num);
                    }
                    this.boss = null;
                    this.state = 'retry';
                    break;
                default:
                    break;
            }
        }

        this.inBounds = (pos, size) => pos.x < 0 || pos.x + size.x > this.size.x || pos.y < 0 || pos.y + size.y > this.size.y;

        this.bulletsAt = actor => {
            var bullets = [];
            this.bullets.forEach(bullet => {
                if (!(bullet.pos.x - bullet.size.x / 2 > actor.pos.x + actor.size.x / 2 || bullet.pos.x + bullet.size.x / 2 < actor.pos.x - actor.size.x / 2 ||
                    bullet.pos.y - bullet.size.y / 2 > actor.pos.y + actor.size.y / 2 || bullet.pos.y + bullet.size.y / 2 < actor.pos.y - actor.size.y / 2)) {
                    bullets.push(bullet);
                }
            });
            return bullets;
        };
    }
}