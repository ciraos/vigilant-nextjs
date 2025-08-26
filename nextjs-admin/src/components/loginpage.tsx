"use client";
import { useRouter } from 'next/navigation';
import type { FormProps } from 'antd';
import {
    Button,
    // Checkbox,
    Form,
    Input
} from 'antd';
import "@ant-design/v5-patch-for-react-19";

type FieldType = {
    username?: string;
    password?: string;
    // remember?: string;
};

export default function LoginPage() {
    const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const b = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await b.json();
        router.push('/');
        // console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div
                className='login_Form-div w-max h-max bg-slate-200 pt-4 px-4 rounded-xl shadow-md hover:shadow-xl'
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ remember: false }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入您的用户名！' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密&nbsp;&nbsp;&nbsp;码"
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码！' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item> */}

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}
