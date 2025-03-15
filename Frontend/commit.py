import os
import time

def commit():
    
    os.system("git checkout segie")
    while True:
        os.system("git add .")
        os.system("git commit -m 'updates'")
        os.system("git push origin segie")
        time.sleep(3600)  # waits for 1 hour before next commit

commit()
