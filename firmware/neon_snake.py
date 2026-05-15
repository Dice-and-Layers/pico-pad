"""
NEON SNAKE - Classic Slither Game
---------------------------------
A survival game where the player controls a growing snake. Collect food to 
increase length and score. Avoid colliding with walls or yourself.

Controls:
- UP/DOWN/LEFT/RIGHT: Change direction of the snake.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, BLOCK = 128, 64, 8

def run_game(display, get_keys):
    """
    Main entry point for the Neon Snake game.
    Manages the snake's body, movement direction, food spawning, and collisions.
    """
    # snake: list of (x, y) coordinates representing the snake's segments
    # dir: current movement vector (dx, dy)
    snake = [(5, 4), (4, 4), (3, 4)]
    dir, food, score = (1, 0), (10, 4), 0
    state, last_move = "START", time.monotonic()
    high_score = utils.get_high_score("neon_snake")

    while True:
        keys = get_keys()
        # Standard Exit Combo: Top-Left + Top-Right
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            # Display Start Screen
            display.fill(0)
            utils.draw_text(display, "NEON SNAKE", 30, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            
            if (1, 1) in keys: # Center button to start
                state, score = "PLAYING", 0
                snake = [(5, 4), (4, 4), (3, 4)]
                dir = (1, 0)
                time.sleep(0.3)
                
        elif state == "PLAYING":
            # Directional Controls
            # Prevents reversing directly into oneself
            if (0, 1) in keys and dir != (0, 1): dir = (0, -1) # UP
            if (2, 1) in keys and dir != (0, -1): dir = (0, 1) # DOWN
            if (1, 0) in keys and dir != (1, 0): dir = (-1, 0) # LEFT
            if (1, 2) in keys and dir != (-1, 0): dir = (1, 0) # RIGHT
            
            # Difficulty scales with score (faster movement)
            speed = max(0.05, 0.2 - (score // 5) * 0.02)
            
            if time.monotonic() - last_move > speed:
                # Calculate new head position
                head = (snake[0][0] + dir[0], snake[0][1] + dir[1])
                
                # Check for boundary collisions
                is_out = head[0] < 0 or head[0] >= WIDTH//BLOCK or head[1] < 0 or head[1] >= HEIGHT//BLOCK
                
                # Check for self-collision or boundary
                if is_out or head in snake:
                    state = "GAMEOVER"
                    utils.save_high_score("neon_snake", score)
                    high_score = utils.get_high_score("neon_snake")
                    time.sleep(0.5)
                else:
                    snake.insert(0, head) # Add new head
                    # Check if food is eaten
                    if head == food:
                        score += 1
                        # Spawn new food at random empty location
                        food = (random.randint(0, WIDTH//BLOCK-1), random.randint(0, HEIGHT//BLOCK-1))
                    else: 
                        snake.pop() # Remove tail if no food eaten
                last_move = time.monotonic()
            
            # Rendering
            display.fill(0)
            for i, b in enumerate(snake):
                if i == 0: 
                    # Draw head with a specific icon
                    utils.draw_icon(display, 'SNAKE_HEAD', b[0]*BLOCK, b[1]*BLOCK)
                else: 
                    # Draw body segments as filled rectangles
                    display.fill_rect(b[0]*BLOCK + 1, b[1]*BLOCK + 1, BLOCK-2, BLOCK-2, 1)
            
            # Draw food item
            utils.draw_icon(display, 'FOOD', food[0]*BLOCK, food[1]*BLOCK)
            
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
            
            if (1, 1) in keys: # Restart
                state = "START"
                time.sleep(0.3)
            if (0, 1) in keys: # Exit to launcher
                return
        time.sleep(0.01)

