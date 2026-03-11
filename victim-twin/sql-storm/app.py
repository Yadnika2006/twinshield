import os
import sqlite3
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

SESSION_ID = os.environ.get("SESSION_ID", "local-dev")
GATEWAY_URL = os.environ.get("GATEWAY_URL", "http://localhost:4000")

def emit_event(event_text):
    """Send attack event string to the TwinShield gateway"""
    if not GATEWAY_URL or GATEWAY_URL == "none":
        print(f"[Would Emit] {event_text}")
        return

    try:
        url = f"{GATEWAY_URL}/emit-event"
        payload = {
            "sessionId": SESSION_ID,
            "event": event_text
        }
        res = requests.post(url, json=payload, timeout=2)
        print(f"[GW Emitted] Status: {res.status_code}")
    except Exception as e:
        print(f"[GW Error] Failed to emit event: {e}")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username", "")
    password = request.form.get("password", "")

    # Basic initial detection logging
    if "'" in username or "'" in password or '"' in username or '"' in password:
        emit_event("[MEDIUM] Input anomaly detected: SQL injection chars present in login attempt")

    # 🚨 VULNERABLE CODE: RAW STRING CONCATENATION 🚨
    # This specifically builds a query that can easily be bypassed with:
    # admin' OR 1=1 --
    query = f"SELECT id, username, is_admin, ssn, credit_card FROM users WHERE username='{username}' AND password='{password}'"
    
    print(f"[DB QUERY] {query}")

    conn = sqlite3.connect("bank.db")
    
    # We use row_factory to easily convert rows to dicts
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    try:
        # 🚨 VULNERABLE CODE: executing the raw concatenated string 🚨
        cursor.execute(query)
        rows = cursor.fetchall()

        if len(rows) > 0:
            # Analyze what payload they dropped
            is_dump = len(rows) > 1 or "UNION" in username.upper()
            
            # They got in! Was it a bypass or legit? (we assume all successful logins in this lab are bypasses)
            if is_dump:
                emit_event("[CRITICAL] data_exfiltration — Suspected database dump via UNION or unconstrained OR")
            elif "'" in username or "' OR" in username.upper():
                emit_event("[CRITICAL] auth_bypassed — Authentication bypass via SQL Injection successful")
            else:
                emit_event(f"[HIGH] Authentication successful for user: {username}")

            first_user = dict(rows[0])
            
            # Response formatting
            return jsonify({
                "success": True,
                "user": {
                    "id": first_user.get("id"),
                    "username": first_user.get("username"),
                    "is_admin": bool(first_user.get("is_admin"))
                },
                "rawData": [dict(r) for r in rows] if is_dump else None
            })
        else:
            emit_event(f"[INFO] Failed login attempt for user: {username}")
            return jsonify({"success": False, "error": "Invalid username or password"}), 401

    except sqlite3.Error as e:
        # Emitting the DB syntax error helps attackers realize what broke
        error_msg = str(e)
        emit_event(f"[HIGH] Database syntax error triggered! Trace: {error_msg}")
        return jsonify({"success": False, "error": f"Internal Database Error: {error_msg}"}), 500
    finally:
        conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
