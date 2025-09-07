import type { Metadata } from "next";

import {
    Tabs
} from "antd";
import type {
    TabsProps
} from "antd";
import "@ant-design/v5-patch-for-react-19";

export const metadata: Metadata = {
    title: "xxx | 设置"
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: '网站信息',
        children: (<></>),
    },
    {
        key: '2',
        label: '系统设置',
        children: (<></>),
    },
    {
        key: '3',
        label: '安全',
        children: (<></>),
    },
];

export default function Settings() {
    return (
        <>
            <Tabs
                animated
                centered
                defaultActiveKey="1"
                items={items} />
        </>
    )
}
