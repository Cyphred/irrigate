import { Liquid } from "@ant-design/plots";
import useIrrigationData from "../hooks/useIrrigationData";
import React, { useEffect, useState } from "react";
import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Flex, List, Switch, Tag, Typography } from "antd";
import StateData from "../types/StateData";
import { Gauge } from "@ant-design/plots";

export default function IrrigationControl() {
  const { isLoading, getIrrigationData, setIrrigationState } =
    useIrrigationData();

  const [data, setData]: [
    StateData | undefined,
    React.Dispatch<React.SetStateAction<StateData | undefined>>
  ] = useState();

  const getData = async () => {
    const result = await getIrrigationData();
    if (result) {
      setData(result);
    }
  };

  const handleChangeIrrigationState = async (gateOpen: boolean) => {
    const result = await setIrrigationState(gateOpen);
    if (result) setData(result);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data && isLoading) {
    return (
      <Flex gap={8} align="center" justify="center" style={{ flexGrow: 1 }}>
        <span style={{ fontSize: 16 }}>
          <LoadingOutlined />
        </span>
        <Typography.Text>Loading irrigation data</Typography.Text>
      </Flex>
    );
  }

  if (!data) {
    return (
      <Flex justify="center">
        <Typography.Text type="secondary">No data</Typography.Text>
      </Flex>
    );
  }

  return (
    <>
      <List bordered>
        <List.Item>
          <Typography.Text>Reload data</Typography.Text>
          <Button onClick={getData} icon={<ReloadOutlined />} />
        </List.Item>
        <List.Item>
          <Flex gap={8}>
            <Typography.Text>Gate Open</Typography.Text>
            {data ? (
              data.gateOpen.current ? (
                <Tag color="success">Open</Tag>
              ) : (
                <Tag color="error">Closed</Tag>
              )
            ) : (
              <Tag color="processing">Unknown</Tag>
            )}
          </Flex>
          <Switch
            size="default"
            disabled={isLoading}
            onChange={(checked) => handleChangeIrrigationState(checked)}
            checked={data.gateOpen.expected}
          />
          {isLoading && <LoadingOutlined />}
        </List.Item>
        <List.Item>
          <Typography.Text>Flow Rate</Typography.Text>
          <Typography.Text>{data.flowRate}L / min</Typography.Text>
        </List.Item>
        <List.Item>
          <Typography.Text>Water level</Typography.Text>
          <Typography.Text>{data.waterLevel} cm</Typography.Text>
        </List.Item>
      </List>
      <Flex gap={16}>
        <LiquidLevel
          percent={
            data.waterLevel / parseInt(import.meta.env.VITE_MAX_WATER_DEPTH)
          }
        />
        <FlowRateGauge percent={data.flowRate / 30} rate={data.flowRate} />
      </Flex>
    </>
  );
}

export function LiquidLevel({ percent }: { percent: number }) {
  const config = {
    percent,
    outline: {
      border: 2,
      distance: 8,
    },
    wave: {
      length: 256,
    },
  };

  return <Liquid style={{ width: 200 }} autoFit width={200} {...config} />;
}

const FlowRateGauge = (props: { rate: number; percent: number }) => {
  const config = {
    percent: props.percent,
    range: {
      color: "#30BF78",
    },
    indicator: {
      pointer: {
        style: {
          stroke: "#D0D0D0",
        },
      },
      pin: {
        style: {
          stroke: "#D0D0D0",
        },
      },
    },
    axis: {
      label: {
        formatter(v) {
          return Number(v) * 30;
        },
      },
      subTickLine: {
        count: 5,
      },
    },
    statistic: {
      content: {
        formatter: () => `${props.rate.toFixed(0)}L/min`,
        style: {
          color: "rgba(0,0,0,0.65)",
          fontSize: 16,
        },
      },
    },
  };
  return <Gauge style={{ width: 200 }} {...config} />;
};
