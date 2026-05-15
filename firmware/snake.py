import time
import random
import utils

WIDTH = 128
HEIGHT = 64
BLOCK = 8 # Larger blocks for icons

def run_game(display, get_keys):
    snake = [(5, 4), (4, 4), (3, 4)]
    dir = (1, 0)
    food = (10, 4)
    score = 0
    state = "START"
    last_move = time.monotonic()

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "SNAKE", 40, 15, scale=2)
            utils.draw_text(display, "CENTER TO START", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; snake = [(5, 4), (4, 4), (3, 4)]; dir = (1, 0); score = 0; time.sleep(0.3)

        elif state == "PLAYING":
            if (0, 1) in keys and dir != (0, 1): dir = (0, -1)
            if (2, 1) in keys and dir != (0, -1): dir = (0, 1)
            if (1, 0) in keys and dir != (1, 0): dir = (-1, 0)
            if (1, 2) in keys and dir != (-1, 0): dir = (1, 0)

            speed = max(0.05, 0.2 - (score // 5) * 0.02)
            if time.monotonic() - last_move > speed:
                head = (snake[0][0] + dir[0], snake[0][1] + dir[1])
                if head[0] < 0 or head[0] >= WIDTH//BLOCK or head[1] < 0 or head[1] >= HEIGHT//BLOCK or head in snake:
                    state = "GAMEOVER"; time.sleep(0.5)
                else:
                    snake.insert(0, head)
                    if head == food:
                        score += 1
                        food = (random.randint(0, WIDTH//BLOCK-1), random.randint(0, HEIGHT//BLOCK-1))
                    else:
                        snake.pop()
                last_move = time.monotonic()

            display.fill(0)
            # Draw Snake
            for i, b in enumerate(snake):
                if i == 0:
                    utils.draw_icon(display, 'SNAKE_HEAD', b[0]*BLOCK, b[1]*BLOCK)
                else:
                    display.fill_rect(b[0]*BLOCK + 1, b[1]*BLOCK + 1, BLOCK-2, BLOCK-2, 1)
            # Draw Food
            utils.draw_icon(display, 'FOOD', food[0]*BLOCK, food[1]*BLOCK)
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
