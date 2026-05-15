"""
PRIMAL DASH - Ancient Runner Game
---------------------------------
An endless runner set in a primitive world. Jump over hazards to maintain 
momentum and increase your score. Fast-paced action with snappy controls.

Controls:
- CENTER: Jump over obstacles.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT, GROUND_Y, DINO_SCALE = 128, 64, 58, 2

def run_game(display, get_keys):
    """
    Main entry point for the Primal Dash game.
    Manages the runner's jump physics, obstacle spawning, and parallax movement.
    """
    # dino_y: vertical position of the runner
    # dino_v: vertical velocity (for jumping)
    # obstacles: list of [x, y] for active hazards
    dino_y, dino_v, score, state = GROUND_Y - 16, 0, 0, "START"
    obstacles = [[128, GROUND_Y - 16]]
    last_score_time = time.monotonic()
    high_score = utils.get_high_score("primal_dash")
    
    while True:
        keys = get_keys()
        # Standard Exit Combo: Top-Left + Top-Right
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            # Display Start Screen
            display.fill(0)
            utils.draw_text(display, "PRIMAL DASH", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            
            if (1, 1) in keys: # Center button to start
                state, score = "PLAYING", 0
                dino_y, dino_v = GROUND_Y - 16, 0
                obstacles = [[128, GROUND_Y - 16]]
                time.sleep(0.3)
                
        elif state == "PLAYING":
            # Snappy jump physics: gravity and velocity
            if (1, 1) in keys and dino_y == GROUND_Y - 16: 
                dino_v = -10 # Initial jump force
                
            dino_y += dino_v
            dino_v += 1.5 # Gravity constant
            
            # Floor collision
            if dino_y > GROUND_Y - 16: 
                dino_y, dino_v = GROUND_Y - 16, 0
            
            # Obstacle Logic
            for obs in obstacles:
                obs[0] -= 5 # Obstacles move toward the player
                
                # Broad collision box for scaled icons (16x16)
                # Player is at X=20
                if obs[0] < 20 + 12 and obs[0] + 12 > 20:
                    if dino_y + 16 > obs[1]:
                        state = "GAMEOVER"
                        utils.save_high_score("primal_dash", score)
                        high_score = utils.get_high_score("primal_dash")
                        time.sleep(0.5)
            
            # Spawn new obstacles at varying distances
            if obstacles[-1][0] < 128 - random.randint(50, 90): 
                obstacles.append([128, GROUND_Y - 16])
            
            # Clean up off-screen obstacles
            if obstacles[0][0] < -20: 
                obstacles.pop(0)
            
            # Score accumulates over time (10 points per second)
            if time.monotonic() - last_score_time > 0.1: 
                score += 1
                last_score_time = time.monotonic()
            
            # Rendering
            display.fill(0)
            display.hline(0, GROUND_Y, 128, 1) # Ground line
            
            # Render scaled primitive icons
            utils.draw_icon(display, 'DINO', 20, int(dino_y), scale=DINO_SCALE)
            for obs in obstacles: 
                utils.draw_icon(display, 'CACTUS', obs[0], obs[1], scale=DINO_SCALE)
            
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

