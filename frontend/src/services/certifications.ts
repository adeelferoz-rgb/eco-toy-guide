export interface Certification {
  id: string;
  name: string;
  logo: string;
  description: string;
  meaning: string;
  impact: string;
}

const API_URL = "http://localhost:8000/api/v1";

export const fetchCertifications = async (): Promise<Certification[]> => {
  const response = await fetch(`${API_URL}/certifications`);
  if (!response.ok) {
    throw new Error("Failed to fetch certifications");
  }
  return response.json();
};