import time
import random
import utils

COLS, ROWS, BLOCK = 10, 20, 3
BOARD_X, BOARD_Y = (128 - (COLS * BLOCK)) // 2, 2
SHAPES = [[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]]

class Tetris:
    def __init__(self): self.reset()
    def reset(self): self.grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]; self.new_piece(); self.score, self.game_over = 0, False
    def new_piece(self):
        self.piece = random.choice(SHAPES); self.px, self.py = COLS // 2 - len(self.piece[0]) // 2, 0
        if self.check_collision(self.px, self.py, self.piece): self.game_over = True
    def rotate_piece(self):
        new = [[self.piece[y][x] for y in range(len(self.piece)-1,-1,-1)] for x in range(len(self.piece[0]))]
        if not self.check_collision(self.px, self.py, new): self.piece = new
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
                if self.piece[py][px]: self.grid[self.py+py][self.px+px] = 1
        self.clear_lines(); self.new_piece()
    def clear_lines(self):
        new = [r for r in self.grid if not all(r)]; cleared = ROWS - len(new); self.score += [0,10,30,60,100][cleared]
        for _ in range(cleared): new.insert(0, [0 for _ in range(COLS)]); self.grid = new
    def move(self, dx, dy):
        if not self.check_collision(self.px+dx, self.py+dy, self.piece): self.px, self.py = self.px+dx, self.py+dy; return True
        elif dy > 0: self.lock_piece(); return False
    def draw_block(self, d, x, y):
        # Textured Block
        d.fill_rect(BOARD_X + x*BLOCK, BOARD_Y + y*BLOCK, BLOCK, BLOCK, 1)
        d.pixel(BOARD_X + x*BLOCK + 1, BOARD_Y + y*BLOCK + 1, 0)
    def draw(self, d):
        d.rect(BOARD_X-1, BOARD_Y-1, COLS*BLOCK+2, ROWS*BLOCK+2, 1)
        for y in range(ROWS):
            for x in range(COLS):
                if self.grid[y][x]: self.draw_block(d, x, y)
        if not self.game_over:
            for y in range(len(self.piece)):
                for x in range(len(self.piece[0])):
                    if self.piece[y][x]: self.draw_block(d, self.px+x, self.py+y)
        utils.draw_text(d, f"SC:{self.score}", 0, 0)

def run_game(display, get_keys):
    game, last_fall, last_in, state = Tetris(), time.monotonic(), 0, "START"
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        if state == "START":
            display.fill(0); utils.draw_text(display, "TETRIS", 35, 15, scale=2); utils.draw_text(display, "CENTER TO START", 35, 45); display.show()
            if (1, 1) in keys: game.reset(); state = "PLAYING"; time.sleep(0.3)
        elif state == "PLAYING":
            now = time.monotonic()
            if (1, 1) in keys and now - last_in > 0.2: game.rotate_piece(); last_in = now
            if (1, 0) in keys and now - last_in > 0.15: game.move(-1, 0); last_in = now
            if (1, 2) in keys and now - last_in > 0.15: game.move(1, 0); last_in = now
            if (2, 1) in keys: game.move(0, 1)
            if (0, 1) in keys: state, last_in = "PAUSED", now; time.sleep(0.3)
            if now - last_fall > max(0.1, 0.6 - (game.score // 100) * 0.05): game.move(0, 1); last_fall = now
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
