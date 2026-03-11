import sqlite3
import os

DB_PATH = 'bank.db'

def init_db():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT 0,
            ssn TEXT,
            credit_card TEXT
        )
    ''')

    users = [
        ('admin', 'SuperSecur3$$w0rd!', 1, '999-00-1111', '4532-1111-2222-3333'),
        ('jdoe', 'password123', 0, '123-45-6789', '4111-2222-3333-4444'),
        ('asmith', 'qwerty', 0, '987-65-4321', '5555-6666-7777-8888')
    ]

    cursor.executemany('''
        INSERT INTO users (username, password, is_admin, ssn, credit_card)
        VALUES (?, ?, ?, ?, ?)
    ''', users)

    conn.commit()
    conn.close()
    print("[+] Database initialized successfully.")

if __name__ == '__main__':
    init_db()
