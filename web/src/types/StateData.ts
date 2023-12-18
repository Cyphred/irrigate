type StateData = {
  id: number;
  waterLevel: number;
  gateOpen: {
    expected: boolean;
    current: boolean;
  };
  flowRate: number;
  volume: number;
  timestamp: number;
};

export default StateData;
