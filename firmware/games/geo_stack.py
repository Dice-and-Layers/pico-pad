"""
GEO STACK - Block Alignment Game
--------------------------------
A puzzle game where the player must align falling shapes to clear horizontal 
lines. Includes rotation and gravity mechanics.

Controls:
- LEFT/RIGHT: Move the falling piece.
- CENTER: Rotate the piece.
- DOWN: Accelerate fall.
- UP: Pause the game.
- EXIT: Press (0,0) and (0,2) simultaneously to exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""

import time
import random
import utils

# --- Constants ---
# COLS/ROWS: Grid dimensions
# BLOCK: Size of each square block in pixels
COLS, ROWS, BLOCK = 10, 20, 3
BOARD_X, BOARD_Y = (128 - (COLS * BLOCK)) // 2, 2
# SHAPES: Matrix representations of Tetrominoes
SHAPES = [
    [[1,1,1,1]], # I
    [[1,1],[1,1]], # O
    [[0,1,0],[1,1,1]], # T
    [[0,1,1],[1,1,0]], # S
    [[1,1,0],[0,1,1]], # Z
    [[1,0,0],[1,1,1]], # L
    [[0,0,1],[1,1,1]]  # J
]

class StackGame:
    """Core logic for the block stacking game."""
    def __init__(self): 
        self.reset()
        
    def reset(self): 
        """Reset the game board and state."""
        self.grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
        self.new_piece()
        self.score, self.game_over = 0, False
        
    def new_piece(self):
        """Spawn a new random piece at the top."""
        self.piece = random.choice(SHAPES)
        self.px, self.py = COLS // 2 - len(self.piece[0]) // 2, 0
        # If new piece immediately hits something, it's game over
        if self.check_collision(self.px, self.py, self.piece): 
            self.game_over = True
            
    def rotate_piece(self):
        """Rotate the current piece 90 degrees clockwise."""
        new = [[self.piece[y][x] for y in range(len(self.piece)-1,-1,-1)] for x in range(len(self.piece[0]))]
        if not self.check_collision(self.px, self.py, new): 
            self.piece = new
            
    def check_collision(self, x, y, piece):
        """Check if a piece at (x,y) collides with the grid or boundaries."""
        for py in range(len(piece)):
            for px in range(len(piece[0])):
                if piece[py][px]:
                    nx, ny = x + px, y + py
                    if nx < 0 or nx >= COLS or ny >= ROWS or (ny >= 0 and self.grid[ny][nx]): 
                        return True
        return False
        
    def lock_piece(self):
        """Place the piece into the static grid and check for cleared lines."""
        for py in range(len(self.piece)):
            for px in range(len(self.piece[0])):
                if self.piece[py][px]: 
                    self.grid[self.py+py][self.px+px] = 1
        self.clear_lines()
        self.new_piece()
        
    def clear_lines(self):
        """Remove full rows and update the score."""
        new = [r for r in self.grid if not all(r)]
        cleared = ROWS - len(new)
        # Score calculation: exponential increase for multiple lines
        self.score += [0, 10, 30, 60, 100][cleared]
        # Fill missing rows at the top
        for _ in range(cleared): 
            new.insert(0, [0 for _ in range(COLS)])
        self.grid = new
        
    def move(self, dx, dy):
        """Move the piece by (dx, dy). Lock if moving down hits something."""
        if not self.check_collision(self.px+dx, self.py+dy, self.piece): 
            self.px, self.py = self.px+dx, self.py+dy
            return True
        elif dy > 0: 
            self.lock_piece()
            return False
            
    def draw_block(self, d, x, y):
        """Draw a single 3x3 block with a small bevel effect."""
        d.fill_rect(BOARD_X + x*BLOCK, BOARD_Y + y*BLOCK, BLOCK, BLOCK, 1)
        d.pixel(BOARD_X + x*BLOCK + 1, BOARD_Y + y*BLOCK + 1, 0)
        
    def draw(self, d):
        """Render the board, grid, and active piece."""
        # Draw border
        d.rect(BOARD_X-1, BOARD_Y-1, COLS*BLOCK+2, ROWS*BLOCK+2, 1)
        # Draw settled blocks
        for y in range(ROWS):
            for x in range(COLS):
                if self.grid[y][x]: self.draw_block(d, x, y)
        # Draw active piece
        if not self.game_over:
            for y in range(len(self.piece)):
                for x in range(len(self.piece[0])):
                    if self.piece[y][x]: self.draw_block(d, self.px+x, self.py+y)
        # UI: Score (Larger)
        utils.draw_text(d, f"SC:{self.score}", 0, 0, scale=2)

def run_game(display, get_keys):
    """Main game loop for Geo Stack."""
    game, last_fall, last_in, state = StackGame(), time.monotonic(), 0, "START"
    high_score = utils.get_high_score("geo_stack")
    
    while True:
        keys = get_keys()
        # Exit Combo
        if (0, 0) in keys and (0, 2) in keys: return
        
        if state == "START":
            display.fill(0)
            utils.draw_text(display, "GEO STACK", 30, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35)
            utils.draw_text(display, "CENTER TO START", 35, 50)
            display.show()
            if (1, 1) in keys: 
                game.reset()
                state = "PLAYING"
                time.sleep(0.3)
            
        elif state == "PLAYING":
            now = time.monotonic()
            # Controls
            if (1, 1) in keys and now - last_in > 0.2: 
                game.rotate_piece()
                last_in = now
            if (1, 0) in keys and now - last_in > 0.15: 
                game.move(-1, 0)
                last_in = now
            if (1, 2) in keys and now - last_in > 0.15: 
                game.move(1, 0)
                last_in = now
            if (2, 1) in keys: 
                game.move(0, 1) # Soft drop
            if (0, 1) in keys: 
                state, last_in = "PAUSED", now
                time.sleep(0.3)
                
            # Gravity: Speed increases as score goes up
            speed = max(0.1, 0.6 - (game.score // 100) * 0.05)
            if now - last_fall > speed: 
                game.move(0, 1)
                last_fall = now
                
            if game.game_over:
                state = "GAMEOVER"
                utils.save_high_score("geo_stack", game.score)
                high_score = utils.get_high_score("geo_stack")
                
            display.fill(0)
            game.draw(display)
            display.show()
            
        elif state == "PAUSED":
            display.fill(0)
            utils.draw_text(display, "PAUSED", 40, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "PLAYING"; time.sleep(0.3)
            if (0, 1) in keys: state = "START"; time.sleep(0.3)
            
        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            # Larger score display
            utils.draw_text(display, f"SCORE: {game.score}", 24, 30, scale=2)
            utils.draw_text(display, f"HIGH: {high_score}", 35, 45)
            utils.draw_text(display, "CENTER TO RESTART", 30, 56)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)

