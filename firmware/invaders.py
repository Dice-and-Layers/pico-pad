import time
import random
import utils

WIDTH = 128
HEIGHT = 64

def run_game(display, get_keys):
    player_x = WIDTH // 2
    aliens = []
    for r in range(3):
        for c in range(8):
            aliens.append([c * 12 + 10, r * 10 + 10, 1]) # x, y, dir
    bullets = []
    score = 0
    state = "START"
    last_fire = 0
    last_alien_move = 0

    while True:
        keys = get_keys()
        if (0, 0) in keys and (0, 2) in keys: return

        if state == "START":
            display.fill(0)
            utils.draw_text(display, "INVADERS", 30, 15, scale=2)
            utils.draw_text(display, "CENTER TO FIRE", 35, 45)
            display.show()
            if (1, 1) in keys:
                state = "PLAYING"; score = 0; player_x = WIDTH // 2; bullets = []; time.sleep(0.3)
                aliens = []
                for r in range(3):
                    for c in range(8): aliens.append([c * 12 + 10, r * 10 + 10, 1])

        elif state == "PLAYING":
            if (1, 0) in keys: player_x = max(0, player_x - 3)
            if (1, 2) in keys: player_x = min(WIDTH - 8, player_x + 3)
            if (1, 1) in keys and time.monotonic() - last_fire > 0.4:
                bullets.append([player_x + 4, HEIGHT - 10])
                last_fire = time.monotonic()

            # Move aliens
            if time.monotonic() - last_alien_move > 0.5:
                shift_down = False
                for a in aliens:
                    a[0] += 4 * a[2]
                    if a[0] < 5 or a[0] > WIDTH - 15: shift_down = True
                if shift_down:
                    for a in aliens:
                        a[2] = -a[2]
                        a[1] += 4
                last_alien_move = time.monotonic()

            for b in bullets[:]:
                b[1] -= 4
                if b[1] < 0: bullets.remove(b)
                else:
                    for a in aliens[:]:
                        if a[0] <= b[0] <= a[0] + 8 and a[1] <= b[1] <= a[1] + 6:
                            aliens.remove(a); bullets.remove(b); score += 10; break

            if not aliens or any(a[1] > HEIGHT - 15 for a in aliens):
                state = "GAMEOVER"

            display.fill(0)
            # Draw Player
            display.fill_rect(player_x, HEIGHT - 8, 8, 4, 1)
            # Draw Aliens
            for a in aliens:
                display.rect(a[0], a[1], 8, 6, 1)
                display.pixel(a[0]+2, a[1]+2, 1); display.pixel(a[0]+5, a[1]+2, 1)
            # Draw Bullets
            for b in bullets: display.fill_rect(b[0], b[1], 2, 4, 1)
            utils.draw_text(display, f"SC:{score}", 0, 0)
            display.show()

        elif state == "GAMEOVER":
            display.fill(0)
            utils.draw_text(display, "GAME OVER", 30, 25, scale=2)
            display.show()
            if (1, 1) in keys: state = "START"; time.sleep(0.3)
            if (0, 1) in keys: return
        time.sleep(0.01)
