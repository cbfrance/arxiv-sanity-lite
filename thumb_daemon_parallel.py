"""
This script iterates over the current database and attempts to download the papers,
convert them into thumbnail images, and save them to disk for UI display.
Currently, it only processes the most recent 5K papers.
It is designed to be run as a daily cron job or similar.
"""

import os
import time
import random
import requests
from subprocess import Popen
from aslite.db import get_papers_db, get_metas_db
from concurrent.futures import ThreadPoolExecutor
import threading
from threading import Lock
import time
from queue import Queue

# Create the tmp directory for temporary work if it does not exist
TMP_DIR = "tmp"
if not os.path.exists(TMP_DIR):
    os.makedirs(TMP_DIR)
    print("ℹ️  [ INFO  ] Created tmp directory.")

# Create the thumb directory for storing paper thumbnails if it does not exist
THUMB_DIR = os.path.join("static", "thumb")
if not os.path.exists(THUMB_DIR):
    os.makedirs(THUMB_DIR)
    print("ℹ️  [ INFO  ] Created thumb directory.")

# Open the database and determine which papers to generate thumbnails for
pdb = get_papers_db()
n = len(pdb)
print(f"{n} papers in the database.")
thumb_count = sum(
    [os.path.exists(os.path.join(THUMB_DIR, key + ".jpg")) for key in pdb.keys()]
)
print(f"{thumb_count} papers have thumbnails.")


mdb = get_metas_db()
metas = list(mdb.items())
metas.sort(
    key=lambda kv: kv[1]["_time"], reverse=True
)  # Sort by most recent papers first
keys = [k for k, v in metas[:5000]]  # Limit to the most recent papers
print(f"Processing {len(keys)} papers.")
print(f"{keys[:5]} and {len(keys)-5} more... ")

papers_queue = Queue()
for key in keys:
    papers_queue.put(key)

total_papers = len(keys)
global_log = {}


lock = Lock()


def process_paper(key):
    """
    This function processes a single paper, downloading it, converting it to a thumbnail,
    and saving the thumbnail to disk.
    """

    current_thread_id = threading.get_ident()
    global thumb_count
    global global_log

    # Define the path where the thumbnail for this key would be stored
    thumb_path = os.path.join(THUMB_DIR, key + ".jpg")

    # Check if the thumbnail for this paper already exists
    if os.path.exists(thumb_path):
        with lock:
            thumb_count += 1
            global_log[key] = {
                "status": "done",
                "traces": [
                    f"✅ [ DONE   ] Paper {thumb_count}/{total_papers} already processed."
                ],
            }
        return

    global_log[key]["status"] = "processing"

    def tracer(statement):
        global_log[key]["traces"].append(statement)

    # Define the path where the thumbnail for this key would be stored
    thumb_path = os.path.join(THUMB_DIR, key + ".jpg")
    if os.path.exists(thumb_path):
        # global_log[key]["status"] = "done"
        with lock:
            thumb_count += 1
        tracer(f"✅ [ DONE   ] Paper {thumb_count}/{total_papers} already processed.")
        return  # Skip if thumbnail already exists

    # Fetch the paper
    paper = pdb[key]
    tracer("ℹ️  [ INFO  ] Processing paper: %s" % key)

    # Get the link to the pdf
    url = paper["link"].replace("abs", "pdf")

    # Create a unique tmp directory for this paper
    paper_key = os.path.join(TMP_DIR, key)
    if not os.path.exists(paper_key):
        os.makedirs(paper_key)

    # Attempt to download the pdf
    tracer("ℹ️  [ INFO  ] Attempting to download pdf from: " + url)
    try:
        x = requests.get(url, timeout=10, allow_redirects=True)

        # Create a unique tmp directory for this paper
        paper_key = os.path.join(TMP_DIR, key)
        if not os.path.exists(paper_key):
            os.makedirs(paper_key)

        with open(os.path.join(paper_key, f"{key}.pdf"), "wb") as f:
            f.write(x.content)
        tracer("✅ [ DONE   ] Download successful")
    except requests.exceptions.RequestException as e:
        tracer("❌ [ ERROR ] Error downloading the pdf at url " + url)
        tracer("❌ [ ERROR ] " + str(e))
        return

    time.sleep(5 + random.uniform(0, 5))  # Pause to avoid overloading the server
    # Convert pdf to png images per page. Spawn async because convert can unfortunately enter an infinite loop, have to handle this.
    # This command will generate 8 independent images thumb-0.png ... thumb-7.png of the thumbnails
    tracer("ℹ️  [ INFO  ] Converting the pdf to png images")
    pp = Popen(
        [
            "convert",
            "%s[0-7]" % (os.path.join(paper_key, f"{paper_key}.pdf"),),
            "-thumbnail",
            "x1600",
            os.path.join(paper_key, "thumb.png"),
        ]
    )
    t0 = time.time()
    CONVERT_TIMEOUT = 40
    while time.time() - t0 < CONVERT_TIMEOUT:
        ret = pp.poll()
        if not (ret is None):
            # process terminated
            break
        time.sleep(0.1)
    ret = pp.poll()
    if ret is None:
        tracer(
            f"❌⏰ [ ERROR ] Convert command did not terminate in {CONVERT_TIMEOUT} seconds, terminating."
        )
        pp.terminate()  # give up
        return

    if not os.path.isfile(os.path.join(paper_key, "thumb-0.png")):
        # Failed to render pdf, replace with missing image
        # missing_thumb_path = os.path.join('static', 'missing.jpg')
        # os.system('cp %s %s' % (missing_thumb_path, thumb_path))
        # print("Could not render pdf, creating a missing image placeholder")
        tracer(f"❌❌ [ ERROR ] Could not render pdf, skipping {paper_key}")
        return
    else:
        # Otherwise concatenate the 8 images into one
        cmd = "montage -mode concatenate -quality 95 -tile x1 %s %s" % (
            os.path.join(paper_key, "thumb-*.png"),
            thumb_path,
        )
        tracer("ℹ️  [ INFO  ] " + cmd)
        os.system(cmd)

    # Remove the temporary paper.pdf file
    tmp_pdf = os.path.join(paper_key, f"{paper_key}.pdf")
    if os.path.isfile(tmp_pdf):
        os.remove(tmp_pdf)

    global_log[key]["status"] = "done"
    tracer(f"✅ [ DONE   ] Paper {thumb_count}/{total_papers} processed.")


def print_global_log():
    for thread in threading.enumerate():
        print(f"Active Thread: {thread.name}")
    try:
        print("print_global_log started")
        while True:
            with lock:
                os.system("cls" if os.name == "nt" else "clear")
                print(f"ℹ️  [ INFO  ] ==========================================")
                print(f"ℹ️  [ INFO  ] Total global_log items: {len(global_log)}")
                print(f"ℹ️  [ INFO  ] global_log output:")
                for thread, log_item in list(
                    global_log.items()
                ):  # Create a copy of the items
                    print(f"Thread {thread}:")
                    print(f"|-- status: {log_item['status']}")
                    if isinstance(log_item["traces"], list):
                        for log_message in log_item["traces"]:
                            print(f"|-- log message: {log_message}")
            if len(global_log) == total_papers:
                break
            time.sleep(1)  # sleep for n seconds
    except Exception as e:
        print(f"Exception in print_global_log: {e}")
    finally:
        print("print_global_log terminated")


import time


# Now start the logging thread
threading.Thread(target=print_global_log).start()


with ThreadPoolExecutor(max_workers=4) as executor:
    for key in keys:  # Start total_papers worker threads
        executor.submit(process_paper, key)
