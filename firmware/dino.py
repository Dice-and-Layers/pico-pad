import time
import random
import utils

WIDTH, HEIGHT, GROUND_Y, DINO_SCALE = 128, 64, 58, 2

def run_game(display, get_keys):
    dino_y, dino_v, score, state = GROUND_Y - 16, 0, 0, "START"
    obstacles = [[128, GROUND_Y - 16]]
    last_score_time = time.monotonic()
    high_score = utils.get_high_score("dino")
    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return
        if state == "START":
            display.fill(0); utils.draw_text(display, "DINO RUN", 35, 15, scale=2)
            utils.draw_text(display, f"HI:{high_score}", 50, 35); utils.draw_text(display, "CENTER TO START", 35, 50); display.show()
            if (1, 1) in keys: state, score, dino_y, dino_v, obstacles = "PLAYING", 0, GROUND_Y - 16, 0, [[128, GROUND_Y - 16]]; time.sleep(0.3)
        elif state == "PLAYING":
            if (1, 1) in keys and dino_y == GROUND_Y - 16: dino_v = -10
            dino_y += dino_v; dino_v += 1.5
            if dino_y > GROUND_Y - 16: dino_y, dino_v = GROUND_Y - 16, 0
            for obs in obstacles:
                obs[0] -= 5
                if obs[0] < 20 + 12 and obs[0] + 12 > 20:
                    if dino_y + 16 > obs[1]:
                        state = "GAMEOVER"; utils.save_high_score("dino", score); high_score = utils.get_high_score("dino"); time.sleep(0.5)
            if obstacles[-1][0] < 128 - random.randint(50, 90): obstacles.append([128, GROUND_Y - 16])
            if obstacles[0][0] < -20: obstacles.pop(0)
            if time.monotonic() - last_score_time > 0.1: score += 1; last_score_time = time.monotonic()
            display.fill(0); display.hline(0, GROUND_Y, 128, 1)
            utils.draw_icon(display, 'DINO', 20, int(dino_y), scale=DINO_SCALE)
            for obs in obstacles: utils.draw_icon(display, 'CACTUS', obs[0], obs[1], scale=DINO_SCALE)
            utils.draw_text(display, f"SC:{score}", 0, 0); display.show()
        elif state == "GAMEOVER":
            display.fill(0); utils.draw_text(display, "GAME OVER", 20, 10, scale=2)
            utils.draw_text(display, f"SCORE: {score}", 35, 30); utils.draw_text(display, f"HIGH: {high_score}", 35, 42)
            utils.draw_text(display, "CENTER TO RESTART", 30, 54); display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
