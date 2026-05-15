"""
ALIEN SIEGE - Planetary Defense Game
------------------------------------
Defend your base from a wave of descending extraterrestrial threats. 
Move and fire to eliminate all hostiles before they reach your position.

Controls:
- LEFT/RIGHT: Move the defender ship.
- CENTER: Fire a projectile.
- UP: Pause game (handled by standard launcher if applicable).
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
WIDTH, HEIGHT = 128, 64

def run_game(display, get_keys):
    """
    Main entry point for the Alien Siege game.
    Manages the game state, player movement, alien wave mechanics, and collisions.
    """
    # player_x: horizontal position of the defender
    # aliens: list of [x, y, direction] for each alien
    # bullets: list of [x, y] for active projectiles
    player_x, aliens, bullets, score, state, last_fire, last_alien_move = WIDTH // 2, [], [], 0, "START", 0, 0
    
    # Initialize the wave of aliens in a grid (3 rows, 8 columns)
    for r in range(3):
        for c in range(8): 
            aliens.append([c * 12 + 10, r * 10 + 10, 1]) # [x, y, movement_direction]
            
    high_score = utils.get_high_score("alien_siege")
    
    while True:
        keys = get_keys()
        # Standard Exit Combo: Top-Left + Top-Right
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            # Display Start Screen
            display.fill(0)
            utils.draw_text(display, "ALIEN SIEGE", 25, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            
            if (1, 1) in keys: # Center button to start
                state, score, player_x, bullets = "PLAYING", 0, WIDTH // 2, []
                # Re-initialize aliens
                aliens = [[c * 12 + 10, r * 10 + 10, 1] for r in range(3) for c in range(8)]
                time.sleep(0.3)
                
        elif state == "PLAYING":
            # Player Controls
            if (1, 0) in keys: player_x = max(0, player_x - 3) # Move Left
            if (1, 2) in keys: player_x = min(WIDTH - 8, player_x + 3) # Move Right
            
            # Firing Logic: Only one bullet allowed every 0.4 seconds
            if (1, 1) in keys and time.monotonic() - last_fire > 0.4: 
                bullets.append([player_x + 4, HEIGHT - 10])
                last_fire = time.monotonic()
            
            # Alien Wave Movement: Moves every 0.5 seconds
            if time.monotonic() - last_alien_move > 0.5:
                shift_down = False
                for a in aliens:
                    a[0] += 4 * a[2] # Move horizontally
                    # Check for wall collisions to trigger descent
                    if a[0] < 5 or a[0] > WIDTH - 15: shift_down = True
                
                if shift_down:
                    for a in aliens: 
                        a[2] *= -1 # Reverse direction
                        a[1] += 4   # Move down
                last_alien_move = time.monotonic()
            
            # Bullet Physics and Collision Detection
            for b in bullets[:]:
                b[1] -= 4 # Bullets travel upward
                if b[1] < 0: 
                    bullets.remove(b) # Remove if off-screen
                else:
                    # Check collision with each alien
                    for a in aliens[:]:
                        if a[0] <= b[0] <= a[0] + 8 and a[1] <= b[1] <= a[1] + 8:
                            aliens.remove(a)
                            if b in bullets: bullets.remove(b)
                            score += 10
                            break
            
            # Win/Loss Conditions
            # Game Over if no aliens left (Win) or aliens reach the base (Loss)
            if not aliens or any(a[1] > HEIGHT - 15 for a in aliens):
                state = "GAMEOVER"
                utils.save_high_score("alien_siege", score)
                high_score = utils.get_high_score("alien_siege")
            
            # Rendering
            display.fill(0)
            utils.draw_icon(display, 'SHIP', player_x, HEIGHT - 10) # Player
            for a in aliens: utils.draw_icon(display, 'ALIEN', a[0], a[1]) # Aliens
            for b in bullets: display.fill_rect(int(b[0]), int(b[1]), 1, 3, 1) # Bullets
            
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

