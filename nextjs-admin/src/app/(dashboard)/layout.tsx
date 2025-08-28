"use client";
import { useEffect, useState } from "react";
import {
    useRouter,
    // redirect
} from "next/navigation";
import "../globals.css";
import { Button, Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;
import "@ant-design/v5-patch-for-react-19";
import { Icon } from "@iconify/react";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        //? 检查是否需要显示引导页面
        const checkAdminStatus = async () => {
            try {
                const res = await fetch('/api/check-admin');
                const data = await res.json();
                //? 如果没有任何用户，跳转到引导注册页面
                if (!data.has_users) {
                    router.push('/onboarding');
                } else {
                    setLoading(false);
                    // router.push('/');
                }
            } catch (error) {
                console.error('错误：检查管理员状态！:', error);
                setLoading(false);
            }
        };
        checkAdminStatus();
    }, [router]);

    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();

    if (loading) { return (<html lang="zh-CN"><body><div className="flex items-center justify-center min-h-screen"><div id="ghost"><div id="red"><div id="pupil"></div><div id="pupil1"></div><div id="eye"></div><div id="eye1"></div><div id="top0"></div><div id="top1"></div><div id="top2"></div><div id="top3"></div><div id="top4"></div><div id="st0"></div><div id="st1"></div><div id="st2"></div><div id="st3"></div><div id="st4"></div><div id="st5"></div><div id="an1"></div><div id="an2"></div><div id="an3"></div><div id="an4"></div><div id="an5"></div><div id="an6"></div><div id="an7"></div><div id="an8"></div><div id="an9"></div><div id="an10"></div><div id="an11"></div><div id="an12"></div><div id="an13"></div><div id="an14"></div><div id="an15"></div><div id="an16"></div><div id="an17"></div><div id="an18"></div></div><div id="shadow"></div></div></div></body></html>); }

    const handlerLogout = async () => {
        const c = await fetch('/api/logout', {
            method: 'DELETE'
        });
        const data = await c.json();
        if (data.success) {
            router.push('/login');
        }
        // console.log({ data });
    };

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
