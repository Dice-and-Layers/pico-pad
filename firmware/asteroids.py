import time
import math
import random
import utils

# --- Game Constants ---
WIDTH = 128
HEIGHT = 64
MAX_BULLETS = 5

class Entity:
    def __init__(self, x, y, size):
        self.x, self.y = x, y
        self.size = size
        self.vx, self.vy = 0, 0
    def update(self):
        self.x = (self.x + self.vx) % WIDTH
        self.y = (self.y + self.vy) % HEIGHT

class Ship(Entity):
    def __init__(self):
        super().__init__(WIDTH // 2, HEIGHT // 2, 8)
        self.angle = 0
    def rotate(self, da): self.angle += da
    def accelerate(self):
        self.vx += math.cos(self.angle) * 0.4
        self.vy += math.sin(self.angle) * 0.4
    def update(self):
        super().update()
        self.vx *= 0.98; self.vy *= 0.98 # Friction
    def draw(self, d):
        utils.draw_icon(d, 'SHIP', self.x - 4, self.y - 4)

class Bullet(Entity):
    def __init__(self, x, y, angle):
        super().__init__(x, y, 2)
        self.vx = math.cos(angle) * 3
        self.vy = math.sin(angle) * 3
        self.life = 40
    def update(self):
        super().update()
        self.life -= 1
    def draw(self, d): d.pixel(int(self.x), int(self.y), 1)

class Asteroid(Entity):
    def __init__(self, x=None, y=None, size=8):
        if x is None:
            if random.random() > 0.5:
                x, y = (0 if random.random() > 0.5 else WIDTH), random.randint(0, HEIGHT)
            else:
                x, y = random.randint(0, WIDTH), (0 if random.random() > 0.5 else HEIGHT)
        super().__init__(x, y, size)
        self.vx = (random.random() - 0.5) * 2
        self.vy = (random.random() - 0.5) * 2
    def draw(self, d):
        utils.draw_icon(d, 'ASTEROID', self.x - 4, self.y - 4)

def check_collision(e1, e2, dist):
    return math.sqrt((e1.x - e2.x)**2 + (e1.y - e2.y)**2) < dist

def run_game(display, get_keys):
    ship = Ship()
    bullets = []
    asteroids = [Asteroid() for _ in range(3)]
    score = 0
    state = "START"
    last_fire = 0
    last_frame = time.monotonic()

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "ASTEROIDS", 30, 15, scale=2)
            utils.draw_text(display, "CENTER TO START", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; score = 0; ship = Ship(); bullets = []; asteroids = [Asteroid() for _ in range(3)]
                time.sleep(0.3)

        elif state == "PLAYING":
            if (1, 0) in keys: ship.rotate(-0.4)
            if (1, 2) in keys: ship.rotate(0.4)
            if (0, 1) in keys: ship.accelerate()
            if (1, 1) in keys and time.monotonic() - last_fire > 0.3:
                bullets.append(Bullet(ship.x, ship.y, ship.angle))
                last_fire = time.monotonic()

            ship.update()
            for b in bullets[:]:
                b.update()
                if b.life <= 0: bullets.remove(b)
            
            for a in asteroids:
                a.update()
                if check_collision(ship, a, 6): state = "GAMEOVER"
            
            for b in bullets[:]:
                for a in asteroids[:]:
                    if check_collision(b, a, 6):
                        if b in bullets: bullets.remove(b)
                        asteroids.remove(a); score += 10
                        if len(asteroids) < 5: asteroids.append(Asteroid())
                        break

            display.fill(0)
            ship.draw(display)
            for b in bullets: b.draw(display)
            for a in asteroids: a.draw(display)
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.02)
