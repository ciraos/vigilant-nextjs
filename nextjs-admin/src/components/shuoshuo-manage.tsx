"use client";
import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
    Divider,
    Empty,
    Flex,
    Spin,
    Typography
} from "antd";
import "@ant-design/v5-patch-for-react-19";
import { Icon } from "@iconify/react";
import moment from "moment";

interface Shuoshuo {
    id?: number;
    content?: string;
    tags?: string;
    created_at?: string;
}

const { Title } = Typography;

export default function ShuoshuoManage() {
    const [data, setData] = useState<Shuoshuo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/shuoshuo-get');
                if (!response.ok) {
                    throw new Error('获取数据失败');
                }
                const result = await response.json();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : '发生未知错误');
                console.error('获取数据时出错:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
        />;
    }

    return (
        <>
            {/* 说说展示列表 */}
            <div className="">
                <Title level={2}>都说了些啥</Title>

                {data.length === 0 ? (
                    <Empty />
                ) : (
                    <Flex wrap gap="small">
                        {data.map((item, index) => (
                            <div key={index} className="w-60 h-40 p-4 rounded-xl bg-white">
                                <div className="h-3/4 flex flex-col justify-between border-b-1 border-b-slate-300">
                                    <p className="overflow-hidden">{item.content}</p>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <div className="flex items-center"><Icon icon="mdi:hashtag" />{item.tags}</div>
                                        <div>{moment(item.created_at).format('YYYY-MM-DD')}</div>
                                    </div>
                                </div>
                                <div className="h-10 flex items-center justify-end gap-1">
                                    <Button type="primary">编辑</Button>
                                    <Button type="primary" danger>删除</Button>
                                </div>
                            </div>
                        ))}
                    </Flex>
                )}
            </div>
        </>
    )
}
