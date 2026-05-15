"""
WINGED JUMP - Aerial Navigation Game
------------------------------------
Control a winged creature to navigate through a series of narrow obstacles. 
Timing and gravity management are key to survival.

Controls:
- CENTER: Flap wings to fly higher.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
# BIRD_SIZE: Dimensions of the bird icon
# GRAVITY: Downward acceleration
# JUMP: Upward velocity on flap
# PIPE_W: Width of the obstacles
# GAP: Size of the opening the bird must pass through
WIDTH, HEIGHT, BIRD_SIZE, GRAVITY, JUMP, PIPE_W, GAP = 128, 64, 8, 0.5, -3.5, 12, 28

def run_game(display, get_keys):
    """
    Main entry point for the Winged Jump game.
    Manages the bird's physics, pipe spawning, and collision detection.
    """
    # bird_y: vertical position of the bird
    # bird_v: vertical velocity
    # pipes: list of [x, gap_y] for active obstacles
    bird_y, bird_v, score, state = HEIGHT // 2, 0, 0, "START"
    pipes = [[128, random.randint(10, 30)]]
    high_score = utils.get_high_score("winged_jump")
    
    while True:
        keys = get_keys()
        # Standard Exit Combo
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            # Display Start Screen
            display.fill(0)
            utils.draw_text(display, "WINGED JUMP", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO JUMP", 35, 50)
            display.show()
            
            if (1, 1) in keys: # Center button to start
                state, score = "PLAYING", 0
                bird_y, bird_v = HEIGHT // 2, 0
                pipes = [[128, random.randint(10, 30)]]
                time.sleep(0.3)
                
        elif state == "PLAYING":
            # Flap Controls
            if (1, 1) in keys: 
                bird_v = JUMP # Apply upward force
                
            bird_v += GRAVITY
            bird_y += bird_v
            
            # Boundary Collisions (Floor and Ceiling)
            if bird_y < 0 or bird_y > HEIGHT - BIRD_SIZE: 
                state = "GAMEOVER"
                utils.save_high_score("winged_jump", score)
                high_score = utils.get_high_score("winged_jump")
                time.sleep(0.5)
            
            # Pipe Logic
            for p in pipes:
                p[0] -= 2 # Pipes move left
                
                # Collision detection: check if bird is within pipe's horizontal range
                if p[0] < 20 + BIRD_SIZE and p[0] + PIPE_W > 20:
                    # Check if bird hit the top or bottom pipe
                    if bird_y < p[1] or bird_y + BIRD_SIZE > p[1] + GAP:
                        state = "GAMEOVER"
                        utils.save_high_score("winged_jump", score)
                        high_score = utils.get_high_score("winged_jump")
                        time.sleep(0.5)
                
                # Scoring: increment when passing a pipe
                if p[0] == 20: 
                    score += 1
            
            # Generate new pipes at intervals
            if pipes[-1][0] < 80: 
                pipes.append([128, random.randint(10, 30)])
            
            # Clean up off-screen pipes
            if pipes[0][0] < -PIPE_W: 
                pipes.pop(0)
            
            # Rendering
            display.fill(0)
            # Draw the bird
            utils.draw_icon(display, 'BIRD', 20, int(bird_y))
            
            for p in pipes:
                # Draw pipes with distinct caps
                # Top Pipe
                display.fill_rect(p[0], 0, PIPE_W, p[1], 1)
                display.fill_rect(p[0]-1, p[1]-3, PIPE_W+2, 3, 1)
                # Bottom Pipe
                display.fill_rect(p[0], p[1] + GAP, PIPE_W, HEIGHT - p[1] - GAP, 1)
                display.fill_rect(p[0]-1, p[1] + GAP, PIPE_W+2, 3, 1)
            
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

