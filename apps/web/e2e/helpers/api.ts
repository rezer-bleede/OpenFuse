const API_URL = process.env.API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
}

export async function apiRequest(endpoint: string, options?: RequestInit): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options
  });
  return { data: await response.json(), status: response.status };
}

export const api = {
  getPipelines: () => apiRequest('/api/v1/pipelines'),
  createPipeline: (data: any) => apiRequest('/api/v1/pipelines', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getPipeline: (id: number) => apiRequest(`/api/v1/pipelines/${id}`),
  updatePipeline: (id: number, data: any) => apiRequest(`/api/v1/pipelines/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),
  deletePipeline: (id: number) => apiRequest(`/api/v1/pipelines/${id}`, {
    method: 'DELETE'
  }),
  runPipeline: (id: number, data?: any) => apiRequest(`/api/v1/pipelines/${id}/run`, {
    method: 'POST',
    body: JSON.stringify(data || {})
  }),
  getJobs: (pipelineId: number) => apiRequest(`/api/v1/pipelines/${pipelineId}/jobs`),
  getConnectors: () => apiRequest('/api/v1/connectors'),
  validateConnector: (name: string, config: any) => apiRequest(`/api/v1/connectors/${name}/validate`, {
    method: 'POST',
    body: JSON.stringify({ config })
  })
};
