import time
import random
import utils

# --- Tetris Logic ---
COLS = 10
ROWS = 20
BLOCK_SIZE = 3
BOARD_X = (128 - (COLS * BLOCK_SIZE)) // 2
BOARD_Y = 2

SHAPES = [
    [[1, 1, 1, 1]], # I
    [[1, 1], [1, 1]], # O
    [[0, 1, 0], [1, 1, 1]], # T
    [[0, 1, 1], [1, 1, 0]], # S
    [[1, 1, 0], [0, 1, 1]], # Z
    [[1, 0, 0], [1, 1, 1]], # J
    [[0, 0, 1], [1, 1, 1]]  # L
]

class Tetris:
    def __init__(self): self.reset()
    def reset(self):
        self.grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
        self.new_piece(); self.score = 0; self.game_over = False; self.paused = False
    def new_piece(self):
        self.piece = random.choice(SHAPES)
        self.px = COLS // 2 - len(self.piece[0]) // 2
        self.py = 0
        if self.check_collision(self.px, self.py, self.piece): self.game_over = True
    def rotate_piece(self):
        new_piece = [[self.piece[y][x] for y in range(len(self.piece)-1, -1, -1)] for x in range(len(self.piece[0]))]
        if not self.check_collision(self.px, self.py, new_piece): self.piece = new_piece
    def check_collision(self, x, y, piece):
        for py in range(len(piece)):
            for px in range(len(piece[0])):
                if piece[py][px]:
                    nx, ny = x + px, y + py
                    if nx < 0 or nx >= COLS or ny >= ROWS or (ny >= 0 and self.grid[ny][nx]): return True
        return False
    def lock_piece(self):
        for py in range(len(self.piece)):
            for px in range(len(self.piece[0])):
                if self.piece[py][px]:
                    if self.py + py >= 0: self.grid[self.py + py][self.px + px] = 1
        self.clear_lines(); self.new_piece()
    def clear_lines(self):
        new_grid = [row for row in self.grid if not all(row)]
        cleared = ROWS - len(new_grid)
        self.score += [0, 10, 30, 60, 100][cleared]
        for _ in range(cleared): new_grid.insert(0, [0 for _ in range(COLS)])
        self.grid = new_grid
    def move(self, dx, dy):
        if not self.check_collision(self.px + dx, self.py + dy, self.piece):
            self.px += dx; self.py += dy; return True
        elif dy > 0: self.lock_piece()
        return False
    def draw(self, d):
        d.rect(BOARD_X-1, BOARD_Y-1, COLS*BLOCK_SIZE+2, ROWS*BLOCK_SIZE+2, 1)
        for y in range(ROWS):
            for x in range(COLS):
                if self.grid[y][x]: d.fill_rect(BOARD_X + x*BLOCK_SIZE, BOARD_Y + y*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1, 1)
        if not self.game_over:
            for y in range(len(self.piece)):
                for x in range(len(self.piece[0])):
                    if self.piece[y][x]: d.fill_rect(BOARD_X + (self.px + x)*BLOCK_SIZE, BOARD_Y + (self.py + y)*BLOCK_SIZE, BLOCK_SIZE-1, BLOCK_SIZE-1, 1)
        utils.draw_text(d, f"SC:{self.score}", 0, 0)

def run_game(display, get_keys):
    game = Tetris(); last_fall = time.monotonic(); last_input = 0; state = "START"
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return # HOME COMBO
        if state == "START":
            display.fill(0); utils.draw_text(display, "TETRIS", 35, 15, scale=2)
            utils.draw_text(display, "CENTER TO START", 35, 45); display.show()
            if (1, 1) in keys: game.reset(); state = "PLAYING"; time.sleep(0.3)
        elif state == "PLAYING":
            if (1, 1) in keys and now - last_input > 0.2: game.rotate_piece(); last_input = now
            if (1, 0) in keys and now - last_input > 0.15: game.move(-1, 0); last_input = now
            if (1, 2) in keys and now - last_input > 0.15: game.move(1, 0); last_input = now
            if (2, 1) in keys: game.move(0, 1)
            if (0, 1) in keys: state = "PAUSED"; time.sleep(0.3)
            now = time.monotonic()
            fall_speed = max(0.1, 0.6 - (game.score // 100) * 0.05)
            if now - last_fall > fall_speed: game.move(0, 1); last_fall = now
            if game.game_over: state = "GAMEOVER"
            display.fill(0); game.draw(display); display.show()
        elif state == "PAUSED":
            display.fill(0); utils.draw_text(display, "PAUSED", 40, 25, scale=2); display.show()
            if (1, 1) in keys: state = "PLAYING"; time.sleep(0.3)
            if (0, 1) in keys: state = "START"; time.sleep(0.3)
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 30, 25, scale=2); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
