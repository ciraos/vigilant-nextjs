"use client";

import {
    Typography
} from "antd";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

export default function NoteManagePage() {
    return (
        <>
            <Title level={2}>日记管理</Title>
        </>
    );
}
