
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function checkBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

export async function getDatasets() {
  const response = await fetch(
    `${API_BASE_URL}/api/datasets`
  );

  if (!response.ok) {
    throw new Error("Unable to fetch datasets");
  }

  return response.json();
}

export async function uploadDataset(
  file: File
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/datasets/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.detail ||
        "Unable to upload dataset"
    );
  }

  return response.json();
}