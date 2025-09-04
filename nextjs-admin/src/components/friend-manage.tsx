"use client";

import {
    Tabs,
    Typography
} from "antd";
import type {
    TabsProps
} from "antd";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '审核中',
        children: (<></>),
    },
    {
        key: '2',
        label: '已通过',
        children: (<></>),
    },
    {
        key: '3',
        label: '无法访问',
        children: (<></>),
    },
];

export default function FriendManagePage() {
    return (
        <>
            <Title level={2}>友链管理</Title>
            <Tabs
                animated
                centered
                defaultActiveKey="1"
                items={items}
            />
        </>
    )
}
