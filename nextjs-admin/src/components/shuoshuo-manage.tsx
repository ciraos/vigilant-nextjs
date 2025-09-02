"use client";
import React, { useEffect, useState } from "react";

import {
    Alert,
    Button,
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

const {
    Title
} = Typography;

export default function ShuoshuoManage() {
    const [data, setData] = useState<Shuoshuo[]>([]);
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
                setData(result);
                setError(null);
            } catch (err) {
                //! 并非错误，在没有发布说说的情况下，
                //! 后端会返回一个message,无法返回数组Array，
                //! 导致 fetch 报错！ 
                setError(err instanceof Error ? err.message : '发生未知错误');
                // console.error('获取数据时出错:', err);
            } finally {
                setLoading(false);
            }
            // console.log(data);
        };
        fetchData();
    }, []);

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <Alert
            message="警告"
            description="没有说说，可能是您还没有发布说说！"
            type="warning"
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
                    <Flex wrap gap={16}>
                        {data.map((item) => {
                            const content = item.content ?? '';
                            const tags = item.tags ?? '';
                            const createdAt = item.created_at ? moment(item.created_at) : null;
                            const formattedDate = createdAt?.isValid() ? createdAt.format('YYYY-MM-DD') : '未知日期';
                            return (
                                <div key={item.id ?? `fallback-${item.content}-${item.created_at}`} className="w-72 h-40 p-4 rounded-xl bg-white">
                                    <div className="h-3/4 flex flex-col justify-between border-b-1 border-b-slate-300">
                                        <p className="overflow-hidden">{content}</p>
                                        <div className="flex justify-between text-sm text-slate-600">
                                            <div className="flex items-center">
                                                <Icon icon="mdi:hashtag" />
                                                {tags}
                                            </div>
                                            <div>{formattedDate}</div>
                                        </div>
                                    </div>
                                    <div className="h-10 flex items-center justify-end gap-1">
                                        <Button type="primary">编辑</Button>
                                        <Button type="primary" danger>删除</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </Flex>
                )}
            </div>
        </>
    );
}
