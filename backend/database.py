import sqlite3
from pathlib import Path
from datetime import datetime, timezone


DATABASE_PATH = Path(__file__).parent / "datapilot.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)

    connection.row_factory = sqlite3.Row

    return connection


def initialize_database():
    connection = get_connection()

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS datasets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_name TEXT NOT NULL,
            stored_file_name TEXT NOT NULL,
            total_rows INTEGER NOT NULL,
            total_columns INTEGER NOT NULL,
            uploaded_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


def create_dataset(
    name: str,
    file_name: str,
    stored_file_name: str,
    total_rows: int,
    total_columns: int,
):
    connection = get_connection()

    uploaded_at = datetime.now(
        timezone.utc
    ).isoformat()

    cursor = connection.execute(
        """
        INSERT INTO datasets (
            name,
            file_name,
            stored_file_name,
            total_rows,
            total_columns,
            uploaded_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            name,
            file_name,
            stored_file_name,
            total_rows,
            total_columns,
            uploaded_at,
        ),
    )

    connection.commit()

    dataset_id = cursor.lastrowid

    connection.close()

    return dataset_id


def get_all_datasets():
    connection = get_connection()

    cursor = connection.execute(
        """
        SELECT
            id,
            name,
            file_name,
            total_rows,
            total_columns,
            uploaded_at
        FROM datasets
        ORDER BY id DESC
        """
    )

    datasets = [
        dict(row)
        for row in cursor.fetchall()
    ]

    connection.close()

    return datasets

def get_dataset_by_id(dataset_id: int):
    connection = get_connection()

    cursor = connection.execute(
        """
        SELECT
            id,
            name,
            file_name,
            stored_file_name,
            total_rows,
            total_columns,
            uploaded_at
        FROM datasets
        WHERE id = ?
        """,
        (dataset_id,),
    )

    dataset = cursor.fetchone()

    connection.close()

    if dataset is None:
        return None

    return dict(dataset)