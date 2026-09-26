from pathlib import Path
from datetime import datetime, timezone
import csv
import io
import uuid

from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
)

try:
    from fastapi.middleware.cors import CORSMiddleware
except ImportError:  # pragma: no cover - fallback for environments without FastAPI CORS module
    from starlette.middleware.cors import CORSMiddleware

from database import (
    initialize_database,
    create_dataset,
    get_all_datasets,
    get_dataset_by_id,
)

app = FastAPI(
    title="DataPilot API",
    description="Backend API for the DataPilot AI Data Intelligence Platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Storage
# --------------------------------------------------

UPLOAD_DIRECTORY = Path(__file__).parent / "uploads"

UPLOAD_DIRECTORY.mkdir(
    exist_ok=True
)


# --------------------------------------------------
# Initialize database
# --------------------------------------------------

initialize_database()


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Welcome to DataPilot API",
        "status": "running",
    }


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "datapilot-backend",
        "timestamp": datetime.now(
            timezone.utc
        ).isoformat(),
    }


# --------------------------------------------------
# Get datasets
# --------------------------------------------------

@app.get("/api/datasets")
def get_datasets():

    datasets = get_all_datasets()

    return {
        "datasets": datasets,
        "count": len(datasets),
    }
    
@app.get("/api/datasets/{dataset_id}")
def get_dataset(dataset_id: int):

    dataset = get_dataset_by_id(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    return {
        "dataset": dataset,
    }

@app.get("/api/datasets/{dataset_id}/preview")
def get_dataset_preview(dataset_id: int, limit: int = 20):
    dataset = get_dataset_by_id(dataset_id)

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found."
        )

    if limit < 1:
        raise HTTPException(
            status_code=400,
            detail="Limit must be greater than 0."
        )

    if limit > 100:
        limit = 100

    stored_file_name = dataset["stored_file_name"]
    stored_file_path = UPLOAD_DIRECTORY / stored_file_name

    if not stored_file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Stored dataset file not found."
        )

    try:
        with open(
            stored_file_path,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as csv_file:

            csv_reader = csv.reader(csv_file)

            headers = next(csv_reader, None)

            if not headers:
                raise HTTPException(
                    status_code=400,
                    detail="Dataset does not contain a valid header."
                )

            rows = []

            for row in csv_reader:
                rows.append(row)

                if len(rows) >= limit:
                    break

            return {
                "dataset_id": dataset_id,
                "headers": headers,
                "rows": rows,
                "limit": limit,
                "total_rows": dataset["total_rows"],
            }

    except HTTPException:
        raise

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Unable to decode dataset."
        )

    except Exception as error:
        print(f"Dataset preview error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to read dataset."
        )

# --------------------------------------------------
# Upload dataset
# --------------------------------------------------

@app.post("/api/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...)
):

    # Validate file name
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is missing.",
        )

    original_file_name = Path(
        file.filename
    ).name

    # Validate extension
    if not original_file_name.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    # Read file
    contents = await file.read()

    # 5 MB limit
    max_file_size = 5 * 1024 * 1024

    if len(contents) > max_file_size:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 5 MB.",
        )

    if len(contents) == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    # Parse CSV
    try:
        decoded_content = contents.decode(
            "utf-8-sig"
        )

        csv_reader = csv.reader(
            io.StringIO(decoded_content)
        )

        rows = list(csv_reader)

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="CSV must use UTF-8 encoding.",
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Unable to parse CSV file.",
        )

    # Validate CSV structure
    if len(rows) < 2:
        raise HTTPException(
            status_code=400,
            detail=(
                "CSV must contain a header "
                "and at least one data row."
            ),
        )

    headers = rows[0]

    if not headers:
        raise HTTPException(
            status_code=400,
            detail="CSV headers cannot be empty.",
        )

    if any(
        not header.strip()
        for header in headers
    ):
        raise HTTPException(
            status_code=400,
            detail="CSV headers cannot be empty.",
        )

    data_rows = rows[1:]

    # Generate unique stored file name
    unique_file_name = (
        f"{uuid.uuid4()}_{original_file_name}"
    )

    stored_file_path = (
        UPLOAD_DIRECTORY /
        unique_file_name
    )

    # Save actual CSV file
    with open(
        stored_file_path,
        "wb"
    ) as output_file:

        output_file.write(contents)

    # Save metadata
    dataset_id = create_dataset(
        name=Path(
            original_file_name
        ).stem,
        file_name=original_file_name,
        stored_file_name=unique_file_name,
        total_rows=len(data_rows),
        total_columns=len(headers),
    )

    return {
        "message": "Dataset uploaded successfully.",
        "dataset": {
            "id": dataset_id,
            "name": Path(
                original_file_name
            ).stem,
            "file_name": original_file_name,
            "total_rows": len(data_rows),
            "total_columns": len(headers),
        },
    }