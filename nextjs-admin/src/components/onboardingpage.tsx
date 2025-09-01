'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    AutoComplete,
    Button,
    Form,
    Input,
} from 'antd';
import "@ant-design/v5-patch-for-react-19";

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export default function OnboardingPage() {
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const y = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await y.json();
        // router.push('/');
        // console.log('Received values of form: ', values);
    };

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

    const onWebsiteChange = (value: string) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.top', '.org', '.net'].map((domain) => `${value}${domain}`));
        }
    };

    const websiteOptions = autoCompleteResult.map((website) => ({
        label: website,
        value: website,
    }));

    return (
        <>
            <div
                className="py-6 px-10 rounded-xl bg-slate-200"
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{ residence: ['zhejiang', 'hangzhou', 'xihu'], prefix: '86' }}
                    style={{ maxWidth: 600 }}
                    scrollToFirstError
                >

                    <Form.Item
                        name="username"
                        label="用户名"
                        tooltip="您想让我们怎么称呼您？"
                        rules={[{ required: true, message: '请输入您的用户名！', whitespace: false }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入您的密码！', },]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[{ required: true, message: '请再次确认您的密码！', }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('您输入的新密码不匹配！')); }, }),]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="头像"
                        rules={[{ required: false, message: '请输入头像链接！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ type: 'email', message: '输入的邮箱无效！', }, { required: false, message: '请输入您的邮箱！', },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="website"
                        label="网站"
                        rules={[{ required: false, message: '请输入网站！' }]}
                    >
                        <AutoComplete options={websiteOptions} onChange={onWebsiteChange} placeholder="website">
                            <Input />
                        </AutoComplete>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>

                </Form>
            </div >
        </>
    );
}
