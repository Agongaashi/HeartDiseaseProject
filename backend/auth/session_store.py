from database import get_db


def save_session(user_id, refresh_token, jti, email, role):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO user_sessions (user_id, refresh_token, jti, email, role, is_active)
        VALUES (%s, %s, %s, %s, %s, 1)
    """, (user_id, refresh_token, jti, email, role))

    db.commit()
    cursor.close()
    db.close()


def get_session_by_jti(jti):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM user_sessions
        WHERE jti=%s AND is_active=1
    """, (jti,))

    session = cursor.fetchone()

    cursor.close()
    db.close()

    return session