// Classes
class Player {
    constructor(maxHealth, speed) {
        this.maxHealth = maxHealth
        this.health = maxHealth
        this.speed = speed
        this.x = 50
        this.y = 50
        this.color = "#00BFFF"
        this.dashing = false
        this.dashCoolDown = 0
        this.dashDirX = 0
        this.dashDirY = 0
        this.dashFrame = 0
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
        } while (this.distance < 400000);
        this.color = "#dddd33"
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
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 100
        this.color = "#FF1A1A"
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
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI / 2, 500, 10))
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI / -2, 500, 10))
                if (this.health <= this.maxHealth / 1.5) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.PI, 500, 10))
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), 0, 500, 7))
                }
                this.lastShot = this.fireRate
            } else {
                this.lastShot -= delta
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
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 65
        this.color = "#555599"
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
                /* for (let i = 0; i < Math.PI * 2; i += .1) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 600, 10))
                } */
                for (let i = 0; i < Math.PI * 2; i += Math.PI / 30) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.atan2(player.y + 10 - this.y - (this.size / 2), player.x + 10 - this.x - (this.size / 2)) + i, 600, 10))
                }
                if (this.health <= this.maxHealth / 2) {
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
}
class Beyblade {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.spin = 0
        this.lastShot = fireRate;
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 40
        this.color = "#00dd55"
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
                projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), this.spin, 600, 10))
                if (this.health <= this.maxHealth / 2) {
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
}
class Rainman {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;


        this.lastShot = fireRate;
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 55
        this.color = "#0000dd"
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
                projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                projectiles.push(new Projectile(Math.random() * canvas.width, 10, Math.PI / 2, Math.random() * 500 + 100, 10))
                if (this.health <= this.maxHealth / 2) {
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
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 70
        this.color = "#007c82"
        this.random = Math.floor(Math.random() * 4) + 1
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
                if (this.health <= this.maxHealth / 2) {
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
                if (this.health <= this.maxHealth / 2) {
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
}
class Starfish {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.spin = 0
        this.lastShot = fireRate;
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 35
        this.color = "#FF7F50"
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
                if (this.health > this.maxHealth / 2) {
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
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 90
    }
    get color() {
        if (this.phase == 2) {
            return `rgb(${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)} ${Math.floor(Math.random() * 255)})`
        } else {
            return `rgb(${Math.floor(Math.random() * 100)} 0 0 )`
        }
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
        setTimeout(e => {
            this.phase++
            for (let i = 0; i < 250; i++) {
                setTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 800, .6, 20, currentBoss.color)) }, 10 + (10 * i))
            }
            bossPhaseSound.play()
            shake(80, 250)
            setTimeout(e => {
                this.health = this.maxHealth
                diamonds.push(new Diamond())
            }, 3000)
        }, 5000)
    }
}

class Blevhendoonk {
    constructor(maxHealth, speed, fireRate) {
        this.maxHealth = maxHealth;
        this.health = maxHealth
        this.speed = speed;
        this.fireRate = fireRate;

        this.lastShot = fireRate;
        this.x = 680 - 32.5
        this.y = 384 - 32.5
        this.size = 100
        this.phase = 1;
    }
    get color() {
        this.colorPool = Math.floor(Math.random() * 300) + 210
        this.color1 = Math.min(Math.floor(Math.random() * this.colorPool) + 1, 255)
        this.colorPool -= this.color1
        this.color2 = Math.min(Math.floor(Math.random() * this.colorPool) + 1, 255)
        this.colorPool -= this.color2
        this.color3 = Math.min(Math.floor(Math.random() * this.colorPool) + 1, 255)
        this.colorPool -= this.color3
        return `rgb(${this.color1} ${this.color2} ${this.color3})`
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
                for (let i = 0; i < this.phase; i++) {
                    projectiles.push(new Projectile(this.x + (this.size / 2), this.y + (this.size / 2), Math.random() * Math.PI * 2, Math.random() * 300 + 300, 10))
                }
                this.lastShot = this.fireRate - (this.phase/10)
            } else {
                this.lastShot -= delta
            }
        }
    }
    phaseSwitch() {
        projectiles.splice(0, projectiles.length)
        setTimeout(e => {
            this.phase++
            score++
            // for (let i = 0; i < 250; i++) {
            //     setTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 800, .6, 20, currentBoss.color)) }, 10 + (10 * i))
            // }
            setTimeout(e => {
                this.health = this.maxHealth
                diamonds.push(new Diamond())
            }, 1000)
        }, 1000)
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
const scoreCounter = document.getElementById("scoreCounter")
const bossList = [
    "CHARGER", "BEYBLADE", "STARFISH", "RINGMASTER", "RAINMAN", "TSUNAMI", "HARBINGER"
]
const keys = {}
const player = new Player(0, 400)
const projectiles = []
const diamonds = []
const particles = []
const attempts = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
}

const enableSound = new Audio("audio/enableSound.mp3")
const playerDeathSound = new Audio("audio/playerDeathSound.mp3")
const playerDashSound = new Audio("audio/playerDashSound.mp3")
const bossHurtSound = new Audio("audio/bossHurtSound.mp3")
const bossDeathSound = new Audio("audio/bossDeathSound.mp3")
const bossPhaseSound = new Audio("audio/bossPhaseSound.mp3")
// Vars
let lastTime = 0; // time on last frame
let currentBoss;
let selectedBoss = 0;
let globalOffsetX = 0;
let globalOffsetY = 0;
let score = 0
let highscore = 0

// Event Listeners
document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
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
function cycleBoss() {
    /* selectedBoss++
    if (bossList[selectedBoss] != undefined) {
        bossSelect.textContent = bossList[selectedBoss]
    } else {
        selectedBoss = 0
        bossSelect.textContent = bossList[selectedBoss]
    }
    attemptCounter.innerHTML = attempts[selectedBoss]
    console.log(attempts)
    menu.className = ""
    if (selectedBoss < 6) {
        menu.classList.add("beginner")
    } else {
        menu.classList.add("impossible")
    } */
   console.log("Oops! all BLEVhERDOONK!")
}

function start() { // IMPORTANT
    /* if (selectedBoss == 0) {
        spawnBoss(new Charger(10, 225, .1))
    } else if (selectedBoss == 1) {
        spawnBoss(new Beyblade(10, 170, .02))
    } else if (selectedBoss == 2) {
        spawnBoss(new Starfish(10, 130, .25))
    } else if (selectedBoss == 3) {
        spawnBoss(new Ringmaster(10, 150, 1.8))
    } else if (selectedBoss == 4) {
        spawnBoss(new Rainman(10, 120, .2))
    } else if (selectedBoss == 5) {
        spawnBoss(new Tsunami(10, 135, 1.8, .5))
    } else if (selectedBoss == 6) {
        spawnBoss(new Harbinger(10, 165, 4, 5, .05, 5, .5))
    } */
   spawnBoss(new Blevhendoonk(3, 150, 1))
    attempts[selectedBoss] += 1
    attemptCounter.innerHTML = attempts[selectedBoss]
    player.health = 1
    player.x = 50
    player.y = 50
    projectiles.splice(0, projectiles.length)
    menu.classList.add("hide")
    diamonds.splice(0, diamonds.length)
    diamonds.push(new Diamond())
    score = 0
}

function end() {
    setTimeout((e) => {
        projectiles.splice(0, projectiles.length)
        menu.classList.remove("hide")
        currentBoss = undefined
    }, 1500)
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
        htpq2.innerHTML = `[SPACE] </br></br> Dashing provides immunity to attacks while it is active,</br> has a cooldown of .5s </br></br> TIP: Diagonal dashes go farther, the bar over your player tracks dash cooldown`
    } else if (tab == 3) {
        htpq2.innerHTML = `Diamonds damage the boss when collected, 10 are needed to defeat a boss, they are your only source of damage </br></br> TIP: Diamonds are unable to spawn near you`
    } else if (tab == 4) {
        htpq2.innerHTML = `BLEVhERDOONK cannot be stopped, only slowed. It is the beginning and end of all, alpha and omega, time itself. The Big Bang incarnate, present throughout both mankind’s greatest and smallest achievements: builder of the pyramids and The Great Wall of China, also the director of Star Wars. </br></br> Happy April Fools'`
    }
}
// Screen Draw 
function draw() {
    // Reset
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#222223"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.shadowColor = "rgba(0, 0, 0, 0.8)"; // glow color
	ctx.shadowBlur = 20; // how strong the glow is

    // Particles
    for (let i = 0; i < particles.length; i++) {
		ctx.shadowColor = particles[i].color; // glow color
        ctx.fillStyle = particles[i].color
        ctx.fillRect(particles[i].x + globalOffsetX, particles[i].y + globalOffsetY, particles[i].size, particles[i].size)
    }
    // Player
    if (player.health > 0) {
		ctx.shadowColor = player.color; // glow color
        ctx.fillStyle = player.color
        ctx.fillRect(player.x + globalOffsetX, player.y + globalOffsetY, 20, 20)
    }
    // Player Dash Meter
	ctx.shadowColor = "#669FB3"; // glow color
    ctx.fillStyle = "#669FB3"
    if (player.dashCoolDown > 0) {
        ctx.fillRect(player.x + (10 - player.dashCoolDown * 30) + globalOffsetX, player.y - 10 + globalOffsetY, player.dashCoolDown * 60, 5)
    }
    // Projectiles 
    for (let i = 0; i < projectiles.length; i++) {
		ctx.shadowColor = currentBoss.color; // glow color
        ctx.fillStyle = currentBoss.color
        ctx.beginPath();
        ctx.arc(projectiles[i].x + globalOffsetX, projectiles[i].y + globalOffsetY, projectiles[i].size, 0, 2 * Math.PI);
        ctx.fill()
    }
    // Diamond
    for (let i = 0; i < diamonds.length; i++) {
        ctx.save();
        ctx.translate(diamonds[i].x, diamonds[i].y);
        ctx.rotate(Math.PI / 4);

		ctx.shadowColor = diamonds[i].color; // glow color
        ctx.fillStyle = diamonds[i].color;
        ctx.fillRect(-5 + globalOffsetX, -5 + globalOffsetY, 10, 10);

        ctx.restore();
    }
    // Boss
    if (currentBoss != undefined) {
		ctx.shadowColor = currentBoss.color;
        ctx.fillStyle = currentBoss.color
        ctx.fillRect(currentBoss.x + globalOffsetX, currentBoss.y + globalOffsetY, currentBoss.size, currentBoss.size)
        // Boss Health Bar=
        ctx.fillStyle = "#dddd33";
        let barLength = (canvas.width - (20 * (currentBoss.maxHealth + 1))) / currentBoss.maxHealth
        for (let i = 0; i < currentBoss.maxHealth; i++) {
            if (i + 1 > currentBoss.health) {
				ctx.shadowColor = "#151517";
                ctx.fillStyle = "#151517"
            } else {
				ctx.shadowColor = "#dddd33";
                ctx.fillStyle = "#dddd33";
            }
            ctx.fillRect((20 * (i + 1)) + (barLength * i), 750, barLength, 10);
        }

    }
}

// Player
function playerMovement(delta) {
    if (!player.dashing && player.health > 0) {
        if (keys.w || keys.arrowup) player.y -= player.speed * delta
        if (keys.s || keys.arrowdown) player.y += player.speed * delta
        if (keys.a || keys.arrowleft) player.x -= player.speed * delta
        if (keys.d || keys.arrowright) player.x += player.speed * delta
    }

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

function dash(delta) {
    if (keys[" "] && player.dashDirX == 0 && player.dashDirY == 0 && player.dashCoolDown <= 0 && player.health > 0 && currentBoss != undefined) {
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
            /* setTimeout((e) => { */
            particles.push(new Particle(player.x + 5, player.y + 5, (Math.random() * Math.PI * 2), 100, .2, 10, "#007BBB"))
            /* }, 50 + (50 * i)) */
            player.dashFrame += delta
        } else {
            player.dashing = false
            player.dashDirX = 0
            player.dashDirY = 0
            player.dashFrame = 0
            player.dashCoolDown = .5
        }
    }
    if (player.dashCoolDown > 0) player.dashCoolDown -= delta
}

function bossCol() {
    if (player.x + 10 > currentBoss.x && player.x + 10 < currentBoss.x + currentBoss.size + 10 && player.y + 10 > currentBoss.y - 10 && player.y + 10 < currentBoss.y + currentBoss.size && player.dashing == false) {
        player.health--
        if (player.health == 0) {
            shake(7, 30)
            playerDeathSound.play()
            end()
            if (score > highscore) {
                    highscore = score
                    scoreCounter.innerHTML = highscore
                }
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle(player.x + 5, player.y + 5, (Math.random() * Math.PI * 2), 200, .3, 10, "#007BBB"))
            }
        }
    }
}
// Boss Spawning
function spawnBoss(type) {
    currentBoss = type;
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
                shake(7, 30)
                playerDeathSound.play()
                end()
                if (score > highscore) {
                    highscore = score
                    scoreCounter.innerHTML = highscore
                }
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(player.x + 5, player.y + 5, (Math.random() * Math.PI * 2), 200, .3, 10, "#007BBB"))
                }
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
spawnDiamond()
setInterval((e) => {
    for (let i = 0; i < diamonds.length; i++) {
        particles.push(new Particle(diamonds[i].x, diamonds[i].y, (Math.random() * Math.PI * 2), 170, .1, 5, "#AAAA00"))
        particles.push(new Particle(diamonds[i].x, diamonds[i].y, (Math.random() * Math.PI * 2), 170, .1, 5, "#AAAA00"))
    }
}, 100)

function pickupDiamond() {
    for (let i = 0; i < diamonds.length; i++) {
        if (player.x + 10 > diamonds[i].x - 20 && player.x + 10 < diamonds[i].x + 20 && player.y + 10 > diamonds[i].y - 20 && player.y + 10 < diamonds[i].y + 20) {
            currentBoss.health--
            diamonds.splice(i, 1)
            if (currentBoss.health != 0) { spawnDiamond() }
            shake(10, 10)
            if (currentBoss.health == 0) {
                if (true) {
                    for (let i = 0; i < 120; i++) {
                        setTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 700, .4, 20, currentBoss.color)) }, 10 + (10 * i))
                    }
                    bossDeathSound.play()
                    shake(30, 150)
                    currentBoss.phaseSwitch()
                } else {
                    for (let i = 0; i < 120; i++) {
                        setTimeout((e) => { particles.push(new Particle(currentBoss.x + currentBoss.size / 2, currentBoss.y + currentBoss.size / 2, (Math.random() * Math.PI * 2), 700, .4, 20, currentBoss.color)) }, 10 + (10 * i))
                    }
                    bossDeathSound.play()
                    shake(30, 150)
                    end()
                }
            } else {
                bossHurtSound.play()
            }
            break
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
        setTimeout((e) => {
            globalOffsetX = 0;
            globalOffsetY = 0;
            globalOffsetX = Math.random() * intensity;
            globalOffsetY = Math.random() * intensity;
        }, 10 + (10 * i))
        setTimeout((e) => {
            globalOffsetX = 0;
            globalOffsetY = 0;
        }, 20 + (10 * length))
    }
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
    pickupDiamond()
    projectileCol()
    if (currentBoss != undefined) {
        currentBoss.move(delta)
        currentBoss.attack(delta)
        bossCol()
    }
    draw()

    // Recall
    lastTime = time
    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)

// document.getElementById("ID").style.top += "25px";
