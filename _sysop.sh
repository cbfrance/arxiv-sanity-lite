_sysop.sh#!/bin/bash

# Function to check Apache2 status
check_apache() {
    if systemctl is-active --quiet apache2; then
        echo "Apache2 is running."
    else
        echo "❌ Apache2 is not running."
    fi
}

# Function to check SQLite databases
check_sqlite() {
    for db in dict.db papers.db features.p; do
        if [ -f "data/$db" ]; then
            echo "$db exists."
            if [ "$(stat -c '%U' "data/$db")" == "www-data" ]; then
                echo "$db is owned by www-data."
            else
                echo "$db is not owned by www-data."
            fi
        else
            echo "❌ ERROR — $db does not exist."
        fi
    done
}

# Function to check Cron status
check_cron() {
    echo "Cron status:"
    echo "================== /var/log/syslog =================="
    grep CRON /var/log/syslog | tail

     for log in cron.*.log; do
        echo "================== $log =================="
        tail $log
        echo "==========================================="
    done
}

# Function to restart Apache2
restart_apache() {
    touch arxiv-sanity-lite.wsgi
    echo "arxiv-sanity-lite.wsgi touched."
    echo "Attempting Apache2 restart with systemctl restart apache2"
    sudo systemctl restart apache2
}

# Function to run arxiv_daemon.py
run_daemon() {
    echo "starting arxiv_daemon.py"
    python3 arxiv_daemon.py
}

# Function to send emails
send_emails() {
    echo "Sending emails with send_emails.py ..."
    python3 send_emails.py
}

# Function to tail Apache logs
tail_apache_logs() {
    echo "Tailing Apache error log..."
    tail /var/log/apache2/error.log
}

# Function to tail -f Apache logs
tailf_apache_logs() {
    echo "Tailing -f Apache error log..."
    tail -f /var/log/apache2/error.log
}

# Main menu
while true; do
    echo "Choose an option:"
    echo "1. Check Apache2 status"
    echo "2. Check SQLite databases"
    echo "3. Check Git status"
    echo "4. Check Cron status"
    echo "5. Tail Apache logs"
    echo "6. Tail -f Apache logs"
    echo "A. Restart Apache2"
    echo "D. Run arxiv_daemon.py"
    echo "M. Send emails with send_email.py"
    echo "Q. Quit"
    read -r -p "Enter your choice: " choice
    case $choice in
        1) check_apache ;;
        2) check_sqlite ;;
        3) check_git ;;
        4) check_cron ;;
        5) tail_apache_logs ;;
        6) tailf_apache_logs ;;
        [Aa]) restart_apache ;;
        [Dd]) run_daemon ;;
        [Mm]) send_emails ;;
        [Qq]) break ;;
        *) echo "Invalid option." ;;
    esac
done