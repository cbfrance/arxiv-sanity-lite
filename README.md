# Arxiv-sanity-lite

A research assistant, perhaps. 

[![arxiv-sanity-lite](https://img.shields.io/badge/Using-Arxiv%20Sanity%20Lite-blue?style=flat-square&logo=github)](https://github.com/karpathy/arxiv-sanity-lite).

For educational purposes only. 

- python jinja + react 
- cypress e2e testing
- cron / polling based architecture which maintains a cache of pdf abstracts and thumbnails
- TF-IDF

---

#### Overview

To run this locally I usually run the following script to update the database with any new papers. I typically schedule this via a periodic cron job:

```bash
#!/bin/bash

python3 arxiv_daemon.py --num 2000

if [ $? -eq 0 ]; then
    echo "New papers detected! Running compute.py"
    python3 compute.py
else
    echo "No new papers were added, skipping feature computation"
fi
```

You can see that updating the database is a matter of first downloading the new papers via the arxiv api using `arxiv_daemon.py`, and then running `compute.py` to compute the tfidf features of the papers.

All of the databases are stored inside the `data` directory, using sqlite.

#### Hosting

If you'd like to run your own instance on the interwebs I recommend simply running the above on a [Linode](https://www.linode.com), e.g. I am running this code currently on the smallest "Nanode 1 GB" instance indexing about 30K papers, which costs $5/month.

#### Installation

Install via pip:

```bash
pip install -r requirements.txt
```

(Optional) Finally, if you'd like to send periodic emails to users about new papers, see the `send_emails.py` script. You'll also have to `pip install sendgrid`. I run this script in a daily cron job.

#### Usage

To serve the flask server locally:

```bash
source .venv/bin/activate
python
```

To run python scripts from the command line:

```bash
source .venv/bin/activate
python script_name.py
```

Replace `script_name.py` with the name of the script you want to run.

### Troubleshooting development

- You might need to install imagemagick. On MacOS: `brew install imagemagick`
- Locally can't get the site to render: You might need to turn off airplay reciever on your mac to get the server to run. On macOS, try disabling the 'AirPlay Receiver' service from System Preferences -> General -> AirDrop & Handoff.

### Troubleshooting deployment of Flask apps
- Apache gunicorn/wsgi environment issue: Something is broken in the Flask/Jinja template? You can remotely edit some application code and `touch arxiv-sanity-lite.wsgi` to restart the server. You might need to also restart apache to see the changes with `apache2ctl restart`. Hey at least there is no Docker.
- Edited `serve.py`? Touch the wsgi file to reload it. 
- Missing database? Create the file and give it permissions, for example, for the dict database: `touch data/dict.db && chown www-data:www-data data/dict.db && chmod 664 data/dict.db` — see aslite/db.py for more details.
- DB permissions errors? `chmod +r data/features.p` (or other sqlite DBs)
- Check for errors `tail -f /var/log/apache2/error.log`
- Sending email: you need to ensure the project dir (eg. `/usr/local/src/arxiv-sanity-lite`) is correct, like this: 
    0 16 * * * TZ=":America/Los_Angeles" /usr/local/src/arxiv-sanity-lite/.venv/bin/python3 send_emails.py >> /usr/local/src/arxiv-sanity-lite/cron.log 2>&1
- Installing cypress: `sudo apt-get update && sudo apt-get install -y libgbm-dev && sudo apt install xvfb && sudo apt-get install -y libasound2` 
- Installing Node 14+ for cypress: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc && nvm install 14.0.0 && nvm use 14.0.0`
-  Getting older articles: Offset your start index like this: `python arxiv_daemon.py --num 20000 --start 20100`

#### License

MIT
