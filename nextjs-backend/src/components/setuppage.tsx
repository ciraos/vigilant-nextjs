'use client';
import { useRouter } from "next/navigation";
import {
    Button,
    Form,
    Input,
    Select,
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

const { Option } = Select;

const selectBefore = (
    <Select defaultValue="http://">
        <Option value="http://">http://</Option>
        <Option value="https://">https://</Option>
    </Select>
);
const selectAfter = (
    <Select defaultValue=".com">
        <Option value=".cc">.cc</Option>
        <Option value=".cn">.cn</Option>
        <Option value=".com">.com</Option>
        <Option value=".com.cc">.com.cn</Option>
        <Option value=".cyou">.cyou</Option>
        <Option value=".fun">.fun</Option>
        <Option value=".jp">.jp</Option>
        <Option value=".net">.net</Option>
        <Option value=".org">.org</Option>
        <Option value=".top">.top</Option>
    </Select>
);

export default function SetupPage() {
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        const y = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' }
        });
        await y.json();
        router.push('/admin/login');
        // console.log('Received values of form: ', values);
    };

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
                    initialValues={{}}
                    style={{ maxWidth: 600 }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        tooltip="您想让别人怎么称呼您？"
                        rules={[{ required: true, message: '请输入您的昵称！', whitespace: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="用户名"
                        tooltip="这是您用来登录账户的name："
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
                        <Input
                            addonBefore={selectBefore}
                            addonAfter={selectAfter}
                        />
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>
                </Form>
            </div >
        </>
    );
}
