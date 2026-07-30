import math, wave, struct

def generate_alarm(filename):
    f = wave.open(filename, 'w')
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(44100)
    
    duration = 15 # 15 seconds
    total_frames = 44100 * duration
    
    # Pre-allocate frames list for high performance O(N) execution
    frames = [None] * total_frames
    
    for i in range(total_frames):
        # Create a pulsing siren effect
        cycle_pos = i % 22050
        
        # Play sound for 0.4 seconds, then 0.1 seconds silence
        if cycle_pos < 17640: 
            # Frequency sweep between 600Hz and 1200Hz
            sweep_factor = math.sin(2 * math.pi * (i / 11025.0)) # oscillate sweep every 0.25s
            freq = 900 + 300 * sweep_factor
            
            # Sine wave with maximum amplitude
            v = int(32767 * math.sin(2 * math.pi * freq * i / 44100.0))
        else:
            v = 0
            
        frames[i] = struct.pack('<h', v)
        
    f.writeframes(b''.join(frames))
    f.close()

# Generate for both native raw resources and web assets
generate_alarm('android/app/src/main/res/raw/focus_alarm.wav')
generate_alarm('public/focus_alarm.wav')
print("Loud 15-second siren alarm generated successfully!")
