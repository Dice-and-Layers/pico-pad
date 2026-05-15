"""
WALL BUSTER - Brick Destruction Game
------------------------------------
A game where the player must bounce a ball to destroy a wall of bricks. 
Control the paddle to prevent the ball from falling.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, PADDLE_W, PADDLE_H, BALL_SIZE, BRICK_W, BRICK_H = 128, 64, 20, 4, 3, 14, 5

def run_game(display, get_keys):
    """Main game loop for Wall Buster."""
    p_x = WIDTH // 2 - PADDLE_W // 2
    b_x, b_y, b_vx, b_vy = WIDTH // 2, HEIGHT - 12, 2.5, -2.5
    bricks = [[c * (BRICK_W + 2) + 2, r * (BRICK_H + 2) + 12, True] for r in range(3) for c in range(8)]
    score, state = 0, "START"
    high_score = utils.get_high_score("wall_buster")
    
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            display.fill(0); utils.draw_text(display, "WALL BUSTER", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35); utils.draw_text(display, "CENTER TO START", 35, 50); display.show()
            if (1, 1) in keys: 
                state, score, b_x, b_y, b_vx, b_vy = "PLAYING", 0, WIDTH // 2, HEIGHT - 12, 2.5, -2.5
                for b in bricks: b[2] = True
                time.sleep(0.3)
                
        elif state == "PLAYING":
            if (1, 0) in keys: p_x = max(0, p_x - 4)
            if (1, 2) in keys: p_x = min(WIDTH - PADDLE_W, p_x + 4)
            b_x += b_vx; b_y += b_vy
            
            # Wall collisions
            if b_x <= 0 or b_x >= WIDTH - BALL_SIZE: b_vx = -b_vx
            if b_y <= 0: b_vy = -b_vy
            
            # Paddle collision with bounce angle adjustment
            if b_y >= HEIGHT - PADDLE_H - BALL_SIZE and p_x <= b_x <= p_x + PADDLE_W:
                b_vy = -abs(b_vy); b_vx += (b_x - (p_x + PADDLE_W/2)) * 0.4
            
            # Brick collision detection
            for b in bricks:
                if b[2] and b[0] <= b_x <= b[0] + BRICK_W and b[1] <= b_y <= b[1] + BRICK_H:
                    b[2] = False; b_vy = -b_vy; score += 10; break
            
            # Loss or Win conditions
            if b_y > HEIGHT or not any(b[2] for b in bricks):
                state = "GAMEOVER"; utils.save_high_score("wall_buster", score); high_score = utils.get_high_score("wall_buster"); time.sleep(0.5)
            
            display.fill(0)
            # Draw textured paddle
            display.fill_rect(p_x, HEIGHT - PADDLE_H, PADDLE_W, PADDLE_H, 1)
            display.hline(p_x, HEIGHT - PADDLE_H + 1, PADDLE_W, 0)
            # Draw rounded ball
            display.fill_rect(int(b_x)+1, int(b_y), 1, 3, 1); display.fill_rect(int(b_x), int(b_y)+1, 3, 1, 1)
            # Draw beveled bricks
            for b in bricks:
                if b[2]:
                    display.fill_rect(b[0], b[1], BRICK_W, BRICK_H, 1)
                    display.pixel(b[0]+1, b[1]+1, 0); display.pixel(b[0]+BRICK_W-2, b[1]+BRICK_H-2, 0)
            utils.draw_text(display, f"SC:{score}", 0, 0); display.show()
            
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            utils.draw_text(display, f"SCORE: {score}", 35, 30); utils.draw_text(display, f"HIGH: {high_score}", 35, 42)
            utils.draw_text(display, "CENTER TO RESTART", 30, 54); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
