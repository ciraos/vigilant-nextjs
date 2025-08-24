"use client";
// import { useRouter } from 'next/navigation';
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
    email?: string;
    // remember?: string;
};

export default function Register() {
    // const router = useRouter();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // const e = await fetch('/api/register', {
        //     method: 'POST',
        //     body: JSON.stringify(values),
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // await e.json();
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div
                className='w-max h-max py-3 px-6 rounded-xl bg-slate-200 flex justify-center items-center'
            >
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
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
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入您的密码！' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="邮箱"
                        name="email"
                        rules={[{ required: false, message: '请输入您的邮箱！' }]}
                    >
                        <Input placeholder='选填' />
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
