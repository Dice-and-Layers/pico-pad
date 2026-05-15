"""
STARROIDS - Space Survival Game
-------------------------------
A vector-based space shooter where the player must destroy orbiting hazards.
Includes momentum-based physics and bullet management.

Controls:
- LEFT/RIGHT: Rotate the ship.
- UP: Accelerate in the current direction.
- CENTER: Fire a bullet.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import math
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, MAX_BULLETS = 128, 64, 5

class Entity:
    """Base class for all moving game objects with wrap-around screen logic."""
    def __init__(self, x, y, size): 
        self.x, self.y, self.size = x, y, size
        self.vx, self.vy = 0, 0
        
    def update(self): 
        """Update position and wrap around screen edges."""
        self.x = (self.x + self.vx) % WIDTH
        self.y = (self.y + self.vy) % HEIGHT

class Ship(Entity):
    """The player's starship with rotation and thrust mechanics."""
    def __init__(self): 
        super().__init__(WIDTH // 2, HEIGHT // 2, 8)
        self.angle = 0
        
    def rotate(self, da): 
        """Change the ship's orientation."""
        self.angle += da
        
    def accelerate(self): 
        """Apply thrust in the direction the ship is facing."""
        self.vx += math.cos(self.angle) * 0.4
        self.vy += math.sin(self.angle) * 0.4
        
    def update(self): 
        """Update position and apply friction to simulate space drag."""
        super().update()
        self.vx *= 0.98 # Friction
        self.vy *= 0.98
        
    def draw(self, d): 
        """Render the ship icon."""
        utils.draw_icon(d, 'SHIP', self.x - 4, self.y - 4)

class Bullet(Entity):
    """Projectile fired by the ship."""
    def __init__(self, x, y, angle):
        super().__init__(x, y, 2)
        # Bullets travel faster than the ship
        self.vx = math.cos(angle) * 3
        self.vy = math.sin(angle) * 3
        self.life = 40 # Time to live in frames
        
    def update(self): 
        """Update position and decrease remaining life."""
        super().update()
        self.life -= 1
        
    def draw(self, d): 
        """Draw a single pixel for the bullet."""
        d.pixel(int(self.x), int(self.y), 1)

class Hazard(Entity):
    """Floating space hazards (asteroids) that the player must avoid/destroy."""
    def __init__(self, x=None, y=None, size=8):
        if x is None:
            # Spawn at a random edge of the screen
            if random.random() > 0.5: 
                x, y = (0 if random.random() > 0.5 else WIDTH), random.randint(0, HEIGHT)
            else: 
                x, y = random.randint(0, WIDTH), (0 if random.random() > 0.5 else HEIGHT)
        super().__init__(x, y, size)
        # Random initial velocity
        self.vx = (random.random() - 0.5) * 2
        self.vy = (random.random() - 0.5) * 2
        
    def draw(self, d): 
        """Render the asteroid icon."""
        utils.draw_icon(d, 'ASTEROID', self.x - 4, self.y - 4)

def check_collision(e1, e2, dist): 
    """Check if two entities are within a certain distance of each other."""
    return math.sqrt((e1.x - e2.x)**2 + (e1.y - e2.y)**2) < dist

def run_game(display, get_keys):
    """Main game loop for Starroids."""
    ship, bullets, hazards, score, state, last_fire = Ship(), [], [Hazard() for _ in range(3)], 0, "START", 0
    high_score = utils.get_high_score("starroids")
    
    while True:
        keys = get_keys()
        # Standard Exit Combo
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            # Display Start Screen
            display.fill(0)
            utils.draw_text(display, "STARROIDS", 30, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            
            if (1, 1) in keys: # Center button to start
                state, score = "PLAYING", 0
                ship, bullets = Ship(), []
                hazards = [Hazard() for _ in range(3)]
                time.sleep(0.3)
            
        elif state == "PLAYING":
            # Controls
            if (1, 0) in keys: ship.rotate(-0.4) # Rotate Left
            if (1, 2) in keys: ship.rotate(0.4)  # Rotate Right
            if (0, 1) in keys: ship.accelerate() # Thrust
            
            # Firing Logic: limit fire rate
            if (1, 1) in keys and time.monotonic() - last_fire > 0.3: 
                bullets.append(Bullet(ship.x, ship.y, ship.angle))
                last_fire = time.monotonic()
            
            # Physics Updates
            ship.update()
            for b in bullets[:]:
                b.update()
                if b.life <= 0: bullets.remove(b)
            
            for h in hazards:
                h.update()
                # Check collision with ship
                if check_collision(ship, h, 6):
                    state = "GAMEOVER"
                    utils.save_high_score("starroids", score)
                    high_score = utils.get_high_score("starroids")
            
            # Bullet/Hazard Collisions
            for b in bullets[:]:
                for h in hazards[:]:
                    if check_collision(b, h, 6):
                        if b in bullets: bullets.remove(b)
                        hazards.remove(h)
                        score += 10
                        # Respawn hazards to keep the field populated
                        if len(hazards) < 5: hazards.append(Hazard())
                        break
            
            # Rendering
            display.fill(0)
            ship.draw(display)
            for b in bullets: b.draw(display)
            for h in hazards: h.draw(display)
            
            # UI: Score (Larger)
            utils.draw_text(display, f"SC:{score}", 0, 0, scale=2) 
            display.show()
            
        elif state == "GAMEOVER":
            # Display Game Over Screen
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            # Larger score display
            utils.draw_text(display, f"SCORE: {score}", 24, 30, scale=2)
            utils.draw_text(display, f"HIGH: {high_score}", 35, 45)
            utils.draw_text(display, "CENTER TO RESTART", 30, 56)
            display.show()
            
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.02)

