import { Metadata } from 'next';

import Notepage from '@/components/notepage';

export const metadata: Metadata = {
    title: '日记',
}

export default function Notes() {
    return (
        <>
            <Notepage />
        </>
    )
}
