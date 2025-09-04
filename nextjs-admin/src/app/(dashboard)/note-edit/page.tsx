import { Metadata } from 'next';

import NoteEditPage from '@/components/note-edit';

export const metadata: Metadata = {
    title: 'xxx | 日记编写',
}

export default function NoteEdit() {
    return (
        <>
            <NoteEditPage />
        </>
    )
}
