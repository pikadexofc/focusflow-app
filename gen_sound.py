import math, wave, struct
f=wave.open('android/app/src/main/res/raw/focus_alarm.wav', 'w')
f.setnchannels(1)
f.setsampwidth(2)
f.setframerate(44100)
data=b''
freq=800
for i in range(44100):
    if (i // 5000) % 2 == 0:
        v = int(32767 * math.sin(2 * math.pi * freq * i / 44100.0))
    else:
        v = 0
    data += struct.pack('<h', v)
f.writeframesraw(data)
f.close()
