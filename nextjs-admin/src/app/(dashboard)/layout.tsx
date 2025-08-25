"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;
import "@ant-design/v5-patch-for-react-19";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();

    const handlerLogout = async () => {
        const c = await fetch('/api/logout', {
            method: 'DELETE'
        });
        const data = await c.json();
        if (data.success) {
            router.push('/login');
        }
    }

    return (
        <>
            <html lang="zh-CN">
                <body>
                    <Layout className="w-full h-screen">
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div className="demo-logo-vertical" />
                            <Menu
                                theme="dark"
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                items={[
                                    {
                                        key: '1',
                                        icon: <UserOutlined />,
                                        label: 'nav 1',
                                    },
                                    {
                                        key: '2',
                                        icon: <VideoCameraOutlined />,
                                        label: 'nav 2',
                                    },
                                    {
                                        key: '3',
                                        icon: <UploadOutlined />,
                                        label: 'nav 3',
                                    },
                                ]}
                            />
                        </Sider>
                        <Layout>
                            <Header
                                style={{ padding: 0, background: colorBgContainer }}
                                className=""
                            >
                                <Button
                                    type="text"
                                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{
                                        fontSize: '16px',
                                        width: 64,
                                        height: 64,
                                    }}
                                />
                                <Button type="primary" onClick={handlerLogout}>登出</Button>
                            </Header>
                            <Content
                                style={{
                                    margin: '24px 16px',
                                    padding: 24,
                                    minHeight: 280,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                {children}
                            </Content>
                            <div className="footer h-5 content-center text-center">All Rights Reserved to 葱苓sama {'2025' + '-' + new Date().getFullYear()}</div>
                        </Layout>
                    </Layout>
                </body>
            </html>
        </>
    );
}
