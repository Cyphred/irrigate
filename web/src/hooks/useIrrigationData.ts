import axios from "axios";
import StateData from "../types/StateData";
import { useState } from "react";

export default () => {
  const [isLoading, setIsLoading] = useState(false);

  const getIrrigationData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/sensors/1`
      );
      setIsLoading(false);

      if (response.status >= 400) {
        return;
      }

      return response.data as StateData;
    } catch (err) {
      console.error(err);
    }
  };

  const setIrrigationState = async (gateOpen: boolean) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URI}/sensors/1`,
        { gateOpen }
      );
      setIsLoading(false);

      if (response.status >= 400) {
        return;
      }

      return response.data as StateData;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    isLoading,
    getIrrigationData,
    setIrrigationState,
  };
};
