"use client";
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
    // overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

const items: MenuItem[] = [
    {
        key: '1',
        icon: <Icon icon="pixelarticons:dashboard" width="18" height="18" style={{ color: '#000' }} />,
        label: (<Link href="/">仪表盘</Link>),
    },
    {
        key: 'sub1',
        icon: <Icon icon="mdi:post-it-note-outline" width="18" height="18" />,
        label: '博文',
        children: [
            { key: '2', label: <Link href="/post-manage">管理</Link> },
            { key: '3', label: <Link href="/post-edit">编写</Link> },
            { key: '4', label: <Link href="/post-categories">标签/分类</Link> },
        ],
    },
    {
        key: 'sub2',
        icon: <Icon icon="mdi:book-open-page-variant-outline" width="18" height="18" />,
        label: '页面',
        children: [
            { key: '5', label: <Link href="/page-manage">管理</Link> },
            { key: '6', label: <Link href="/page-edit">编辑</Link> },
        ]
    },
    {
        key: '7',
        icon: <Icon icon="mdi:comment-text-multiple-outline" width="18" height="18" />,
        label: (<Link href="/comments">评论</Link>),
    },
    {
        key: 'sub3',
        icon: <Icon icon="mdi:comment-quote-outline" width="18" height="18" />,
        label: '说说',
        children: [
            { key: '8', label: <Link href="/shuoshuo-manage">管理</Link> },
            { key: '9', label: <Link href="/shuoshuo-edit">编辑</Link> },
        ]
    },
    {
        key: 'sub4',
        icon: <Icon icon="mdi:account-group-outline" width="18" height="18" />,
        label: '友链',
        children: [
            { key: '10', label: <Link href="/friend-manage">管理</Link> },
            { key: '11', label: <Link href="/friend-edit">添加</Link> },
        ]
    },
    {
        key: '12',
        icon: <Icon icon="mdi:notebook-edit-outline" width="18" height="18" />,
        label: <Link href="/notes">日记</Link>
    },
    {
        key: '13',
        icon: <Icon icon="mdi:file-multiple-outline" width="16" height="16" />,
        label: (<Link href="/files">文件</Link>),
    },
    {
        key: '999',
        icon: <Icon icon="mdi:mixer-settings" width="18" height="18" />,
        label: (<Link href="/settings">设置</Link>),
    }
];

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();

    const { token: { } } = theme.useToken();

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
                                    subMenuItemBorderRadius: 0
                                },
                            }
                        }}
                    >
                        <Layout hasSider>
                            <Sider
                                breakpoint="lg"
                                collapsedWidth={0}
                                zeroWidthTriggerStyle={{ backgroundColor: '#000' }}
                                style={siderStyle}
                            >
                                <div className="logo h-30 flex items-center justify-center">
                                    <Image src={avatar1} alt="Avatar" className="w-20 h-20 rounded-full animate-none" />
                                </div>
                                <Menu
                                    defaultSelectedKeys={['1']}
                                    items={items}
                                    mode='inline'
                                    theme="light"
                                />
                                <div className="h-16 flex items-center justify-around">
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>C</Avatar>
                                    <Button type="primary" onClick={handlerLogout}>登出</Button>
                                </div>
                            </Sider>
                            <Layout
                                style={{}}
                            >
                                <Header style={{ margin: 0, padding: 0, height: 0, background: 'none' }} />
                                <Content style={{ margin: '0', padding: '40px 20px 0', overflow: 'initial', backgroundColor: 'none', borderRadius: 0 }}>
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
