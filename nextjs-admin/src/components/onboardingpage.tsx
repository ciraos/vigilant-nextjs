'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
// import type { CascaderProps } from 'antd';
import {
    AutoComplete,
    Button,
    // Cascader,
    // Checkbox,
    // Col,
    Form,
    Input,
    // InputNumber,
    // Row,
    // Select,
} from 'antd';
import "@ant-design/v5-patch-for-react-19";

// const { Option } = Select;

// interface DataNodeType {
//     value: string;
//     label: string;
//     children?: DataNodeType[];
// }

// const residences: CascaderProps<DataNodeType>['options'] = [
//     {
//         value: 'zhejiang',
//         label: 'Zhejiang',
//         children: [
//             {
//                 value: 'hangzhou',
//                 label: 'Hangzhou',
//                 children: [
//                     {
//                         value: 'xihu',
//                         label: 'West Lake',
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         value: 'jiangsu',
//         label: 'Jiangsu',
//         children: [
//             {
//                 value: 'nanjing',
//                 label: 'Nanjing',
//                 children: [
//                     {
//                         value: 'zhonghuamen',
//                         label: 'Zhong Hua Men',
//                     },
//                 ],
//             },
//         ],
//     },
// ];

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
        router.push('/');
        // console.log('Received values of form: ', values);
    };

    // const prefixSelector = (
    //     <Form.Item name="prefix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Option value="86">+86</Option>
    //             <Option value="87">+87</Option>
    //         </Select>
    //     </Form.Item>
    // );

    // const suffixSelector = (
    //     <Form.Item name="suffix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Option value="USD">$</Option>
    //             <Option value="CNY">¥</Option>
    //         </Select>
    //     </Form.Item>
    // );

    const [autoCompleteResult, setAutoCompleteResult] = useState<string[]>([]);

    const onWebsiteChange = (value: string) => {
        if (!value) {
            setAutoCompleteResult([]);
        } else {
            setAutoCompleteResult(['.com', '.org', '.net'].map((domain) => `${value}${domain}`));
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
                        tooltip="What do you want others to call you?"
                        rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>



                    {/* <Form.Item
                        name="residence"
                        label="Habitual Residence"
                        rules={[
                            { type: 'array', required: true, message: 'Please select your habitual residence!' },
                        ]}
                    >
                        <Cascader options={residences} />
                    </Form.Item> */}

                    {/* <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                    >
                        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                    </Form.Item> */}

                    {/* <Form.Item
                        name="donation"
                        label="Donation"
                        rules={[{ required: true, message: 'Please input donation amount!' }]}
                    >
                        <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
                    </Form.Item> */}

                    <Form.Item
                        name="website"
                        label="网站"
                        rules={[{ required: true, message: 'Please input website!' }]}
                    >
                        <AutoComplete options={websiteOptions} onChange={onWebsiteChange} placeholder="website">
                            <Input />
                        </AutoComplete>
                    </Form.Item>

                    {/* <Form.Item
                        name="intro"
                        label="简介"
                        rules={[{ required: true, message: 'Please input Intro' }]}
                    >
                        <Input.TextArea showCount maxLength={100} />
                    </Form.Item> */}

                    {/* <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                        <Select placeholder="select your gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item> */}

                    {/* <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    name="captcha"
                                    noStyle
                                    rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Button>Get captcha</Button>
                            </Col>
                        </Row>
                    </Form.Item> */}

                    {/* <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                            },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                            I have read the <a href="">agreement</a>
                        </Checkbox>
                    </Form.Item> */}

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>

                </Form>
            </div>
        </>
    );
}
