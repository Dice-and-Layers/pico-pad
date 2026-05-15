import time
import random
import utils

WIDTH, HEIGHT, BIRD_SIZE, GRAVITY, JUMP, PIPE_W, GAP = 128, 64, 8, 0.5, -3.5, 12, 28

def run_game(display, get_keys):
    bird_y, bird_v, score, state = HEIGHT // 2, 0, 0, "START"
    pipes = [[128, random.randint(10, 30)]]
    high_score = utils.get_high_score("flappy")
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        if state == "START":
            display.fill(0); utils.draw_text(display, "FLAPPY", 40, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35); utils.draw_text(display, "CENTER TO JUMP", 35, 50); display.show()
            if (1, 1) in keys: state, bird_y, bird_v, pipes, score = "PLAYING", HEIGHT // 2, 0, [[128, random.randint(10, 30)]], 0; time.sleep(0.3)
        elif state == "PLAYING":
            if (1, 1) in keys: bird_v = JUMP
            bird_v += GRAVITY; bird_y += bird_v
            if bird_y < 0 or bird_y > HEIGHT - BIRD_SIZE: state = "GAMEOVER"; utils.save_high_score("flappy", score); high_score = utils.get_high_score("flappy"); time.sleep(0.5)
            for p in pipes:
                p[0] -= 2
                if p[0] < 20 + BIRD_SIZE and p[0] + PIPE_W > 20:
                    if bird_y < p[1] or bird_y + BIRD_SIZE > p[1] + GAP:
                        state = "GAMEOVER"; utils.save_high_score("flappy", score); high_score = utils.get_high_score("flappy"); time.sleep(0.5)
                if p[0] == 20: score += 1
            if pipes[-1][0] < 80: pipes.append([128, random.randint(10, 30)])
            if pipes[0][0] < -PIPE_W: pipes.pop(0)
            display.fill(0); utils.draw_icon(display, 'BIRD', 20, int(bird_y))
            for p in pipes:
                display.fill_rect(p[0], 0, PIPE_W, p[1], 1); display.fill_rect(p[0]-1, p[1]-3, PIPE_W+2, 3, 1)
                display.fill_rect(p[0], p[1] + GAP, PIPE_W, HEIGHT - p[1] - GAP, 1); display.fill_rect(p[0]-1, p[1] + GAP, PIPE_W+2, 3, 1)
            utils.draw_text(display, f"SC:{score}", 0, 0); display.show()
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            utils.draw_text(display, f"SCORE: {score}", 35, 30); utils.draw_text(display, f"HIGH: {high_score}", 35, 42)
            utils.draw_text(display, "CENTER TO RESTART", 30, 54); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.02)
