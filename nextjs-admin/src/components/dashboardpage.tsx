"use client";
import { useEffect, useState } from "react";

import {
    Card,
    Flex,
    Typography
} from "antd";
import "@ant-design/v5-patch-for-react-19";

interface Shuoshuo {
    id?: number;
    content?: string;
    tags?: string;
    created_at?: string;
}

const {
    Title
} = Typography;

export default function DashboardPage() {
    const [data, setData] = useState<Shuoshuo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/shuoshuo-get');
                if (!response.ok) {
                    throw new Error('获取数据失败');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error('获取数据时出错:', err);
            } finally { }
        };
        fetchData();
    }, []);

    return (
        <>

            <Title level={2}>仪表盘</Title>

            <Flex wrap gap="small" className="cards">
                <Card title="文章" variant="borderless" style={{ width: 250 }}>0</Card>
                <Card title="说说" variant="borderless" style={{ width: 250 }}>{data.length}</Card>
                <Card title="评论" variant="borderless" style={{ width: 250 }}>0</Card>
                <Card title="版本" variant="borderless" style={{ width: 250 }}>
                    V_0.0.1
                </Card>
                <Card title="友链" variant="borderless" style={{ width: 250 }}>0</Card>
                <Card title="分类" variant="borderless" style={{ width: 250 }}>0</Card>
            </Flex>
        </>
    )
}
