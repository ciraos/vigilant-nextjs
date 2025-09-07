"use client";
import React, {
    // useEffect,
    useState
} from "react";
import { useRouter } from "next/navigation";

import {
    Button,
    Form,
    Input,
    Typography
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

const { Title } = Typography;

export default function ShuoshuoEditPage() {
    const router = useRouter();
    const [value, setValue] = useState("");

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const v = await fetch('/api/shuoshuo', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await v.json();
        router.push('/admin/shuoshuo-manage');
        // console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {/* 发布说说 */}
            <Title level={2}>发布说说</Title>

            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                style={{ width: '100%', margin: '0' }}
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
                        allowClear
                        autoSize
                        maxLength={500}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder=""
                        showCount
                        value={value}
                        variant="underlined"
                    />
                </Form.Item>

                <Form.Item<FieldType>
                    label="标签"
                    name="tags"
                    rules={[{ required: true, message: '' }]}
                >
                    <TextArea
                        allowClear
                        autoSize
                        maxLength={10}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder=""
                        showCount
                        value={value}
                        variant="underlined"
                    />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">我写好啦！</Button>
                </Form.Item>
            </Form>
        </>
    )
}
