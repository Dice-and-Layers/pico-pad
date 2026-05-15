import time
import random
import utils

WIDTH = 128
HEIGHT = 64
PADDLE_W = 20
PADDLE_H = 3
BALL_SIZE = 2
BRICK_W = 14
BRICK_H = 4

def run_game(display, get_keys):
    paddle_x = WIDTH // 2 - PADDLE_W // 2
    ball_x, ball_y = WIDTH // 2, HEIGHT - 10
    ball_vx, ball_vy = 2, -2
    bricks = []
    for r in range(3):
        for c in range(8):
            bricks.append([c * (BRICK_W + 2) + 2, r * (BRICK_H + 2) + 10, True])
    score = 0
    state = "START"

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "BREAKOUT", 25, 15, scale=2)
            utils.draw_text(display, "CENTER TO START", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; score = 0; ball_x, ball_y = WIDTH // 2, HEIGHT - 10; ball_vx, ball_vy = 2, -2
                for b in bricks: b[2] = True
                time.sleep(0.3)

        elif state == "PLAYING":
            if (1, 0) in keys: paddle_x = max(0, paddle_x - 4)
            if (1, 2) in keys: paddle_x = min(WIDTH - PADDLE_W, paddle_x + 4)

            ball_x += ball_vx
            ball_y += ball_vy

            if ball_x <= 0 or ball_x >= WIDTH - BALL_SIZE: ball_vx = -ball_vx
            if ball_y <= 0: ball_vy = -ball_vy
            
            # Paddle collision
            if ball_y >= HEIGHT - PADDLE_H - BALL_SIZE and paddle_x <= ball_x <= paddle_x + PADDLE_W:
                ball_vy = -abs(ball_vy)
                ball_vx += (ball_x - (paddle_x + PADDLE_W/2)) * 0.4

            # Brick collision
            for b in bricks:
                if b[2]:
                    if b[0] <= ball_x <= b[0] + BRICK_W and b[1] <= ball_y <= b[1] + BRICK_H:
                        b[2] = False
                        ball_vy = -ball_vy
                        score += 10
                        break

            if ball_y > HEIGHT:
                state = "GAMEOVER"; time.sleep(0.5)

            if not any(b[2] for b in bricks):
                state = "GAMEOVER" # Win condition (simplified)

            display.fill(0)
            display.fill_rect(paddle_x, HEIGHT - PADDLE_H, PADDLE_W, PADDLE_H, 1)
            display.fill_rect(int(ball_x), int(ball_y), BALL_SIZE, BALL_SIZE, 1)
            for b in bricks:
                if b[2]: display.rect(b[0], b[1], BRICK_W, BRICK_H, 1)
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
