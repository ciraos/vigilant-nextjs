"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";

import { Button, Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;
import "@ant-design/v5-patch-for-react-19";
import { Icon } from "@iconify/react";

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
        // console.log({ data });
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
                                        icon: <Icon icon="mdi:monitor-dashboard" width="14" height="14" />,
                                        label: '仪表盘',
                                    },
                                    {
                                        key: '2',
                                        icon: <Icon icon="mdi:post-it-notes-outline" width="14px" height="14px" />,
                                        label: '博文',
                                    },
                                    {
                                        key: '3',
                                        icon: <Icon icon="mdi:book-open-page-variant-outline" width="14px" height="14px" />,
                                        label: '页面',
                                    },
                                    {
                                        key: '4',
                                        icon: <Icon icon="mdi:wrench-settings-outline" width="14px" height="14px" />,
                                        label: '设置',
                                    }
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
                                    icon={collapsed ? <Icon icon="ri:menu-fold-4-line" width="14px" height="14px" /> : <Icon icon="ri:menu-unfold-4-line" width="14px" height="14px" />}
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
