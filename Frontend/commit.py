import os
import time


def commit():
    os.system("git add .")
    os.system("git commit -m 'updates'")
    os.system("git push origin main")
    time.sleep(2)

if __name__ == '__main__':
    commit()