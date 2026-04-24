import mysql.connector

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="12345678",
        database="heart_disease_db",
        autocommit=True
    )