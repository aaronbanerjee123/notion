'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from "next/navigation";
import axios from 'axios';  // Make sure axios is imported

type Props = {
    noteId: number
}

const DeleteButton = ({noteId}: Props) => {
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            const response = await axios.delete(`/api/deleteNoteBook/${noteId}`);
            
            if (response.status >= 200 && response.status < 300) {
                router.push('/dashboard');
            }
        } catch (error) {
            throw new Error('Error deleting the note');
        }
    }

    return (
        <Button className="ml-auto bg-green-600" onClick={(e) => handleDelete(e)}>
            Delete Button
        </Button>
    )
}

export default DeleteButton