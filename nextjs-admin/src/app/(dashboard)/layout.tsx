"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import "../globals.css";
import avatar1 from "@/app/images/avatar1.avif";

import {
    Avatar,
    Button,
    ConfigProvider,
    Layout,
    Menu,
    theme
} from "antd";
import type {
    GetProp,
    MenuProps
} from 'antd';
import "@ant-design/v5-patch-for-react-19";
import { Icon } from "@iconify/react";

type MenuItem = GetProp<MenuProps, 'items'>[number];

const { Sider, Header, Content, Footer } = Layout;

const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
    borderRight: '1px solid #eee',
};

const items: MenuItem[] = [
    {
        key: '1',
        icon: <Icon icon="pixelarticons:dashboard" width="18px" height="18px" style={{ color: '#000' }} />,
        label: (<Link href="/">仪表盘</Link>
        ),
    },
    {
        key: 'sub1',
        icon: <Icon icon="mdi:post-it-note-outline" width="18px" height="18px" />,
        label: '博文',
        children: [
            { key: '3', label: <Link href="/post-manage">管理</Link> },
            { key: '4', label: <Link href="/post-edit">编写</Link> },
            { key: '5', label: <Link href="/post-categories">分类</Link> },
        ],
    },
    {
        key: 'sub2',
        icon: <Icon icon="mdi:book-open-page-variant-outline" width="18px" height="18px" />,
        label: '页面',
        children: [
            { key: '6', label: <Link href="/page-manage">管理</Link> },
            { key: '7', label: <Link href="/page-edit">编辑</Link> },
        ]
    },
    {
        key: '8',
        icon: <Icon icon="mdi:comment-text-multiple-outline" width="18px" height="18px" />,
        label: <Link href="/comments">评论</Link>,
    },
    {
        key: '9',
        icon: <Icon icon="mdi:comment-quote-outline" width="18px" height="18px" />,
        label: <Link href="/say">说说</Link>,
    },
    {
        key: '999',
        icon: <Icon icon="mdi:mixer-settings" width="18px" height="18px" />,
        label: <Link href="/settings">设置</Link>,
    }
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const {
        token: {
            colorBgContainer
        }
    } = theme.useToken();

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
                }
            } catch (error) {
                console.error('错误：检查管理员状态！:', error);
                setLoading(false);
            }
        };
        checkAdminStatus();
    }, [router]);

    if (loading) { return (<html lang="zh-CN"><body><div className="flex items-center justify-center min-h-screen"><div id="ghost"><div id="red"><div id="pupil"></div><div id="pupil1"></div><div id="eye"></div><div id="eye1"></div><div id="top0"></div><div id="top1"></div><div id="top2"></div><div id="top3"></div><div id="top4"></div><div id="st0"></div><div id="st1"></div><div id="st2"></div><div id="st3"></div><div id="st4"></div><div id="st5"></div><div id="an1"></div><div id="an2"></div><div id="an3"></div><div id="an4"></div><div id="an5"></div><div id="an6"></div><div id="an7"></div><div id="an8"></div><div id="an9"></div><div id="an10"></div><div id="an11"></div><div id="an12"></div><div id="an13"></div><div id="an14"></div><div id="an15"></div><div id="an16"></div><div id="an17"></div><div id="an18"></div></div><div id="shadow"></div></div></div></body></html>); }

    const handlerLogout = async () => {
        const c = await fetch('/api/logout', {
            method: 'DELETE'
        });
        const data = await c.json();
        if (data.success) {
            router.push('/login');
        }
        // console.log( data );
    };

    return (
        <>
            <html lang="zh-CN">
                <body>
                    <ConfigProvider
                        theme={{
                            algorithm: theme.defaultAlgorithm,
                            token: {},
                            components: {
                                Layout: {
                                    siderBg: '#fff'
                                },
                                Menu: {
                                    itemHoverBg: '#39C5BB',
                                    darkItemHoverBg: '#39C5BB',
                                    subMenuItemBorderRadius: 0
                                },
                                // Switch: {}
                            }
                        }}
                    >
                        <Layout hasSider>
                            <Sider style={siderStyle}>
                                <div className="logo h-30 flex items-center justify-center">
                                    <Image src={avatar1} alt="Avatar" className="w-20 h-20 rounded-full animate-none" />
                                </div>
                                <Menu
                                    // style={{}}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode='inline'
                                    items={items}
                                />
                                <div className="h-16 flex items-center justify-around">
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Button type="primary" onClick={handlerLogout}>登出</Button>
                                </div>
                            </Sider>
                            <Layout>
                                <Header style={{ padding: 0, background: colorBgContainer }} />
                                <Content style={{ margin: '24px 16px 0', padding: '0 20px', overflow: 'initial', backgroundColor: '#fff', borderRadius: 12 }}>
                                    {children}
                                </Content>
                                <Footer style={{ textAlign: 'center' }}>
                                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                                </Footer>
                            </Layout>
                        </Layout>
                    </ConfigProvider>
                </body>
            </html>
        </>
    );
}
