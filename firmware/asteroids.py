import time
import math
import random

# --- Game Constants ---
WIDTH = 128
HEIGHT = 64
SHIP_SIZE = 5
BULLET_SPEED = 4
MAX_BULLETS = 5
ASTEROID_MIN_SIZE = 4
ASTEROID_MAX_SIZE = 10

# ... (Classes stay same)

# --- Game Classes ---

class Entity:
    def __init__(self, x, y, vx=0, vy=0):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
    
    def update(self):
        self.x = (self.x + self.vx) % WIDTH
        self.y = (self.y + self.vy) % HEIGHT

class Ship(Entity):
    def __init__(self):
        super().__init__(WIDTH // 2, HEIGHT // 2)
        self.angle = 0  # In radians
        self.rotation_speed = 0.5
        self.thrust = 0.5
        self.drag = 0.98
        
    def rotate(self, direction):
        self.angle += direction * self.rotation_speed
        
    def accelerate(self):
        self.vx += math.cos(self.angle) * self.thrust
        self.vy += math.sin(self.angle) * self.thrust
        
    def update(self):
        super().update()
        self.vx *= self.drag
        self.vy *= self.drag

    def draw(self, d):
        # Draw a sleek fighter shape
        # Nose
        x1 = self.x + math.cos(self.angle) * SHIP_SIZE
        y1 = self.y + math.sin(self.angle) * SHIP_SIZE
        # Back Left
        x2 = self.x + math.cos(self.angle + 2.4) * SHIP_SIZE
        y2 = self.y + math.sin(self.angle + 2.4) * SHIP_SIZE
        # Engine Notch (Indentation at the back)
        xc = self.x + math.cos(self.angle + math.pi) * (SHIP_SIZE // 1.5)
        yc = self.y + math.sin(self.angle + math.pi) * (SHIP_SIZE // 1.5)
        # Back Right
        x3 = self.x + math.cos(self.angle - 2.4) * SHIP_SIZE
        y3 = self.y + math.sin(self.angle - 2.4) * SHIP_SIZE
        
        d.line(int(x1), int(y1), int(x2), int(y2), 1)
        d.line(int(x2), int(y2), int(xc), int(yc), 1)
        d.line(int(xc), int(yc), int(x3), int(y3), 1)
        d.line(int(x3), int(y3), int(x1), int(y1), 1)


class Bullet(Entity):
    def __init__(self, x, y, angle):
        vx = math.cos(angle) * BULLET_SPEED
        vy = math.sin(angle) * BULLET_SPEED
        super().__init__(x, y, vx, vy)
        self.life = 30 # Frames
        
    def update(self):
        super().update()
        self.life -= 1

    def draw(self, d):
        d.pixel(int(self.x), int(self.y), 1)

class Asteroid(Entity):
    def __init__(self, x=None, y=None, size=None):
        if x is None: x = random.randint(0, WIDTH)
        if y is None: y = random.randint(0, HEIGHT)
        if size is None: size = random.randint(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE)
        
        vx = (random.random() - 0.5) * 1.5
        vy = (random.random() - 0.5) * 1.5
        super().__init__(x, y, vx, vy)
        self.size = size
        
        # Generate jagged rocky shape
        self.points = []
        num_pts = 6 + random.randint(0, 4)
        for i in range(num_pts):
            ang = (i / num_pts) * math.pi * 2
            # Randomize radius to create jaggedness
            r = (self.size / 2) * (0.7 + random.random() * 0.3)
            self.points.append((math.cos(ang) * r, math.sin(ang) * r))
        
    def draw(self, d):
        for i in range(len(self.points)):
            p1 = self.points[i]
            p2 = self.points[(i + 1) % len(self.points)]
            d.line(int(self.x + p1[0]), int(self.y + p1[1]), 
                   int(self.x + p2[0]), int(self.y + p2[1]), 1)


# --- Game State ---
state = "START"
score = 0
ship = Ship()
bullets = []
asteroids = []

def reset_game():
    global ship, bullets, asteroids, score
    ship = Ship()
    bullets = []
    asteroids = [Asteroid() for _ in range(4)]
    score = 0

def check_collision(e1, e2, dist):
    dx = e1.x - e2.x
    dy = e1.y - e2.y
    return (dx*dx + dy*dy) < (dist*dist)

# --- UI Helpers ---

# --- UI Helpers ---

# Bitmapped font (3x5) for digits 0-9, 'S', 'C', ':'
FONT = {
    '0': (0xF, 0x9, 0xF), # 111, 101, 111 (wait, this is 3x3, let's do 3x5)
    '0': [0x1F, 0x11, 0x1F], # 3x5: [column 0, column 1, column 2]
    '1': [0x00, 0x1F, 0x00],
    '2': [0x1D, 0x15, 0x17],
    '3': [0x15, 0x15, 0x1F],
    '4': [0x07, 0x04, 0x1F],
    '5': [0x17, 0x15, 0x1D],
    '6': [0x1F, 0x15, 0x1D],
    '7': [0x01, 0x01, 0x1F],
    '8': [0x1F, 0x15, 0x1F],
    '9': [0x17, 0x15, 0x1F],
    'S': [0x12, 0x15, 0x09],
    'C': [0x0E, 0x11, 0x11],
    'R': [0x1F, 0x09, 0x16],
    'E': [0x1F, 0x15, 0x15],
    'O': [0x0E, 0x11, 0x0E],
    'G': [0x0E, 0x11, 0x1D],
    'M': [0x1F, 0x02, 0x1F],
    'V': [0x07, 0x18, 0x07],
    'A': [0x1E, 0x05, 0x1E],
    'T': [0x01, 0x1F, 0x01],
    'N': [0x1F, 0x04, 0x1F],
    'P': [0x1F, 0x05, 0x02],
    'I': [0x11, 0x1F, 0x11],
    'D': [0x1F, 0x11, 0x0E],
    'L': [0x1F, 0x10, 0x10],
    'H': [0x1F, 0x04, 0x1F],
    'U': [0x1F, 0x10, 0x1F],
    'Y': [0x07, 0x18, 0x07],
    ':': [0x00, 0x0A, 0x00],
    ' ': [0x00, 0x00, 0x00]
}

def draw_char(d, char, x, y):
    if char.upper() in FONT:
        cols = FONT[char.upper()]
        for c_idx, col in enumerate(cols):
            for r_idx in range(5):
                if (col >> r_idx) & 1:
                    d.pixel(x + c_idx, y + r_idx, 1)

def draw_text_simple(d, text, x, y):
    """Custom text renderer using bitmapped characters."""
    curr_x = x
    for char in text:
        draw_char(d, char, curr_x, y)
        curr_x += 4 # 3 pixels for char + 1 for gap


def draw_title(d):
    # Stylized "ASTEROIDS" using lines
    # A
    d.line(10, 30, 15, 10, 1); d.line(15, 10, 20, 30, 1); d.line(12, 20, 18, 20, 1)
    # S
    d.line(25, 10, 35, 10, 1); d.line(25, 10, 25, 20, 1); d.line(25, 20, 35, 20, 1); d.line(35, 20, 35, 30, 1); d.line(25, 30, 35, 30, 1)
    # T
    d.line(40, 10, 55, 10, 1); d.line(47, 10, 47, 30, 1)
    # E
    d.line(60, 10, 70, 10, 1); d.line(60, 10, 60, 30, 1); d.line(60, 20, 68, 20, 1); d.line(60, 30, 70, 30, 1)
    # R
    d.line(75, 10, 75, 30, 1); d.line(75, 10, 85, 10, 1); d.line(85, 10, 85, 20, 1); d.line(75, 20, 85, 20, 1); d.line(75, 20, 85, 30, 1)
    # O
    d.rect(90, 10, 10, 20, 1)
    # I
    d.line(105, 10, 115, 10, 1); d.line(110, 10, 110, 30, 1); d.line(105, 30, 115, 30, 1)
    # D
    d.line(120, 10, 120, 30, 1); d.line(120, 10, 125, 15, 1); d.line(125, 15, 125, 25, 1); d.line(125, 25, 120, 30, 1)

def run_game(display, get_keys):
    global state, score, ship, bullets, asteroids
    last_fire_time = 0
    last_frame_time = time.monotonic()
    reset_game()
    state = "START"

    while True:
        keys = get_keys()
        now = time.monotonic()
        dt = now - last_frame_time
        last_frame_time = now
        
        # EXIT TO MENU: Top-Left + Top-Right Combo
        if (0, 0) in keys and (0, 2) in keys:
             return

        if state == "START":
            display.fill(0)
            draw_title(display)
            utils.draw_text(display, "PRESS CENTER", 35, 45)
            display.show()
            if (1, 1) in keys:
                reset_game()
                state = "PLAYING"
                time.sleep(0.3)

        elif state == "PLAYING":
            # Handle Input
            if (1, 0) in keys: ship.rotate(-0.5) # Left
            if (1, 2) in keys: ship.rotate(0.5)  # Right
            if (0, 1) in keys: ship.accelerate()   # Up (Thrust)
            
            if (1, 1) in keys: # Fire
                if now - last_fire_time > 0.25 and len(bullets) < MAX_BULLETS:
                    bullets.append(Bullet(ship.x, ship.y, ship.angle))
                    last_fire_time = now

            # Update
            ship.update()
            
            for b in bullets[:]:
                b.update()
                if b.life <= 0:
                    bullets.remove(b)
            
            for a in asteroids:
                a.update()
                if check_collision(ship, a, a.size//2 + 2):
                    state = "GAMEOVER"
                    time.sleep(0.5)
            
            # Bullet-Asteroid Collision
            for b in bullets[:]:
                for a in asteroids[:]:
                    if check_collision(b, a, a.size//2 + 2):
                        if b in bullets: bullets.remove(b)
                        if a in asteroids:
                            asteroids.remove(a)
                            score += 10
                            if a.size > ASTEROID_MIN_SIZE + 2:
                                asteroids.append(Asteroid(a.x, a.y, a.size // 2))
                                asteroids.append(Asteroid(a.x, a.y, a.size // 2))
                        break
            
            if not asteroids:
                asteroids = [Asteroid() for _ in range(3 + score // 50)]

            # Draw
            display.fill(0)
            ship.draw(display)
            for b in bullets: b.draw(display)
            for a in asteroids: a.draw(display)
            draw_text_simple(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 20, scale=2)
            utils.draw_text(display, f"SCORE: {score}", 35, 45)
            display.show()
            if (1, 1) in keys:
                reset_game()
                state = "PLAYING"
                time.sleep(0.3)
            if (0, 1) in keys: # Back to Menu
                return
        
        elapsed = time.monotonic() - now
        if elapsed < 0.033:
            time.sleep(0.033 - elapsed)

