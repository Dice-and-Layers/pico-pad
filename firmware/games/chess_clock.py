"""
CHESS CLOCK - Dual Timer Utility
--------------------------------
A large-display chess clock with seven-segment style digits.
Supports adjustable starting time and independent player timers.

Controls:
- (1, 0): Left player button (switches to right).
- (1, 2): Right player button (switches to left).
- (1, 1): Start / Pause / Resume.
- (0, 1): Increase time (+1 min) - Only when paused/ready.
- (2, 1): Decrease time (-1 min) - Only when paused/ready.
- (2, 2): Reset to starting time.
- (0, 0) + (0, 2): Exit to launcher.

DISCLAIMER: THIS CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED. USE AT YOUR OWN RISK.
"""
 
import time
import utils

def draw_digit(d, digit, x, y, w, h, color=1):
    """Draws a single digit in seven-segment style."""
    if digit == ":":
        # Draw colon
        d.fill_rect(x + w//2 - 1, y + h//3, 2, 2, color)
        d.fill_rect(x + w//2 - 1, y + 2*h//3, 2, 2, color)
        return
        
    s = max(1, w // 5) # thickness
    # A (top)
    if digit in "02356789": d.fill_rect(x+s, y, w-2*s, s, color)
    # B (top-right)
    if digit in "01234789": d.fill_rect(x+w-s, y+s, s, (h-s)//2-s, color)
    # C (bottom-right)
    if digit in "013456789": d.fill_rect(x+w-s, y+(h+s)//2, s, (h-s)//2-s, color)
    # D (bottom)
    if digit in "0235689": d.fill_rect(x+s, y+h-s, w-2*s, s, color)
    # E (bottom-left)
    if digit in "0268": d.fill_rect(x, y+(h+s)//2, s, (h-s)//2-s, color)
    # F (top-left)
    if digit in "045689": d.fill_rect(x, y+s, s, (h-s)//2-s, color)
    # G (middle)
    if digit in "2345689": d.fill_rect(x+s, y+(h-s)//2, w-2*s, s, color)

def draw_time(d, seconds, x, y, w_digit, h_digit, active=True):
    """Draws time in MM:SS format using seven-segment digits."""
    mins = int(seconds) // 60
    secs = int(seconds) % 60
    
    time_str = f"{mins:02}:{secs:02}"
    curr_x = x
    color = 1 if active else 1 # Both white, but active is brighter/filled?
    
    # Draw a box if active
    if active:
        d.rect(x - 4, y - 4, (w_digit + 2) * 5 + 8, h_digit + 8, 1)
    
    for char in time_str:
        draw_digit(d, char, curr_x, y, w_digit, h_digit, color=1)
        curr_x += w_digit + 2

def run_game(display, get_keys):
    """Main loop for the Chess Clock."""
    start_mins = 5
    times = [start_mins * 60.0, start_mins * 60.0]
    active_player = -1 # -1: Ready, 0: Left, 1: Right
    last_tick = time.monotonic()
    paused = True
    
    while True:
        keys = get_keys()
        # Exit Combo
        if (0, 0) in keys and (0, 2) in keys: return
        
        now = time.monotonic()
        delta = now - last_tick
        last_tick = now
        
        # Handle Inputs
        if (1, 1) in keys: # Start/Pause
            if active_player == -1: 
                active_player = 0 # Start with Left
                paused = False
            else:
                paused = not paused
            time.sleep(0.3)
            
        if paused:
            if (0, 1) in keys: # Inc time
                start_mins = min(99, start_mins + 1)
                times = [start_mins * 60.0, start_mins * 60.0]
                time.sleep(0.2)
            if (2, 1) in keys: # Dec time
                start_mins = max(1, start_mins - 1)
                times = [start_mins * 60.0, start_mins * 60.0]
                time.sleep(0.2)
            if (2, 2) in keys: # Reset
                times = [start_mins * 60.0, start_mins * 60.0]
                active_player = -1
                time.sleep(0.3)
        else:
            # Player Switches
            if (1, 0) in keys and active_player == 0:
                active_player = 1
                time.sleep(0.1)
            if (1, 2) in keys and active_player == 1:
                active_player = 0
                time.sleep(0.1)
                
            # Update active timer
            if active_player != -1:
                times[active_player] = max(0, times[active_player] - delta)
                if times[active_player] == 0:
                    paused = True # Time's up!
        
        # Rendering
        display.fill(0)
        
        # Draw Timers
        # Timer 1 (Left)
        draw_time(display, times[0], 10, 10, 10, 18, active=(active_player == 0 and not paused))
        # Timer 2 (Right)
        draw_time(display, times[1], 10, 38, 10, 18, active=(active_player == 1 and not paused))
        
        # Status Text
        status = "READY" if active_player == -1 else ("PAUSED" if paused else "RUNNING")
        if times[0] == 0 or times[1] == 0: status = "TIME UP!"
        utils.draw_text(display, status, 80, 2, scale=1)
        
        # Control Hints
        if active_player == -1 or paused:
            utils.draw_text(display, "UP/DN: SET", 80, 56)
        
        display.show()
        time.sleep(0.01)
