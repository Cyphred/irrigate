type StateData = {
  id: number;
  distance: number;
  gateOpen: {
    expected: boolean;
    current: boolean;
  };
  flowRate: number;
  volume: number;
  timestamp: number;
};

export default StateData;
