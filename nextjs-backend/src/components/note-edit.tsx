"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
    Button,
    Form,
    Input,
    Typography
} from "antd";
import type {
    FormProps
} from "antd";
import "@ant-design/v5-patch-for-react-19";

type FieldType = {
    title?: string;
    content?: string;
    tags?: string;
    author?: string;
};

const { TextArea } = Input;
const { Title } = Typography;

export default function NoteEditPage() {
    const router = useRouter();
    const [value, setValue] = useState("");

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const ccc = await fetch('/api/note', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await ccc.json();
        router.push('/admin/note-manage');
        // console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Title level={2}>写一篇日记吧！</Title>

            {/* <div> */}
            <Form
                initialValues={{}}
                labelCol={{ span: 2 }}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                scrollToFirstError
                style={{ height: 'max-content' }}
            >
                <Form.Item<FieldType>
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '' }]}
                >
                    <TextArea
                        allowClear
                        autoSize
                        onChange={(e) => setValue(e.target.value)}
                        placeholder=""
                        showCount
                        value={value}
                        variant='underlined'
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="标签"
                    name="tags"
                    rules={[{ required: true, message: '' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="作者"
                    name="author"
                    rules={[{ required: true, message: '' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">我写好啦！</Button>
                </Form.Item>
            </Form>
            {/* </div> */}

        </>
    )
}
