import urllib.request
import os

urls = [
    "https://raw.githubusercontent.com/shubham769/Driver-drowsiness-detection/master/alarm.wav",
    "https://raw.githubusercontent.com/maheshmm7/DrowsiGuard/main/alarm.wav",
    "https://raw.githubusercontent.com/zackgross/Drowsiness-Detection/master/alarm.wav"
]

target_paths = [
    "android/app/src/main/res/raw/focus_alarm.wav",
    "public/focus_alarm.wav"
]

success = False
for url in urls:
    try:
        print(f"Attempting to download from {url}...")
        # Add a User-Agent header to prevent GitHub raw blocking
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                data = response.read()
                # Ensure the file is not empty or HTML
                if len(data) > 10000:
                    for path in target_paths:
                        os.makedirs(os.path.dirname(path), exist_ok=True)
                        with open(path, 'wb') as f:
                            f.write(data)
                    print(f"Successfully downloaded and saved alarm sound from {url} (Size: {len(data)} bytes)!")
                    success = True
                    break
                else:
                    print(f"File from {url} is too small, skipping.")
    except Exception as e:
        print(f"Failed to download from {url}: {e}")

if not success:
    print("Failed to download any open source alarm sounds.")
    exit(1)
