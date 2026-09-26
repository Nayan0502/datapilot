const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";


export type Dataset = {
  id: number;
  name: string;
  file_name: string;
  total_rows: number;
  total_columns: number;
  uploaded_at: string;
};


export async function checkBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  if (!response.ok) {
    throw new Error(
      "Backend health check failed"
    );
  }

  return response.json();
}


export async function getDatasets(): Promise<{
  datasets: Dataset[];
  count: number;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/datasets`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Unable to fetch datasets"
    );
  }

  return response.json();
}


export async function uploadDataset(
  file: File
) {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await fetch(
    `${API_BASE_URL}/api/datasets/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json();

    throw new Error(
      errorData.detail ||
        "Unable to upload dataset"
    );
  }

  return response.json();
}

export async function getDataset(
  datasetId: number
): Promise<Dataset> {

  const response = await fetch(
    `${API_BASE_URL}/api/datasets/${datasetId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json();

    throw new Error(
      errorData.detail ||
        "Unable to fetch dataset"
    );
  }

  const result =
    await response.json();

  return result.dataset;
}

export type DatasetPreview = {
  dataset_id: number;
  headers: string[];
  rows: string[][];
  limit: number;
  total_rows: number;
};

export async function getDatasetPreview(
  datasetId: number,
  limit = 20
): Promise<DatasetPreview> {
  const response = await fetch(
    `${API_BASE_URL}/api/datasets/${datasetId}/preview?limit=${limit}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail || "Unable to fetch dataset preview"
    );
  }

  return response.json();
}