"""
RETRO PADDLE - Classic Ball Game
--------------------------------
A two-player style game with an AI opponent. Control the paddle to bounce 
the ball past the opponent's side.

Controls:
- TOP-LEFT/BOTTOM-LEFT: Move Player 1 paddle.
- TOP-RIGHT/BOTTOM-RIGHT: Move Player 2 paddle (if not using AI).
- CENTER: Pause game.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, PADDLE_W, PADDLE_H, BALL_SIZE = 128, 64, 3, 16, 4

class Paddle:
    """Player or AI controlled paddle."""
    def __init__(self, x): 
        self.x, self.y, self.score = x, HEIGHT // 2 - PADDLE_H // 2, 0
        
    def move(self, dy): 
        """Move the paddle vertically within screen bounds."""
        self.y = max(0, min(HEIGHT - PADDLE_H, self.y + dy))
        
    def draw(self, d):
        """Render the paddle with a subtle texture."""
        d.fill_rect(int(self.x), int(self.y), PADDLE_W, PADDLE_H, 1)
        # Add texture lines for a "retro" feel
        for y in range(int(self.y), int(self.y) + PADDLE_H, 4): 
            d.hline(int(self.x), y, PADDLE_W, 0)

class Ball:
    """The bouncing ball logic and physics."""
    def __init__(self): 
        self.reset()
        
    def reset(self): 
        """Reset the ball to the center with a random direction."""
        self.x, self.y = WIDTH // 2, HEIGHT // 2
        # Initial velocity
        self.vx = (2.5 if random.random() > 0.5 else -2.5)
        self.vy = (random.random() - 0.5) * 4
        
    def update(self, p1, p2):
        """Update ball position and handle collisions with walls and paddles."""
        self.x += self.vx
        self.y += self.vy
        
        # Wall bounce (Top and Bottom)
        if self.y <= 0 or self.y >= HEIGHT - BALL_SIZE: 
            self.vy = -self.vy
        
        # Collision with Player 1 Paddle
        if self.vx < 0:
            if self.x <= p1.x + PADDLE_W and p1.y <= self.y <= p1.y + PADDLE_H:
                self.vx = -self.vx * 1.05 # Speed up slightly on hit
                # Change bounce angle based on where it hit the paddle
                self.vy += (self.y - (p1.y + PADDLE_H/2)) * 0.2
        # Collision with Player 2 Paddle
        else:
            if self.x >= p2.x - BALL_SIZE and p2.y <= self.y <= p2.y + PADDLE_H:
                self.vx = -self.vx * 1.05
                self.vy += (self.y - (p2.y + PADDLE_H/2)) * 0.2
        
        # Scoring
        if self.x < 0: 
            p2.score += 1
            self.reset()
            return "P2"
        if self.x > WIDTH: 
            p1.score += 1
            self.reset()
            return "P1"
        return None
        
    def draw(self, d):
        """Draw the ball as a small square/cross."""
        d.fill_rect(int(self.x)+1, int(self.y), 2, 4, 1)
        d.fill_rect(int(self.x), int(self.y)+1, 4, 2, 1)

def run_game(display, get_keys):
    """Main game loop for Retro Paddle."""
    p1, p2, ball, state = Paddle(1), Paddle(WIDTH - 1 - PADDLE_W), Ball(), "START"
    high_score = utils.get_high_score("retro_paddle")
    
    while True:
        keys = get_keys()
        # Standard Exit Combo
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            display.fill(0)
            utils.draw_text(display, "RETRO PADDLE", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            if (1, 1) in keys: 
                state = "PLAYING"
                p1.score = 0
                p2.score = 0
                ball.reset()
                time.sleep(0.3)
            
        elif state == "PLAYING":
            if (1, 1) in keys: # Pause
                state = "PAUSED"
                time.sleep(0.3)
                continue
                
            # Player 1 Controls (Left column buttons)
            if (0, 0) in keys: p1.move(-5)
            if (2, 0) in keys: p1.move(5)
            
            # P2 Controls (Right column buttons) or Simple AI
            if (0, 2) in keys: 
                p2.move(-5)
            elif (2, 2) in keys: 
                p2.move(5)
            else:
                # AI logic: follow the ball when it's on P2's half
                if ball.vx > 0 and ball.x > WIDTH // 2:
                    target = ball.y - PADDLE_H // 2
                    if abs(p2.y - target) > 2:
                        if p2.y > target: p2.move(-2)
                        else: p2.move(2)
            
            ball.update(p1, p2)
            # First to 5 wins
            if p1.score >= 5 or p2.score >= 5:
                state = "GAMEOVER"
                utils.save_high_score("retro_paddle", max(p1.score, p2.score))
                high_score = utils.get_high_score("retro_paddle")
            
            # Rendering
            display.fill(0)
            p1.draw(display)
            p2.draw(display)
            ball.draw(display)
            # Center line
            for y in range(0, HEIGHT, 4): 
                display.pixel(WIDTH // 2, y, 1)
            
            # UI: Scores (Larger)
            utils.draw_text(display, str(p1.score), 30, 5, scale=2)
            utils.draw_text(display, str(p2.score), 90, 5, scale=2)
            display.show()
            
        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            # Display Winner
            winner = "P1 WINS" if p1.score >= 5 else "P2 WINS"
            utils.draw_text(display, winner, 36, 30, scale=2)
            utils.draw_text(display, f"HIGH: {high_score}", 40, 45)
            utils.draw_text(display, "CENTER TO RESTART", 30, 56)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)

