'use client'
import React, { useMemo, useRef, useState } from 'react'
import {EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from './TipTapMenuBar';
import { Button } from './ui/button';
import { useEffect } from "react";
import { useDebounce } from '@/lib/useDebounce';
import { useMutation } from '@tanstack/react-query';
import { NoteType } from '@/lib/db/schema';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import Text from '@tiptap/extension-text'
import {useCompletion} from 'ai/react';

type Props = {
    note: NoteType
}

const TipTapEditor = ({note}: Props) => {
    const [editorState,setEditorState] = useState(note.editorState || `<h1>${note.name}</h1>`);
    const {complete, completion} = useCompletion({
        api:'/api/completion',
        onError: (error) => {
            console.error('Completion error:', error);
        },
        onFinish: (completion) => {
            console.log('Finished completion:', completion);
        }
    })


    const saveNote = useMutation({mutationFn: async () => {
        const response = await axios.post('/api/saveNote',
            {
                noteId:note.id,  
                editorState
            }
        )
        return response.data;
    }})

    const debouncedEditorState = useDebounce(editorState, 500);

    useEffect(() => {
        if(debouncedEditorState === '') return;

        saveNote.mutate(undefined, {
            onSuccess: (data) => console.log('Success update!', data),
            onError: err => console.error('Error update!', err)

        })
    },[debouncedEditorState])

    const editor = useEditor({
        autofocus: true,
        extensions: [
            StarterKit, 
            Text.extend({
                addKeyboardShortcuts() {
                    return {
                        'Shift-a': () => {
                            console.log('Shift-A pressed'); // Debug log
                            if (!this.editor) {
                                console.log('No editor found');
                                return false;
                            }
                            const text = this.editor.getText();
                            console.log('Current text:', text); // Debug log
                            const prompt = text.split(' ').slice(-30).join(' ');
                            console.log('Prompt being sent:', prompt); // Debug log
                            complete(prompt);
                            return true;
                        }
                    }
                }
            })
        ],
        content: editorState,
        onUpdate: ({editor}) => {
            setEditorState(editor.getHTML());
        }, 
    });

    const lastCompletion = useRef('');


    useEffect(() => {
        if(!editor || !completion) return
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        editor.commands.insertContent(diff);
    },[completion,editor])

   

  return (
    <>
    <div className="flex">
        {editor && (
        <TipTapMenuBar editor={editor}/> 
        )}
        <Button className="ml-auto"disabled={saveNote.isPending}>
           {saveNote.isPending ? (
                <>
                <Loader2 className="w-4 h-4 animate-spin"/>
                Saving
                </>
            ) : (
               <>Save</>
            )}
        </Button>
    </div>

        <div className="prose prose-sm w-full mt-4">
            <EditorContent editor={editor}/>
        </div>

        <div className="h-4"></div>

        <span className="text-sm">
            Tip: Press{" "}
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                Shift+A 
            </kbd>{" "}
            For AI autocomplete
        </span>

    </>
  )
}

export default TipTapEditor