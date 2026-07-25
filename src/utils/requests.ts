export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getRequest = async <T>(
  url: string,
  page?: number,
  limit?: number,
): Promise<PaginatedResponse<T>> => {
  const params = new URLSearchParams();
  if (page !== undefined) params.set('page', String(page));
  if (limit !== undefined) params.set('limit', String(limit));
  const query = params.toString();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/${url}${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.json();
};

export const updateRequest = async <T>(
  url: string,
  isEdit: boolean,
  data: Partial<T>,
) => {
  const method = isEdit ? 'PUT' : 'POST';

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const deleteRequest = async <T>(url: string): Promise<T> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};
