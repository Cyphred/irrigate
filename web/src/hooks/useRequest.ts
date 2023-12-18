import axios from "axios";

export default function useRequest() {
  const get = async (url: string) => {
    const response = await axios.get(url);
    return response.data;
  };

  const patch = async (url: string, data: unknown) => {
    const response = await axios.patch(url, data);
    if (response.status === 200) return response.data;
  };

  return {
    get,
    patch,
  };
}
