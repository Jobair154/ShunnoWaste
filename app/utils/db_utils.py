import mysql.connector


def get_db_connection():
    connection = mysql.connector.connect(
    host="localhost", user="root", passwd="", database="shunnowaste_db",
    )
        # host="localhost", user="xrangqsu_shunnowaste", passwd="shunnowaste@", database="xrangqsu_shunnowaste_db",
    return connection