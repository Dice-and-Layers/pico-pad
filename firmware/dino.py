import time
import random
import utils

WIDTH = 128
HEIGHT = 64
GROUND_Y = 54

def run_game(display, get_keys):
    dino_y = GROUND_Y - 8
    dino_v = 0
    obstacles = [[128, GROUND_Y - 8]]
    score = 0
    state = "START"
    last_score_time = time.monotonic()

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "DINO RUN", 35, 15, scale=2)
            utils.draw_text(display, "CENTER TO JUMP", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; score = 0; dino_y = GROUND_Y - 8; dino_v = 0; obstacles = [[128, GROUND_Y - 8]]; time.sleep(0.3)

        elif state == "PLAYING":
            if (1, 1) in keys and dino_y == GROUND_Y - 8:
                dino_v = -6
            
            dino_y += dino_v
            dino_v += 0.8
            if dino_y > GROUND_Y - 8:
                dino_y = GROUND_Y - 8
                dino_v = 0

            for obs in obstacles:
                obs[0] -= 4
                if obs[0] < 20 + 8 and obs[0] + 6 > 20:
                    if dino_y + 8 > obs[1]:
                        state = "GAMEOVER"; time.sleep(0.5)

            if obstacles[-1][0] < 128 - random.randint(40, 80):
                obstacles.append([128, GROUND_Y - 8])
            if obstacles[0][0] < -10:
                obstacles.pop(0)

            if time.monotonic() - last_score_time > 0.1:
                score += 1
                last_score_time = time.monotonic()

            display.fill(0)
            display.hline(0, GROUND_Y, 128, 1)
            # Draw Dino Icon
            utils.draw_icon(display, 'DINO', 20, int(dino_y))
            # Draw Cactus Icons
            for obs in obstacles:
                utils.draw_icon(display, 'CACTUS', obs[0], obs[1])
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
