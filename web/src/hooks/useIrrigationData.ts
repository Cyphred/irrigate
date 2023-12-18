import useRequest from "./useRequest";
import StateData from "../types/StateData";

export default () => {
  const { isLoading, error, get, patch } = useRequest();

  const getIrrigationData = async () => {
    const data = await get(`${import.meta.env.VITE_API_URI}/sensors/1`);
    return data as StateData;
  };

  const setIrrigationState = async (gateOpen: boolean) => {
    const data = await patch(`${import.meta.env.VITE_API_URI}/sensors/1`, {
      gateOpen,
    });
    return data as StateData;
  };

  return {
    isLoading,
    error,
    getIrrigationData,
    setIrrigationState,
  };
};
