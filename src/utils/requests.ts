export const getRequest = async (url: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  return data
};
