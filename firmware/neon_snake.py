"""
NEON SNAKE - Classic Slither Game
---------------------------------
A survival game where the player controls a growing snake. Collect food to 
increase length and score. Avoid colliding with walls or yourself.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, BLOCK = 128, 64, 8

def run_game(display, get_keys):
    """Main game loop for Neon Snake."""
    snake = [(5, 4), (4, 4), (3, 4)]
    dir, food, score = (1, 0), (10, 4), 0
    state, last_move = "START", time.monotonic()
    high_score = utils.get_high_score("neon_snake")

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            display.fill(0); utils.draw_text(display, "NEON SNAKE", 30, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35); utils.draw_text(display, "CENTER TO START", 35, 50); display.show()
            if (1, 1) in keys: state, snake, dir, score = "PLAYING", [(5, 4), (4, 4), (3, 4)], (1, 0), 0; time.sleep(0.3)
            
        elif state == "PLAYING":
            # Input handling for 4 directions
            if (0, 1) in keys and dir != (0, 1): dir = (0, -1)
            if (2, 1) in keys and dir != (0, -1): dir = (0, 1)
            if (1, 0) in keys and dir != (1, 0): dir = (-1, 0)
            if (1, 2) in keys and dir != (-1, 0): dir = (1, 0)
            
            # Difficulty scales with score
            speed = max(0.05, 0.2 - (score // 5) * 0.02)
            if time.monotonic() - last_move > speed:
                head = (snake[0][0] + dir[0], snake[0][1] + dir[1])
                # Check for boundary or self collisions
                if head[0] < 0 or head[0] >= WIDTH//BLOCK or head[1] < 0 or head[1] >= HEIGHT//BLOCK or head in snake:
                    state = "GAMEOVER"; utils.save_high_score("neon_snake", score); high_score = utils.get_high_score("neon_snake"); time.sleep(0.5)
                else:
                    snake.insert(0, head)
                    if head == food:
                        score += 1; food = (random.randint(0, WIDTH//BLOCK-1), random.randint(0, HEIGHT//BLOCK-1))
                    else: snake.pop()
                last_move = time.monotonic()
            
            display.fill(0)
            for i, b in enumerate(snake):
                if i == 0: utils.draw_icon(display, 'SNAKE_HEAD', b[0]*BLOCK, b[1]*BLOCK)
                else: display.fill_rect(b[0]*BLOCK + 1, b[1]*BLOCK + 1, BLOCK-2, BLOCK-2, 1)
            utils.draw_icon(display, 'FOOD', food[0]*BLOCK, food[1]*BLOCK)
            utils.draw_text(display, f"SC:{score}", 0, 0); display.show()
            
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            utils.draw_text(display, f"SCORE: {score}", 35, 30); utils.draw_text(display, f"HIGH: {high_score}", 35, 42)
            utils.draw_text(display, "CENTER TO RESTART", 30, 54); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
