import time
import random
import utils

# --- Game Logic ---
WIDTH = 128
HEIGHT = 64
PADDLE_W = 3
PADDLE_H = 16
BALL_SIZE = 3

class Paddle:
    def __init__(self, x):
        self.x = x
        self.y = HEIGHT // 2 - PADDLE_H // 2
        self.score = 0
    def move(self, dy):
        self.y = max(0, min(HEIGHT - PADDLE_H, self.y + dy))
    def draw(self, d):
        d.fill_rect(int(self.x), int(self.y), PADDLE_W, PADDLE_H, 1)

class Ball:
    def __init__(self): self.reset()
    def reset(self):
        self.x = WIDTH // 2
        self.y = HEIGHT // 2
        self.vx = 2 if random.random() > 0.5 else -2
        self.vy = (random.random() - 0.5) * 4
    def update(self, p1, p2):
        self.x += self.vx
        self.y += self.vy
        if self.y <= 0 or self.y >= HEIGHT - BALL_SIZE: self.vy = -self.vy
        if self.vx < 0:
            if self.x <= p1.x + PADDLE_W and p1.y <= self.y <= p1.y + PADDLE_H:
                self.vx = -self.vx * 1.1; self.vy += (self.y - (p1.y + PADDLE_H/2)) * 0.2
        else:
            if self.x >= p2.x - BALL_SIZE and p2.y <= self.y <= p2.y + PADDLE_H:
                self.vx = -self.vx * 1.1; self.vy += (self.y - (p2.y + PADDLE_H/2)) * 0.2
        if self.x < 0:
            p2.score += 1; self.reset(); return "P2"
        if self.x > WIDTH:
            p1.score += 1; self.reset(); return "P1"
        return None
    def draw(self, d):
        d.fill_rect(int(self.x), int(self.y), BALL_SIZE, BALL_SIZE, 1)

def run_game(display, get_keys):
    p1 = Paddle(1)
    p2 = Paddle(WIDTH - 1 - PADDLE_W)
    ball = Ball()
    state = "START"

    while True:
        keys = get_keys()
        # HOME COMBO: Top-Left + Top-Right
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "PONG", 40, 15, scale=2)
            utils.draw_text(display, "CENTER TO START", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; p1.score = 0; p2.score = 0; ball.reset(); time.sleep(0.3)

        elif state == "PLAYING":
            if (1, 1) in keys: state = "PAUSED"; time.sleep(0.3); continue
            if (0, 1) in keys: state = "START"; time.sleep(0.3); continue

            if (0, 0) in keys: p1.move(-5)
            if (2, 0) in keys: p1.move(5)
            if (0, 2) in keys: p2.move(-5)
            elif (2, 2) in keys: p2.move(5)
            else:
                if ball.vx > 0 and ball.x > WIDTH // 2:
                    target_y = ball.y - PADDLE_H // 2
                    if abs(p2.y - target_y) > 2:
                        if p2.y > target_y: p2.move(-2)
                        else: p2.move(2)

            ball.update(p1, p2)
            if p1.score >= 5 or p2.score >= 5: state = "GAMEOVER"

            display.fill(0)
            p1.draw(display)
            p2.draw(display)
            ball.draw(display)
            for y in range(0, HEIGHT, 4): display.pixel(WIDTH // 2, y, 1)
            utils.draw_text(display, str(p1.score), WIDTH // 2 - 15, 5)
            utils.draw_text(display, str(p2.score), WIDTH // 2 + 10, 5)
            display.show()

        elif state == "PAUSED":
            display.fill(0)
            utils.draw_text(display, "PAUSED", 40, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "PLAYING"; time.sleep(0.3)
            if (0, 1) in keys: state = "START"; time.sleep(0.3)

        elif state == "GAMEOVER":
            display.fill(0)
            winner = "P1 WINS" if p1.score >= 5 else "P2 WINS"
            utils.draw_text(display, winner, 35, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
