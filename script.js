// Classes
class Player {
    constructor(maxHealth, speed) {
        this.maxHealth = maxHealth
        this.health = maxHealth
        this.speed = speed
        this.x = canvas.width/4 - 10
        this.y = canvas.height/2 - 10
        this.color = "#00BFFF"

        this.dashing = false
        this.dashCoolDown = 0
        this.dashDirX = 0
        this.dashDirY = 0
        this.dashFrame = 0

		this.dashDisable = false
        this.moveDisable = false

        this.size = 20

        this.holdUp = false
        this.holdDown = false
        this.holdLeft = false
        this.holdRight = false
    }
	death() {
		shake(7, 30)
        playerDeathSound.play()
		currentBoss.quip("playerDeath")
        end()
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(this.x + 5, this.y + 5, (Math.random() * Math.PI * 2), 200, .3, 10, "#007BBB"))
        }
		console.log("I ran")
	}
}
// Versatile
class Projectile {
    constructor(x, y, angle, speed, size) {
        this.angle = angle
        this.speed = speed
        this.size = size
        this.x = x
        this.y = y
	}
}
class Diamond {
    constructor() {
        do {
            this.x = Math.floor(Math.random() * 1160) + 101
            this.y = Math.floor(Math.random() * 568) + 101
            this.distance = (player.x - this.x) ** 2 + (player.y - this.y) ** 2
        } while ((this.distance < 400000) || (this.x > currentBoss.x && this.x < currentBoss.x + currentBoss.size && this.y > currentBoss.y && this.y < currentBoss.y + currentBoss.size));
        this.fly = false
        this.flySpeed = -400
        this.color = "#dddd33"
        this.rotate = Math.PI / 4
    }
    attack(delta) {
        if (this.fly && currentBoss != undefined) {
            this.angle = Math.atan2(currentBoss.y + currentBoss.size / 2 - this.y + 6, currentBoss.x + currentBoss.size / 2 - this.x + 6)
            this.x += Math.cos(this.angle) * (this.flySpeed * delta)
            this.y += Math.sin(this.angle) * (this.flySpeed * delta)
            this.flySpeed += 1200 * delta
            this.rotate += Math.PI * 3.5 * delta

            for (let i = 0; i < diamonds.length; i++) {
                if (this.x > currentBoss.x && this.x < currentBoss.x + currentBoss.size && this.y > currentBoss.y && this.y < currentBoss.y + currentBoss.size) {
                    currentBoss.health--
                    bossPulse = 1
                    diamonds.splice(i, 1)
                    shake(25, 10)
                    if (currentBoss.health == 0) {
                        if (selectedBoss == 9 && currentBoss.phase == 1) {
                            for (let i = 0; i < 120; i++) {
                                betterTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 700, .4, 20, currentBoss.color)) }, 10 + (10 * i))
                            }
                            bossDeathSound.play()
                            shake(30, 150)
                            currentBoss.phaseSwitch()
                        } else {
                            for (let i = 0; i < 120; i++) {
                                betterTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 700, .4, 20, currentBoss.color)) }, 10 + (10 * i))
                            }
                            bossDeathSound.play()
                            shake(30, 150)
                            end()
                        }
                    } else {
                        bossHurtSound.play()
                    }
                }
            }
        }
    }
}
class Particle {
    constructor(x, y, angle, speed, lifespan, size, color) {
        this.angle = angle
        this.speed = speed
        this.x = x
        this.y = y
        this.lifespan = lifespan
        this.size = size
        this.color = color
    }
}
// Bosses 
class Charger {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.lastShot = fireRate;
		this.size = 100
        this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#FF1A1A"

        this.phasePoint = 6
        this.halt = false
        
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI / 2, 500, 10))
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI / -2, 500, 10))
                if (this.health <= this.phasePoint) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI, 500, 10))
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), 0, 500, 10))
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
    intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("You're not getting any further.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("You're not getting any further.", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Woah, woah! Slow your roll there Traveler.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Woah, woah! Slow your roll there Traveler.", 500, 50, 500, 10)

            bossQuip("I can't let you go any further.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("I can't let you get go further.", this.talkTime + 250, 50, 500, 10)

            bossQuip("Best you turn around, before someone gets hurt.", this.talkTime + 250, 75, 500, 10)
            this.talkTime = quipTimeCalc("Best you turn around, before someone gets hurt.", this.talkTime + 250, 75, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("You shall not pass!", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("No intruder shall enter.", 100, 50, 500, 10)
			}
		}
	}
}
class Ringmaster {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.lastShot = fireRate;
        this.size = 65
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#555599"

        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                for (let i = 0; i < Math.PI * 2; i += Math.PI / 30) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 600, 10))
                }
                if (this.health <= this.phasePoint) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 10) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 450, 10))
                    }
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("Time to put on a show!", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Time to put on a show!", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("And for my final act...", 500, 100, 500, 10)
            this.talkTime = quipTimeCalc("And for my final act...", 500, 100, 500, 10)

            bossQuip("I will be defying death...", this.talkTime + 250, 100, 500, 10)
            this.talkTime = quipTimeCalc("I will be defying death...", this.talkTime + 250, 100, 500, 10)

            bossQuip("Against the Traveler!", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Against the Traveler!", this.talkTime + 250, 50, 500, 10)

            bossQuip("Time to put on a show!", this.talkTime + 250, 75, 500, 10)
            this.talkTime = quipTimeCalc("Time to put on a show!", this.talkTime + 250, 75, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("Listen to the crowd!", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("What a preformance!", 100, 50, 500, 10)
			}
		}
	}
}
class Beyblade {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.spin = 0
        this.lastShot = fireRate;
        this.size = 40
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#00dd55"

        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), this.spin, 600, 10))
                if (this.health <= this.phasePoint) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI + this.spin, 600, 10))
                }
                this.spin += .1
                if (this.spin > Math.PI * 2) {
                    this.spin = 0
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
    intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("LET IT RIP!", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("LET IT RIP!", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Yeah! I'm on a winning streak right now!", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Yeah! I'm on a winning streak right now!", 500, 50, 500, 10)

            bossQuip("You wanna go up next, Traveler?", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("You wanna go up next, Traveler?", this.talkTime + 250, 50, 500, 10)

            bossQuip("Let's see if you can hang with the big dogs.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Let's see if you can hang with the big dogs.", this.talkTime + 250, 50, 500, 10)

            bossQuip("LET IT RIP!", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("LET IT RIP!", this.talkTime + 250, 50, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("I can't stop... I can't stop...", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("Who's next?", 100, 50, 500, 10)
			}
		}
	}
}
class Rainman {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;


        this.lastShot = fireRate;
        this.size = 55
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#0000dd"

        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                if (this.health <= this.phasePoint) {
                    projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                    projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                    projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("Leave my home.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Leave my home.", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("I have shown you no aggression, Traveler.", 500, 60, 500, 10)
            this.talkTime = quipTimeCalc("I have shown you no aggression, Traveler.", 500, 60, 500, 10)

            bossQuip("And still, you bring brutality and terror to my home.", this.talkTime + 250, 60, 500, 10)
            this.talkTime = quipTimeCalc("And still, you bring brutality and terror to my home.", this.talkTime + 250, 60, 500, 10)

			bossQuip("And for this, I will not stand.", this.talkTime + 250, 60, 500, 10)
            this.talkTime = quipTimeCalc("And for this, I will not stand.", this.talkTime + 250, 60, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("All I ask is peace.", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("Wash away...", 100, 50, 500, 10)
			}
		}
	}
}

class Tsunami {
    constructor(maxHealth, speed, fireRate, fireRate2) {
        console.log(fireRate)
        console.log(fireRate2)
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;
        this.fireRate2 = fireRate2

        this.lastShot = fireRate;
        this.lastShot2 = fireRate2;
        this.size = 70
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#007c82"
        this.random = Math.floor(Math.random() * 4) + 1

        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                this.random = Math.floor(Math.random() * 4) + 1
                if (this.random == 1) {
                    for (let i = 0; i <= canvas.width; i += canvas.width / 60) {
                        projectiles.push(new Projectile(i + canvas.width / 120, 0, Math.PI / 2, 300, 10))
                    }
                } else if (this.random == 2) {
                    for (let i = 0; i <= canvas.width; i += canvas.width / 60) {
                        projectiles.push(new Projectile(i + canvas.width / 120, canvas.height, Math.PI / -2, 300, 10))
                    }

                } else if (this.random == 3) {
                    for (let i = 0; i <= canvas.height; i += canvas.height / 35) {
                        projectiles.push(new Projectile(canvas.width, i + canvas.height / 70, Math.PI, 300, 10))
                    }

                } else if (this.random == 4) {
                    for (let i = 0; i <= canvas.height; i += canvas.height / 35) {
                        projectiles.push(new Projectile(0, i + canvas.height / 70, Math.PI * 2, 300, 10))
                    }
                }
                if (this.health <= this.phasePoint) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)), 600, 15))
                }
                this.lastShot = this.fireRate
                console.log(this.lastShot)
            } else {
                this.lastShot -= delta
            }
            if (this.lastShot2 < 0) {
                for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 5) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), /* Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) */ Math.random() * Math.PI * 2 + i, 200, 10))
                }
                if (this.health <= this.phasePoint) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 5) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), /* Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) */ Math.random() * Math.PI * 2 + i, 200, 5))
                    }
                }
                this.lastShot2 = this.fireRate2
            } else {
                this.lastShot2 -= delta
            }
        }
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("I will fight with all my strength.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("I will fight with all my strength.", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Traveler...", 500, 100, 500, 10)
            this.talkTime = quipTimeCalc("Traveler...", 500, 100, 500, 10)

            bossQuip("What a bitter name...", this.talkTime + 250, 75, 500, 10)
            this.talkTime = quipTimeCalc("What a bitter name...", this.talkTime + 250, 75, 500, 10)

			bossQuip("Even if I am no longer king...", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Even if I am no longer king...", this.talkTime + 250, 50, 500, 10)

			bossQuip("I will stop you with all my strength.", this.talkTime + 250, 50, 700, 10)
            this.talkTime = quipTimeCalc("I will stop you with all my strength.", this.talkTime + 250, 50, 700, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("By the power of the sea!", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("I will restore my honor.", 100, 50, 500, 10)
			}
		}
	}
}
class Starfish {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.spin = 0
        this.lastShot = fireRate;
        this.size = 35
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#FF7F50"

        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                if (this.health > this.phasePoint) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 5) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI / -2 + i, 600, 10))
                    }
                } else {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 6) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI + i + this.spin, 600, 10))
                    }
                }
                this.spin += .05; // 0.1 originally
                if (this.spin > Math.PI) {
                    this.spin == 0
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("Fixin' for a standoff, Traveler?", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Fixin' for a standoff, Traveler?", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Stop your steppin' scoundrel.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Stop your steppin' scoundrel.", 500, 50, 500, 10)

            bossQuip("Makin' a name for yourself eh?", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Makin' a name for yourself eh?", this.talkTime + 250, 50, 500, 10)

			bossQuip("And I reckon I'm your next target.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("And I reckon I'm your next target.", this.talkTime + 250, 50, 500, 10)

            bossQuip("Well then...", this.talkTime + 250, 150, 500, 10)
            this.talkTime = quipTimeCalc("Well then...", this.talkTime + 250, 150, 500, 10)

            bossQuip("DRAW!", this.talkTime + 250, 25, 500, 10)
            this.talkTime = quipTimeCalc("DRAW!", this.talkTime + 250, 25, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("It's high noon...", 500, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("Time to collect my bounty", 500, 50, 500, 10)
			}
		}
	}
}
class Harbinger {
    constructor(maxHealth, speed, fireRate, fireRate2, fireRate3, fireRate4, fireRate5) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;
        this.lastShot = fireRate;
        this.swapUD = false
        this.swapRL = false
        this.fireRate2 = fireRate2;
        this.lastShot2 = fireRate2;
        this.fireRate3 = fireRate3;
        this.lastShot3 = fireRate3;
        this.fireRate4 = fireRate4;
        this.lastShot4 = fireRate4;
        this.fireRate5 = fireRate5;
        this.lastShot5 = fireRate5;

        this.phase = 1;

        this.spin = 0
        this.size = 90
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2

        this.phasePoint = 0
    }
    get color() {
        if (this.phase == 2) {
            return `rgb(${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)})`
        } else {
            return `rgb(${Math.floor(Math.random() * 80) + 30} 0 0 )`
        }
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
                if (!this.swapUD) {
                    for (let i = 0; i <= canvas.width; i += canvas.width / 60) {
                        projectiles.push(new Projectile(i + canvas.width / 120, 0, Math.PI / 2, canvas.height / 4, 10))
                    }
                    this.swapUD = true;
                } else {
                    for (let i = 0; i <= canvas.width; i += canvas.width / 60) {
                        projectiles.push(new Projectile(i + canvas.width / 120, canvas.height, Math.PI / -2, canvas.height / 4, 10))
                    }
                    this.swapUD = false;
                }

                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }

            if (this.lastShot2 < 0) {
                if (!this.swapRL) {
                    for (let i = 0; i <= canvas.height; i += canvas.height / 35) {
                        projectiles.push(new Projectile(canvas.width, i + canvas.height / 70, Math.PI, canvas.width / 5, 10))
                    }
                    this.swapRL = true;
                } else {
                    for (let i = 0; i <= canvas.height; i += canvas.height / 35) {
                        projectiles.push(new Projectile(0, i + canvas.height / 70, 0, canvas.width / 5, 10))
                    }
                    this.swapRL = false;
                }
                this.lastShot2 = this.fireRate2
            } else {
                this.lastShot2 -= delta
            }

            if (this.lastShot3 < 0) {
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), this.spin, 600, 10))
                if (this.phase == 2) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI + this.spin, 600, 10))
                }
                this.spin += Math.PI * 4 * delta; // 0.1 originally
                if (this.spin > Math.PI * 2) {
                    this.spin = 0
                }
                this.lastShot3 = this.fireRate3
            } else {
                this.lastShot3 -= delta
            }

            if (this.lastShot4 < 0) {
                for (let i = 0; i < Math.PI * 2; i += Math.PI / 15) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 400, 10))
                }
                if (this.phase == 2) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 5) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 200, 10))
                    }
                }
                this.lastShot4 = this.fireRate4
            } else {
                this.lastShot4 -= delta
            }

            if (this.lastShot5 < 0) {
                projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                if (this.phase == 2) {
                    projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                    projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                }
                this.lastShot5 = this.fireRate5
            } else {
                this.lastShot5 -= delta
            }
        }
    }
    phaseSwitch() {
        projectiles.splice(0, projectiles.length)
        betterTimeout(e => {
            this.phase++
            for (let i = 0; i < 250; i++) {
                betterTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 800, .6, 20, currentBoss.color)) }, 10 + (10 * i))
            }
            bossPhaseSound.play()
            shake(80, 250)
            betterTimeout(e => {
                this.health = this.maxHealth
                diamonds.push(new Diamond())
            }, 3000)
        }, 5000)
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("Why do you return?", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Why do you return?", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Human spirit...", 2000, 150, 500, 10)
            this.talkTime = quipTimeCalc("Human spirit...", 2000, 150, 500, 25)

            bossQuip("I know who you are...", this.talkTime + 250, 80, 500, 25)
            this.talkTime = quipTimeCalc("I know who you are...", this.talkTime + 250, 80, 500, 25)

			bossQuip("I know what you are...", this.talkTime + 250, 80, 500, 25)
            this.talkTime = quipTimeCalc("I know what you are...", this.talkTime + 250, 80, 500, 25)

            bossQuip("No more than a pawn...", this.talkTime + 250, 80, 500, 25)
            this.talkTime = quipTimeCalc("No more than a pawn...", this.talkTime + 250, 80, 500, 25)

			bossQuip("Who doesn't know their role in this.", this.talkTime + 250, 80, 500, 25)
            this.talkTime = quipTimeCalc("Who doesn't know their role in this.", this.talkTime + 250, 80, 500, 25)

			bossQuip("I warn you...", this.talkTime + 250, 100, 500, 25)
            this.talkTime = quipTimeCalc("I warn you...", this.talkTime + 250, 100, 500, 25)

			bossQuip("You will bring about your own destruction.", this.talkTime + 250, 80, 500, 25)
            this.talkTime = quipTimeCalc("You will bring about your own destruction.", this.talkTime + 250, 80, 500, 25)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase" && this.phase == 1) {
				bossQuip("You utter fool...", 2750, 100, 500, 10)
			} else if (type == "playerDeath" && this.phase == 1) {
				bossQuip("This is mercy.", 100, 50, 500, 10)
			} else if (type == "phase" && this.phase == 2) {
				bossQuip("", 100, 100, 500, 10)
			} else if (type == "playerDeath" && this.phase == 2) {
				bossQuip("Wretched Being.", 100, 50, 500, 10)
			}
		}
	}
}
class Tutorial {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.lastShot = 0;
		this.size = 100
        this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#005AAA"

        this.phasePoint = -1
        this.quipping = false
    }
    move(delta) {
        if (this.health > 0) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0) {
            if (this.lastShot < 0) {
				projectiles.splice(0, projectiles.length)
				for (let i = 0; i < 40; i++) {
					projectiles.push(new Projectile(canvas.width/2 + (Math.random() * 20 - 10), (canvas.height/40 * i), Math.PI / 2, 0, 10))
				}
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
            }
        }
    }
    intro() {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true

            bossQuip("Hello, Human Spirit.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Hello, Human Spirit.", 500, 50, 500, 10)

            bossQuip("I have chosen you as my warrior, you may call me Mentor.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("I have chosen you as my warrior, you may call me Mentor.", this.talkTime + 250, 50, 500, 10)

            bossQuip("Many evil beings have taken over this land.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Many evil beings have taken over this land.", this.talkTime + 250, 50, 500, 10)

            bossQuip("Now I need you too seek them out and destroy them.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Now I need you too seek them out and destroy them.", this.talkTime + 250, 50, 500, 10)

            bossQuip("You are the only hope left.", this.talkTime + 250, 100, 750, 10)
            this.talkTime = quipTimeCalc("You are the only hope left.", this.talkTime + 250, 100, 750, 10)

            betterTimeout((e) => {
                player.moveDisable = false
            }, this.talkTime)
            bossQuip("Use 'WASD' or 'ARROW KEYS' to move.", this.talkTime + 250, 50, 1000, 10)
            this.talkTime = quipTimeCalc("Use 'WASD' or 'ARROW KEYS' to move.", this.talkTime + 250, 50, 1000, 10)

            bossQuip("I have also given you some of my power.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("I have also given you some of my power.", this.talkTime + 250, 50, 500, 10)

            betterTimeout((e) => {
                player.dashDisable = false
            }, this.talkTime)
            bossQuip("Use 'SPACE' or 'SHIFT' to dash through projectiles.", this.talkTime + 250, 50, 1000, 10)
            this.talkTime = quipTimeCalc("Use 'SPACE' or 'SHIFT' to dash through projectiles.", this.talkTime + 250, 50, 1000, 10)
            
            betterTimeout((e) => {
                spawnDiamond()
            }, this.talkTime)
            bossQuip("Now collect these diamond and begin your conquest.", this.talkTime + 250, 50, 1000, 10)
            this.talkTime = quipTimeCalc("Now collect these diamonds and begin your conquest.", this.talkTime + 250, 50, 1000, 10)

            bossQuip("I will be watching...", this.talkTime + 2500, 100, 500, 10)
            this.talkTime = quipTimeCalc("I will be watching...", this.talkTime + 2500, 100, 500, 10)
        
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("You shouldn't be able to see this.", 100, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("You're joking.", 100, 50, 500, 10)
			}
		}
	}
}
class Monk {
    constructor(maxHealth, speed, fireRate, fireRate2) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;
		this.fireRate2 = fireRate2;

        this.lastShot = fireRate;
		this.lastShot2 = fireRate2;
        this.size = 75
		this.x = canvas.width * 3/4 - this.size/2
        this.y = canvas.height/2 - this.size/2
        this.color = "#DD7700"

		this.spin = 0
        this.phasePoint = 5
    }
    move(delta) {
        if (this.health > 0 && !this.halt) {
            this.angle = Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2))
            this.x += Math.cos(this.angle) * (this.speed * delta)
            this.y += Math.sin(this.angle) * (this.speed * delta)
        }
    }
    attack(delta) {
        if (this.health > 0 && !this.halt) {
            if (this.lastShot < 0) {
				if (this.health > this.phasePoint) {
					this.burstAmount = Math.ceil(Math.random() * 5) + 3
                    for (let k = 0; k <= canvas.height; k += canvas.height / this.burstAmount) {
                        projectiles.push(new Projectile(canvas.width, k + canvas.height / 70, Math.PI, Math.ceil(Math.random() * 100) + 150, 10))
                    }
					this.burstAmount = Math.ceil(Math.random() * 5) + 3
                    for (let k = 0; k <= canvas.height; k += canvas.height / this.burstAmount) {
                        projectiles.push(new Projectile(0, k + canvas.height / 70, Math.PI * 2, Math.ceil(Math.random() * 100) + 150, 10))
                    }
					this.lastShot = this.fireRate
				} else {
					this.burstAmount = Math.ceil(Math.random() * 5) + 3
                    for (let k = 0; k <= canvas.height; k += canvas.height / this.burstAmount) {
                        projectiles.push(new Projectile(canvas.width, k + canvas.height / 70, Math.PI, Math.ceil(Math.random() * 150) + 175, 10))
                    }
					this.burstAmount = Math.ceil(Math.random() * 5) + 3
                    for (let k = 0; k <= canvas.height; k += canvas.height / this.burstAmount) {
                        projectiles.push(new Projectile(0, k + canvas.height / 70, Math.PI * 2, Math.ceil(Math.random() * 150) + 175, 10))
                    }
					this.lastShot = this.fireRate/1.35
				}
            } else {
                this.lastShot -= delta
            }
			if (this.lastShot2 < 0) {
                    for (let k = 0; k < Math.PI * 2; k += Math.PI * 2/3) {
                        projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), this.spin + k, 600, 15))
                    }
                this.lastShot2 = this.fireRate2
				this.spin += .1
            } else {
                this.lastShot2 -= delta
				console.log(this.lastShot2)
            }
        }
    }
	intro() {   
        if (bossInfo[selectedBoss].visited) {
            this.halt = false
            player.moveDisable = false
            player.dashDisable = false
            player.holdRight = false
            spawnDiamond()

            bossQuip("Join the light, Traveler.", 500, 50, 500, 10)
            this.talkTime = quipTimeCalc("Join the light, Traveler.", 500, 50, 500, 10)
        } else {
            this.talkTime = 0
            this.halt = true
            player.moveDisable = true
            player.x = -10 - player.size/2
            player.holdRight = true

            setInterval((e) => {
                player.holdRight = false
            }, 1000)

            bossQuip("Hello, Traveler.", 500, 75, 500, 10)
            this.talkTime = quipTimeCalc("Hello, Traveler.", 500, 75, 500, 10)

            bossQuip("You have made quite the mess.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("You have made quite the mess.", this.talkTime + 250, 50, 500, 10)

			bossQuip("But I still see good in you.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("But I still see good in you.", this.talkTime + 250, 50, 500, 10)

			bossQuip("Cast aside this dark path you walk, and join the light.", this.talkTime + 250, 50, 500, 10)
            this.talkTime = quipTimeCalc("Cast aside this dark path you walk, and join the light.", this.talkTime + 250, 50, 500, 10)

            betterTimeout((e) => {
                this.halt = false
                player.moveDisable = false
                player.dashDisable = false
                spawnDiamond()
                bossInfo[selectedBoss].visited = true
            }, this.talkTime)
        }
    }
	quip(type) {
		if (bossQuipText == "") {
			if (type == "phase") {
				bossQuip("See the truth.", 500, 50, 500, 10)
			} else if (type == "playerDeath") {
				bossQuip("Poor soul.", 500, 50, 500, 10)
			}
		}
	}
}

// projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)), 600, 10))

// Consts
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const canvasData = canvas.getBoundingClientRect()
const bossSelect = document.getElementById("bossSelect")
const startScreen = document.getElementById("startScreen")
const htpScreen = document.getElementById("htpScreen")
const menu = document.getElementById("menu")
const htpMenu = document.getElementById("htpMenu")
const attemptCounter = document.getElementById("attemptCounter")
const htpq2 = document.getElementById("htpq2")
const bossList = [
    "LISTSTART", "TUTORIAL", "CHARGER", "BEYBLADE", "STARFISH", "RINGMASTER", "RAINMAN", "MONK", "TSUNAMI", "HARBINGER", "LISTEND"
]
const keys = {}
const player = new Player(0, 400)
const projectiles = []
const diamonds = []
const particles = []
const timeoutHolder = []
const bossInfo = [{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},{attempts: 0, visited: false},]

const enableSound = new Audio("audio/enableSound.mp3")
const playerDeathSound = new Audio("audio/playerDeathSound.mp3")
const playerDashSound = new Audio("audio/playerDashSound.mp3")
const diamondCollectSound = new Audio("audio/diamondCollectSound.mp3")
const bossHurtSound = new Audio("audio/bossHurtSound.mp3")
const bossDeathSound = new Audio("audio/bossDeathSound.mp3")
const bossPhaseSound = new Audio("audio/bossPhaseSound.mp3")

const tutorialSong = new Audio("audio/orchestralAura.mp3")
const chargerSong = new Audio("audio/headBangerLoop.mp3")
const beyBladeSong = new Audio("audio/robotDnB.mp3")
const starFishSong = new Audio("audio/synfulSub.mp3")
const ringMasterSong = new Audio("audio/beginningOfTime.mp3")
const rainManSong = new Audio("audio/theoryOfEverything2.mp3")
const monkSong = new Audio("audio/freedomOftrance.mp3")
const tsunamiSong = new Audio("audio/thermodynamix.mp3")
const harbingerSong = new Audio("audio/evilLoop.mp3")

chargerSong.volume = 0
// Vars
let lastTime = 0; // time on last frame
let currentBoss;
let selectedBoss = 1;
let globalOffsetX = 0;
let globalOffsetY = 0;

let bossPulse = 0
let playerPulse = 0

let musicVolume = 1

let bossQuipText = ""

// Event Listeners
document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    
    // Menu Navigations
    if (e.key.toLowerCase() == "enter" && currentBoss == undefined && !menu.classList.contains("hide")) start()
    if (e.key.toLowerCase() == "arrowright" && currentBoss == undefined && !menu.classList.contains("hide")) cycleBoss(1)
    if (e.key.toLowerCase() == "arrowleft" && currentBoss == undefined && !menu.classList.contains("hide")) cycleBoss(-1)

    // Volume Control
    if (e.key.toLowerCase() == "v") {
        let userVolumeInput = parseInt(prompt("Set volume (0-100)"))
        if (isNaN(userVolumeInput) || userVolumeInput < 0 || userVolumeInput > 100) {
            alert("Please enter a number 0-100")
        } else {
            musicVolume = userVolumeInput/100
        }
    }
});
document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});
// Allows Audio
document.addEventListener("click", (e) => {
    enableSound.play()
    enableSound.pause()
});

// Menu
function cycleBoss(amount) {
    selectedBoss += amount
    if (bossList[selectedBoss] == "LISTEND") {
        selectedBoss = 1
        bossSelect.textContent = bossList[selectedBoss]
    } else if (bossList[selectedBoss] == "LISTSTART") {
        selectedBoss = bossList.length - 2
        bossSelect.textContent = bossList[selectedBoss]
    } else {
        bossSelect.textContent = bossList[selectedBoss]
    }
    attemptCounter.innerHTML = bossInfo[selectedBoss].attempts
}

function start() { // IMPORTANT
	if (selectedBoss == 1) {
        spawnBoss(new Tutorial(3, 0, .03))
    } else if (selectedBoss == 2) {
        spawnBoss(new Charger(10, 225, .1))
    } else if (selectedBoss == 3) {
        spawnBoss(new Beyblade(10, 170, .02))
    } else if (selectedBoss == 4) {
        spawnBoss(new Starfish(10, 130, .25))
    } else if (selectedBoss == 5) {
        spawnBoss(new Ringmaster(10, 150, 1.8))
    } else if (selectedBoss == 6) {
        spawnBoss(new Rainman(10, 120, .2))
    } else if (selectedBoss == 7) {
        spawnBoss(new Monk(10, 20, 2, .15))
    } else if (selectedBoss == 8) {
        spawnBoss(new Tsunami(10, 135, 1.8, .5))
    } else if (selectedBoss == 9) {
        spawnBoss(new Harbinger(10, 165, 4, 5, .05, 5, .5))
    }
	if (selectedBoss == 1) {
		player.dashDisable = true
	} else {
		player.dashDisable = false
	}
    bossInfo[selectedBoss].attempts += 1
    attemptCounter.innerHTML = bossInfo[selectedBoss].attempts
    player.health = 1
    player.x = canvas.width/5 - 10
    player.y = canvas.height/2- 10
    projectiles.splice(0, projectiles.length)
    menu.classList.add("hide")
    diamonds.splice(0, diamonds.length)
    bossQuipText = ""
    currentBoss.intro()
}

function end() {
    if (keys["escape"]) {
        projectiles.splice(0, projectiles.length)
        diamonds.splice(0, diamonds.length)
        menu.classList.remove("hide")
        clearTimeouts()
        currentBoss = undefined
    } else {
        betterTimeout((e) => {
            projectiles.splice(0, projectiles.length)
            diamonds.splice(0, diamonds.length)
            menu.classList.remove("hide")
            clearTimeouts()
            currentBoss = undefined
        }, 1750)
    }
}

function switchScreen() {
    if (menu.classList.contains("hide")) {
        menu.classList.remove("hide")
        htpMenu.classList.add("hide")
    } else {
        menu.classList.add("hide")
        htpMenu.classList.remove("hide")
    }
}

function guide(tab) {
    if (tab == 1) {
        htpq2.innerHTML = `[WASD] OR [↑ ↓ ← →] </br></br> TIP: Hold down two directions to move faster`
    } else if (tab == 2) {
        htpq2.innerHTML = `[SPACE] OR [SHIFT] </br></br> Dashing provides immunity to attacks while it is active,</br> has a cooldown of .5s </br></br> TIP: Diagonal dashes go farther, the bar over your player tracks dash cooldown`
    } else if (tab == 3) {
        htpq2.innerHTML = `Diamonds damage the boss when collected, 10 are needed to defeat a boss, they are your only source of damage </br></br> TIP: Diamonds are unable to spawn near you`
    } else if (tab == 4) {
        htpq2.innerHTML = `It is up to you to learn how bosses work, what weakness they have and how you can exploit them </br></br> This won't be easy 😏`
    }
}
// Screen Draw 
function draw() {
    // Reset
    ctx.shadowBlur = 0; // how strong the glow is
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#151515"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < canvas.width; i += 60) {
        ctx.fillStyle = "#181818"
        ctx.fillRect(i + globalOffsetX, globalOffsetY, 2, canvas.height)
    }
    for (let i = 0; i < canvas.height; i += 60) {
        ctx.fillStyle = "#181818"
        ctx.fillRect(globalOffsetX, i + globalOffsetY, canvas.width, 2)
    }

    ctx.shadowColor = "rgba(0, 0, 0, 0.8)"; // glow color
    ctx.shadowBlur = 0; // how strong the glow is

    // Particles
    for (let i = 0; i < particles.length; i++) {
        ctx.shadowColor = particles[i].color; // glow color
        ctx.shadowBlur = particles[i].size;

        ctx.fillStyle = particles[i].color
        ctx.fillRect(particles[i].x + globalOffsetX, particles[i].y + globalOffsetY, particles[i].size, particles[i].size)
    }
    // Player
    if (currentBoss != undefined) {
        if (player.health > 0) {
            ctx.shadowColor = player.color; // glow color
            ctx.shadowBlur = player.size;

            ctx.fillStyle = player.color
            ctx.fillRect(player.x + globalOffsetX, player.y + globalOffsetY, player.size, player.size)

            ctx.fillStyle = `rgba(255, 255, 255, ${playerPulse})`
            ctx.fillRect(player.x + globalOffsetX, player.y + globalOffsetY, player.size, player.size)
            // Player Dash Meter
            ctx.shadowColor = "#669FB3"; // glow color
            ctx.shadowBlur = 10;

            ctx.fillStyle = "#669FB3"
            ctx.strokeStyle = "#669FB3"
            if (player.dashCoolDown > 0) {
                ctx.fillRect(player.x + (10 - 25) + globalOffsetX, player.y - 10 + globalOffsetY, 50 - player.dashCoolDown * 100, 5)
                ctx.strokeRect(player.x - 15 + globalOffsetX, player.y - 10 + globalOffsetY, 50, 5)
            }
        }
    }
    // Projectiles 
    for (let i = 0; i < projectiles.length; i++) {
        ctx.shadowColor = currentBoss.color; // glow color
        ctx.shadowBlur = projectiles[i].size;
        ctx.fillStyle = currentBoss.color
        ctx.beginPath();
        ctx.arc(projectiles[i].x + globalOffsetX, projectiles[i].y + globalOffsetY, projectiles[i].size, 0, 2 * Math.PI);
        ctx.fill()
    }
    // Diamond
    for (let i = 0; i < diamonds.length; i++) {
        ctx.save();
        ctx.translate(diamonds[i].x, diamonds[i].y);
        ctx.rotate(diamonds[i].rotate);

        ctx.shadowColor = diamonds[i].color; // glow color
        ctx.shadowBlur = 12

        ctx.fillStyle = diamonds[i].color;
        ctx.fillRect(-5 + globalOffsetX, -5 + globalOffsetY, 12, 12);

        ctx.restore();
    }
    // Boss
    if (currentBoss != undefined) {
        ctx.shadowColor = currentBoss.color;
        ctx.shadowBlur = currentBoss.size / 3

        ctx.fillStyle = currentBoss.color
        ctx.fillRect(currentBoss.x + globalOffsetX, currentBoss.y + globalOffsetY, currentBoss.size, currentBoss.size)

        ctx.fillStyle = `rgba(255, 255, 255, ${bossPulse})`
        ctx.fillRect(currentBoss.x + globalOffsetX, currentBoss.y + globalOffsetY, currentBoss.size, currentBoss.size)

        // Quips
        if (bossQuipText != "") {
			ctx.shadowBlur = 0
            ctx.font = "15px monospace";       // size + font
            ctx.fillStyle = "#999";       // color
            ctx.textAlign = "center";
            ctx.fillText("[" + bossQuipText + "]", currentBoss.x + currentBoss.size / 2 + globalOffsetX, currentBoss.y - 10 + globalOffsetY); // text, x, y
        }

        // Boss Health Bar
        ctx.fillStyle = "#dddd33";
        let barLength = (canvas.width - (20 * (currentBoss.maxHealth + 1))) / currentBoss.maxHealth
        for (let i = 0; i < currentBoss.maxHealth; i++) {
            if (i + 1 > currentBoss.health) {
                ctx.shadowColor = "#111";
                ctx.shadowBlur = 0
                ctx.fillStyle = "#111"
            } else {
                ctx.shadowColor = "#dddd33";
                ctx.shadowBlur = 10
                ctx.fillStyle = "#dddd33";
            }
            ctx.fillRect((20 * (i + 1)) + (barLength * i), 750, barLength, 10);
        }

    }

}
// Player
function playerMovement(delta) {
    if (!player.dashing && player.health > 0 && !player.moveDisable) {
        if (keys.w || keys.arrowup) player.y -= player.speed * delta
        if (keys.s || keys.arrowdown) player.y += player.speed * delta
        if (keys.a || keys.arrowleft) player.x -= player.speed * delta
        if (keys.d || keys.arrowright) player.x += player.speed * delta
    }

    if (player.holdUp) player.y -= player.speed * delta
        if (player.holdDown) player.y += player.speed * delta
        if (player.holdLeft) player.x -= player.speed * delta
        if (player.holdRight) player.x += player.speed * delta

    if (!player.moveDisable) {
        if (player.x > canvas.width - 20) {
            player.x = canvas.width - 20
        }
        if (player.x < 0) {
            player.x = 0
        }
        if (player.y > canvas.height - 20) {
            player.y = canvas.height - 20
        }
        if (player.y < 0) {
            player.y = 0
        }
    }
}

function dash(delta) {
    if ((keys[" "] ||keys["shift"]) && player.dashDirX == 0 && player.dashDirY == 0 && player.dashCoolDown <= 0 && player.health > 0 && currentBoss != undefined && !player.dashDisable && !player.moveDisable) {
        if (keys.w || keys.arrowup) player.dashDirY -= 1500
        if (keys.s || keys.arrowdown) player.dashDirY += 1500
        if (keys.a || keys.arrowleft) player.dashDirX -= 1500
        if (keys.d || keys.arrowright) player.dashDirX += 1500
    }
    if (player.dashDirX != 0 || player.dashDirY != 0) {
        player.dashing = true
        if (playerDashSound.paused) playerDashSound.play()
        if (player.dashFrame < .1) {
            player.x += player.dashDirX * delta
            player.y += player.dashDirY * delta
            /* betterTimeout((e) => { */
            particles.push(new Particle(player.x + 5, player.y + 5, (Math.random() * Math.PI * 2), 100, .2, 10, "#007BBB"))
            /* }, 50 + (50 * i)) */
            player.dashFrame += delta
        } else {
            player.dashing = false
            player.dashDirX = 0
            player.dashDirY = 0
            player.dashFrame = 0
            player.dashCoolDown = .5
            betterTimeout((e) => {
                playerPulse = 1
            }, 500)
        }
    }
    if (player.dashCoolDown > 0) player.dashCoolDown -= delta
}

function bossCol() {
    if (player.x + 10 > currentBoss.x && player.x + 10 < currentBoss.x + currentBoss.size + 10 && player.y + 10 > currentBoss.y - 10 && player.y + 10 < currentBoss.y + currentBoss.size && player.dashing == false) {
        player.health--
        if (player.health == 0) {
            player.death()
        }
    }
}
// Boss Spawning
function spawnBoss(type) {
    currentBoss = type;
}

// Quips
function bossQuip(quip, wait, quipTypeSpeed, quipIdleTime, quipFoldSpeed) {
    betterTimeout((e) => {
        for (let i = 0; i < quip.length; i++) {
            betterTimeout((e) => {
                bossQuipText += quip[i]
            }, quipTypeSpeed * i)
        }
        betterTimeout((e) => {
            for (let i = 0; i <= quip.length; i++) {
            betterTimeout((e) => {
                bossQuipText = quip.slice(0, quip.length - i)
            }, quipFoldSpeed * i)
        }
        }, (quipTypeSpeed * quip.length) + quipIdleTime)
    }, wait)
}

function quipTimeCalc(quip, wait, quipTypeSpeed, quipIdleTime, quipFoldSpeed) {
    return wait + (quip.length * quipTypeSpeed) + quipIdleTime + (quip.length * quipFoldSpeed)
}

// Projectiles
function projectilesMove(delta) {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].x += Math.cos(projectiles[i].angle) * (projectiles[i].speed * delta)
        projectiles[i].y += Math.sin(projectiles[i].angle) * (projectiles[i].speed * delta)
    }
}
function projectileCol() {
    for (let i = 0; i < projectiles.length; i++) {
        if (player.x + 10 > projectiles[i].x - projectiles[i].size && player.x + 10 < projectiles[i].x + projectiles[i].size && player.y + 10 > projectiles[i].y - projectiles[i].size && player.y + 10 < projectiles[i].y + projectiles[i].size && player.dashing == false) {
            player.health--
            if (player.health == 0) {
                player.death()
            }
            projectiles.splice(i, 1)
        }
    }
    for (let i = 0; i < projectiles.length; i++) {
        if (-50 > projectiles[i].x || canvas.width + 50 < projectiles[i].x || -50 > projectiles[i].y || canvas.height + 50 < projectiles[i].y + 10) {
            projectiles.splice(i, 1)
        }
    }
}
// Diamonds
function spawnDiamond() {
    diamonds.push(new Diamond())
}
// spawnDiamond()
setInterval((e) => {
    for (let i = 0; i < diamonds.length; i++) {
        particles.push(new Particle(diamonds[i].x, diamonds[i].y, (Math.random() * Math.PI * 2), 170, .1, 5, "#AAAA00"))
        particles.push(new Particle(diamonds[i].x, diamonds[i].y, (Math.random() * Math.PI * 2), 170, .1, 5, "#AAAA00"))
    }
}, 100)

function pickupDiamond() {
    for (let i = 0; i < diamonds.length; i++) {
        if (player.x + 10 > diamonds[i].x - 20 && player.x + 10 < diamonds[i].x + 20 && player.y + 10 > diamonds[i].y - 20 && player.y + 10 < diamonds[i].y + 20) {
            if (!diamonds[i].fly) {
                diamonds[i].fly = true
                diamondCollectSound.play()
                if (currentBoss.health > 1) {
                    spawnDiamond()
                }
                if (currentBoss.health == currentBoss.phasePoint + 1 || (currentBoss.health == currentBoss.phasePoint + 1 && currentBoss.phase == 1)) {
					currentBoss.quip("phase")
                }
                for (let i = 0; i < diamonds.length; i++) {
                    for (let k = 0; k < 6; k++) {
                        particles.push(new Particle(diamonds[i].x, diamonds[i].y, (Math.random() * Math.PI * 2), 300, .2, 7, "#AAAA00"))
                    }
                }
            }
        }
    }
}

// particles
function updateParticles(delta) {
    for (let i = 0; i < particles.length; i++) {
        particles[i].x += Math.cos(particles[i].angle) * (particles[i].speed * delta)
        particles[i].y += Math.sin(particles[i].angle) * (particles[i].speed * delta)
        particles[i].lifespan -= delta
        if (particles[i].lifespan <= 0) {
            particles.splice(i, 1)
        }
    }
}

// Screen Shakes
function shake(intensity, length) {
    for (let i = 0; i < length; i++) {
        betterTimeout((e) => {
            globalOffsetX = 0;
            globalOffsetY = 0;
            globalOffsetX = Math.random() * intensity;
            globalOffsetY = Math.random() * intensity;
        }, 10 + (10 * i))
        betterTimeout((e) => {
            globalOffsetX = 0;
            globalOffsetY = 0;
        }, 20 + (10 * length))
    }
}

// Pulse Control
function pulseControl(delta) {
    if (bossPulse > 0) {
        bossPulse -= delta * 3;
    }
    if (playerPulse > 0) {
        playerPulse -= delta * 2;
    }
}

// Music Control
function musicControl(delta) {
    musicFade(delta, "TUTORIAL", tutorialSong)
    musicFade(delta, "CHARGER", chargerSong)
    musicFade(delta, "BEYBLADE", beyBladeSong)
    musicFade(delta, "STARFISH", starFishSong)
    musicFade(delta, "RINGMASTER", ringMasterSong)
    musicFade(delta, "RAINMAN", rainManSong)
    musicFade(delta, "MONK", monkSong)
    musicFade(delta, "TSUNAMI", tsunamiSong)
    musicFade(delta, "HARBINGER", harbingerSong)
}

function musicFade(delta, boss, song) {
    if (bossList[selectedBoss] == boss && song.volume <= 1) {
        song.play()

        if (song.volume + delta/2 > musicVolume) {
            song.volume = musicVolume
        } else {
            song.volume += delta/2
        }
    } else if (song.volume > 0) {

        if (song.volume - delta/1.5 < 0) {
            song.volume = 0
            song.pause();
            song.currentTime = 0;
        } else {
            song.volume -= delta/1.5
        }
    }
}

// Timeout system

function betterTimeout(fn, delay) {
	let timeoutId = setTimeout(fn, delay)
	timeoutHolder.push(timeoutId)
}

function clearTimeouts() {
	for (let i of timeoutHolder) {
		clearTimeout(i)
	}
	timeoutHolder.splice(0, timeoutHolder.length)
}

// Delta time / Loop functions
function loop(time) {

    let delta = time - lastTime
    delta = delta / 1000
    delta = Math.min(delta, 0.05);
    // Run functions
    playerMovement(delta)
    projectilesMove(delta)
    updateParticles(delta)
    dash(delta)
    pulseControl(delta)
    musicControl(delta)
    pickupDiamond()
    projectileCol()
    if (keys["escape"] && currentBoss != undefined) {
        end()
    }
    if (currentBoss != undefined) {
        currentBoss.move(delta)
        currentBoss.attack(delta)
        bossCol()
    }
    if (diamonds.length > 0) {
        for (let i = 0; i < diamonds.length; i++) {
            diamonds[i].attack(delta)
        }
    }
    draw()

    // Recall
    lastTime = time
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// document.getElementById("ID").style.top += "25px";
