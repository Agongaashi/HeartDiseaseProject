import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="heart_disease_db"
)

cursor = db.cursor()