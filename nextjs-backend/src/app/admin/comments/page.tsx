import { Metadata } from "next";

import { Tabs } from "antd";
import type { TabsProps } from "antd";
import "@ant-design/v5-patch-for-react-19";

export const metadata: Metadata = {
    title: "xxx | 评论"
}

const items: TabsProps['items'] = [
    {
        key: '1',
        label: `未读`,
        children: (<></>),
    },
    {
        key: '2',
        label: `已读`,
        children: (<></>),
    },
    {
        key: '3',
        label: `垃圾`,
        children: (<></>),
    }
];

export default function Comments() {
    return (
        <>
            <Tabs
                animated
                centered
                defaultActiveKey="1"
                items={items}
            />
        </>
    )
}
