import os
import time

def commit():
    os.system("git checkout segie")
    os.system("git pull origin segie")
    while True:
        os.system("git add .")
        os.system("git commit -m 'updates'")
        os.system("git push origin segie")
        time.sleep(300)  

commit()
