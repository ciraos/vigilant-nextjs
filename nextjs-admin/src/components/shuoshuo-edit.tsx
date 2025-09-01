"use client";
import React, {
    // useEffect,
    useState
} from "react";
import { useRouter } from "next/navigation";

import {
    Button,
    Form,
    Input
} from "antd";
import type {
    FormProps,
} from "antd";
import "@ant-design/v5-patch-for-react-19";

type FieldType = {
    content?: string;
    tags?: string;
    created_at?: string;
};

const { TextArea } = Input;

export default function ShuoshuoEdit() {
    const router = useRouter();
    const [value, setValue] = useState("");

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const v = await fetch('/api/shuoshuo', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await v.json();
        router.push('/shuoshuo-manage');
        // console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {/* 发布说说 */}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: '25px 0 0' }}
                initialValues={{}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: '' }]}
                >
                    <TextArea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder=""
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="标签"
                    name="tags"
                    rules={[{ required: true, message: '' }]}
                >
                    <TextArea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder=""
                        showCount
                        maxLength={10}
                    />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">我写好啦！</Button>
                </Form.Item>
            </Form>
        </>
    )
}
