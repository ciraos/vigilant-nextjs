import type { Metadata } from "next";

import {
    Tabs
} from "antd";
import type {
    TabsProps
} from "antd";

export const metadata: Metadata = {
    title: "xxx | 设置",
    description: "",
    icons: "",
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '网站信息',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: '系统设置',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: '安全',
        children: 'Content of Tab Pane 3',
    },
];

export default function Settings() {
    return (
        <>
            <Tabs
                centered
                defaultActiveKey="1"
                items={items} />
        </>
    )
}
