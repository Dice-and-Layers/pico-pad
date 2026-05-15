import time
import random
import utils

WIDTH = 128
HEIGHT = 64
BIRD_SIZE = 8
GRAVITY = 0.5
JUMP = -3.5
PIPE_W = 12
GAP = 28

def run_game(display, get_keys):
    bird_y = HEIGHT // 2
    bird_v = 0
    pipes = [[128, random.randint(10, 30)]]
    score = 0
    state = "START"

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "FLAPPY", 40, 15, scale=2)
            utils.draw_text(display, "CENTER TO JUMP", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; bird_y = HEIGHT // 2; bird_v = 0; pipes = [[128, random.randint(10, 30)]]; score = 0; time.sleep(0.3)

        elif state == "PLAYING":
            if (1, 1) in keys: bird_v = JUMP
            
            bird_v += GRAVITY
            bird_y += bird_v
            
            if bird_y < 0 or bird_y > HEIGHT - BIRD_SIZE: state = "GAMEOVER"; time.sleep(0.5)

            for p in pipes:
                p[0] -= 2
                if p[0] < 20 + BIRD_SIZE and p[0] + PIPE_W > 20:
                    if bird_y < p[1] or bird_y + BIRD_SIZE > p[1] + GAP:
                        state = "GAMEOVER"; time.sleep(0.5)
                if p[0] == 20: score += 1

            if pipes[-1][0] < 80:
                pipes.append([128, random.randint(10, 30)])
            if pipes[0][0] < -PIPE_W:
                pipes.pop(0)

            display.fill(0)
            # Draw Bird Icon
            utils.draw_icon(display, 'BIRD', 20, int(bird_y))
            # Draw Textured Pipes
            for p in pipes:
                display.fill_rect(p[0], 0, PIPE_W, p[1], 1)
                display.fill_rect(p[0]-1, p[1]-3, PIPE_W+2, 3, 1) # Pipe cap
                display.fill_rect(p[0], p[1] + GAP, PIPE_W, HEIGHT - p[1] - GAP, 1)
                display.fill_rect(p[0]-1, p[1] + GAP, PIPE_W+2, 3, 1) # Pipe cap
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.02)
