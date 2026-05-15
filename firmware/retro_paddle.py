"""
RETRO PADDLE - Classic Ball Game
--------------------------------
A two-player style game with an AI opponent. Control the paddle to bounce 
the ball past the opponent's side.

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
    def __init__(self, x): self.x, self.y, self.score = x, HEIGHT // 2 - PADDLE_H // 2, 0
    def move(self, dy): self.y = max(0, min(HEIGHT - PADDLE_H, self.y + dy))
    def draw(self, d):
        d.fill_rect(int(self.x), int(self.y), PADDLE_W, PADDLE_H, 1)
        # Add texture lines
        for y in range(int(self.y), int(self.y) + PADDLE_H, 4): d.hline(int(self.x), y, PADDLE_W, 0)

class Ball:
    """The bouncing ball."""
    def __init__(self): self.reset()
    def reset(self): 
        self.x, self.y, self.vx, self.vy = WIDTH // 2, HEIGHT // 2, (2.5 if random.random() > 0.5 else -2.5), (random.random() - 0.5) * 4
    def update(self, p1, p2):
        self.x += self.vx; self.y += self.vy
        if self.y <= 0 or self.y >= HEIGHT - BALL_SIZE: self.vy = -self.vy
        
        # Collision with paddles
        if self.vx < 0:
            if self.x <= p1.x + PADDLE_W and p1.y <= self.y <= p1.y + PADDLE_H:
                self.vx = -self.vx * 1.05; self.vy += (self.y - (p1.y + PADDLE_H/2)) * 0.2
        else:
            if self.x >= p2.x - BALL_SIZE and p2.y <= self.y <= p2.y + PADDLE_H:
                self.vx = -self.vx * 1.05; self.vy += (self.y - (p2.y + PADDLE_H/2)) * 0.2
        
        if self.x < 0: p2.score += 1; self.reset(); return "P2"
        if self.x > WIDTH: p1.score += 1; self.reset(); return "P1"
        return None
    def draw(self, d): d.fill_rect(int(self.x)+1, int(self.y), 2, 4, 1); d.fill_rect(int(self.x), int(self.y)+1, 4, 2, 1)

def run_game(display, get_keys):
    """Main game loop for Retro Paddle."""
    p1, p2, ball, state = Paddle(1), Paddle(WIDTH - 1 - PADDLE_W), Ball(), "START"
    high_score = utils.get_high_score("retro_paddle")
    
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            display.fill(0); utils.draw_text(display, "RETRO PADDLE", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35); utils.draw_text(display, "CENTER TO START", 35, 50); display.show()
            if (1, 1) in keys: state = "PLAYING"; p1.score = 0; p2.score = 0; ball.reset(); time.sleep(0.3)
            
        elif state == "PLAYING":
            if (1, 1) in keys: state = "PAUSED"; time.sleep(0.3); continue
            if (0, 0) in keys: p1.move(-5)
            if (2, 0) in keys: p1.move(5)
            
            # P2 Controls or AI
            if (0, 2) in keys: p2.move(-5)
            elif (2, 2) in keys: p2.move(5)
            else:
                if ball.vx > 0 and ball.x > WIDTH // 2:
                    target = ball.y - PADDLE_H // 2
                    if abs(p2.y - target) > 2:
                        if p2.y > target: p2.move(-2)
                        else: p2.move(2)
            
            ball.update(p1, p2)
            if p1.score >= 5 or p2.score >= 5:
                state = "GAMEOVER"; utils.save_high_score("retro_paddle", max(p1.score, p2.score)); high_score = utils.get_high_score("retro_paddle")
            
            display.fill(0); p1.draw(display); p2.draw(display); ball.draw(display)
            for y in range(0, HEIGHT, 4): display.pixel(WIDTH // 2, y, 1)
            utils.draw_text(display, str(p1.score), 40, 5); utils.draw_text(display, str(p2.score), 80, 5); display.show()
            
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            winner = "P1 WINS" if p1.score >= 5 else "P2 WINS"
            utils.draw_text(display, winner, 40, 30); utils.draw_text(display, f"HIGH: {high_score}", 40, 42)
            utils.draw_text(display, "CENTER TO RESTART", 30, 54); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
