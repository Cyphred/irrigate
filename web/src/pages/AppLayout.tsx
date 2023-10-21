import { UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Image, Flex, Typography } from "antd";
import { useState } from "react";
import WaterIcon from "@mui/icons-material/Water";
import { Outlet } from "react-router-dom";

const { Content, Footer, Sider } = Layout;
const { Link } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Irrigations", "1", <WaterIcon />),
  getItem("User", "sub1", <UserOutlined />, [getItem("Log out", "5")]),
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Flex justify="center" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <Image
            src={collapsed ? "/icon.png" : "/logo.png"}
            style={{ height: 52 }}
          />
        </Flex>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: 16 }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Built using Ant Design by{" "}
          <Link href="mailto:jeremyzantua@gmail.com" target="_blank">
            Jeremy Andrews Zantua
          </Link>{" "}
          |
          <Link href="https://github.com/Cyphred/irrigate" target="_blank">
            Github
          </Link>
        </Footer>
      </Layout>
    </Layout>
  );
}
