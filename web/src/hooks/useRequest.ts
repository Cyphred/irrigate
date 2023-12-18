import React from "react";
import { useState } from "react";
import axios from "axios";

export default function useRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]: [
    string | undefined,
    React.Dispatch<React.SetStateAction<string | undefined>>
  ] = useState();

  const get = async (url: string) => {
    setIsLoading(true);
    setError(undefined);

    const response = await axios.get(url);

    setIsLoading(false);
    if (response.status === 200) return response.data;

    if (response.data.error) setError(response.data.error as string);
    else setError(response.statusText);
  };

  const patch = async (url: string, data: unknown) => {
    setIsLoading(true);
    setError(undefined);

    const response = await axios.patch(url, data);

    setIsLoading(false);
    if (response.status === 200) return response.data;

    if (response.data.error) setError(response.data.error as string);
    else setError(response.statusText);
  };

  return {
    isLoading,
    error,
    get,
    patch,
  };
}
