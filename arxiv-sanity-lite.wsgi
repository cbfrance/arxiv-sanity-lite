import sys
import logging

sys.path.insert(0, '/usr/local/src/arxiv-sanity-lite')

print("------------ sys.executable -----------")
print(sys.executable)

logging.basicConfig(stream=sys.stderr)
logging.error('Python executable: ' + sys.executable)
logging.error('Python version: ' + sys.version)
from serve import app as application