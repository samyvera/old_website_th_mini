class Display {
    constructor(game, cx, size) {
        this.animationTime = 0;
        this.game = game;
        this.cx = cx;
        this.size = size;

        this.drawHUD = () => {
            this.cx.fillStyle = '#224';
            this.cx.fillRect(0, 0, 1, 1);
            this.cx.fillRect(this.size.x - 1, 0, 1, 1);
            this.cx.fillRect(0, this.size.y - 1, 1, 1);
            this.cx.fillRect(this.size.x - 1, this.size.y - 1, 1, 1);
            this.cx.fillStyle = '#088';
            this.cx.fillRect(1, 0, this.size.x - 2, 1);
            this.cx.fillRect(0, 1, 1, this.size.y - 2);
            this.cx.fillRect(1, this.size.y - 1, this.size.x - 2, 1);
            this.cx.fillRect(this.size.x - 1, 1, 1, this.size.y - 2);

            if (this.game.flash) {
                this.cx.fillStyle = this.animationTime % 2 ? '#F0C7F0' : '#224';
                this.cx.fillRect(0, 0, this.size.x, this.size.y);
            }
        }

        this.drawFrame = () => {
            this.cx.clearRect(0, 0, 64, 128);
            
            if (this.game.state === 'title' || this.game.state === 'retry') {
                var title = document.createElement("img");
                title.src = "img/game/title.png";
                this.cx.drawImage(title, 0, 0, 64, 128, 0, 0, 64, 128);
            }
            else if (this.game.state === 'game') {
                if (this.game.boss) this.drawCharacter(this.game.boss);
                if (this.game.player) this.drawCharacter(this.game.player);
                this.game.bullets.forEach(bullet => this.drawBullet(bullet));

                if (this.game.boss) {
                    if (!this.game.boss.isInvincible) {
                        this.cx.fillStyle = '#088';
                        for (let i = 0; i < this.game.boss.health*50/this.game.boss.maxHealth; i++) {
                            if (i === 10) this.cx.fillStyle = '#F0C7F0';
                            this.cx.fillRect(2 + i, 2, 1, 1);
                        }
                    }
                    if (this.game.boss.showFace) {
                        var bossBack = document.createElement("img");
                        bossBack.src = "img/game/bossBack.png";
                        this.cx.drawImage(bossBack, 0, 0, 64, 16, this.animationTime * 4 % 64, 40, 64, 16);
                        this.cx.drawImage(bossBack, 0, 0, 64, 16, this.animationTime * 4 % 64 - 64, 40, 64, 16);
                        var face = document.createElement("img");
                        face.src = "img/game/bossFace.png";
                        this.cx.drawImage(face, 0, 0, 64, 16, 0, 40, 64, 16);
                        if (this.game.boss.phase === 3) {
                            var title = document.createElement("img");
                            title.src = "img/game/bossTitle.png";
                            this.cx.drawImage(title, 0, 0, 64, 16, 0, 40, 64, 16);
                        }
                    }

                    var numbersImg = document.createElement("img");
                    numbersImg.src = "img/numbers.png";
                    var numbers = this.game.boss.score.toString();
                    for (let i = 0; i < numbers.length; i++) {
                        this.cx.drawImage(numbersImg,
                            4 * numbers[i], 0, 4, 5,
                            2 + i * 4, this.game.size.y - 7, 4, 5);
                    }
                }
            }

            this.drawHUD();
            this.animationTime++;
        }

        this.drawCharacter = character => {
            var characterSprite = document.createElement("img");
            characterSprite.src = "img/game/" + character.name + ".png";
            this.cx.drawImage(characterSprite,
                character.direction.x === 0 ? 16 : character.direction.x === 1 ? 32 : 0, 0, 16, 16,
                character.pos.x - 8, character.pos.y - 8, 16, 16
            );
        }
        this.drawBullet = bullet => {
            var bulletSprite = document.createElement("img");
            if (bullet.type === 'star') {
                bulletSprite.src = "img/game/star.png";
                this.cx.drawImage(bulletSprite,
                    0, 0, 8, 8,
                    bullet.pos.x - 4, bullet.pos.y - 4, 8, 8
                );
            }
            else {
                bulletSprite.src = "img/game/bullet.png";
                this.cx.drawImage(bulletSprite,
                    0, 0, 4, 4,
                    bullet.pos.x - 2, bullet.pos.y - 2, 4, 4
                );
            }
        }
    }
}