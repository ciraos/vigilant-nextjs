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
    time?: string;
    created_at?: string;
}

const {
    Title
} = Typography;

export default function DashboardPage() {
    const [ssdata, setssData] = useState<Shuoshuo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/shuoshuo-get');
                if (!res.ok) {
                    throw new Error('获取数据失败');
                }
                const result = await res.json();
                //? 简单校验返回结构是否为数组
                if (!Array.isArray(result)) {
                    throw new Error('数据格式错误');
                }
                setssData(result);
                setError(null);
            } catch (err) {
                //! 并非错误，在没有发布说说的情况下，
                //! 后端会返回一个message,无法返回数组Array，
                //! 导致 fetch 报错！ 
                setError(err instanceof Error ? err.message : '发生未知错误');
                console.error('获取数据时出错:', err);
            } finally {
                setLoading(false);
            }
            // console.log(data);
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">loading..</div>;
    }

    if (error) {
        return <div className="text-slate-400">0</div>;
    }

    return (
        <>
            <Title level={2}>仪表盘</Title>

            <div className="cards flex flex-wrap justify-between gap-2 transition-all">
                <Card title="文章" variant="borderless" className="cards-item w-60">0</Card>
                <Card title="分类" variant="borderless" className="cards-item w-60">0</Card>
                <Card title="标签" variant="borderless" className="cards-item w-60">0</Card>
                <Card title="友链" variant="borderless" className="cards-item w-60">0</Card>
                <Card title="说说" variant="borderless" className="cards-item w-60">{ssdata.length}</Card>
                <Card title="评论" variant="borderless" className="cards-item w-60"></Card>
                <Card title="版本" variant="borderless" className="cards-item w-60">
                    v_0.0.1
                </Card>
            </div>
        </>
    )
}
