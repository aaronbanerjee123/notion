"use client";
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { useRouter } from "next/navigation";
import {put} from '@vercel/blob';


type Props = {};

const CreateNoteDialog = (props: Props) => {

const router = useRouter();
const [input, setInput] = useState("");
const createNotebook = useMutation({ mutationFn: async () => {
    const response = await axios.post<{ note_id: string }>('/api/createNoteBook', {
        name: input
    });
    return response.data;
}})

const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(input === ''){
        window.alert('Please enter a proper name for your notebook')
    }

    createNotebook.mutate(undefined,{
        onSuccess: ({note_id}) => 
            {
                console.log(`Created new note - ${note_id}`)
                router.push(`/notebook/${note_id}`); //router is for client components
            },
        onError: (error) => {
            console.error(error)
            window.alert("Failed to create a new notebook")
        }
    })
}
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600">New Note Book</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
      <DialogHeader>
        <DialogTitle>
            New Notebook
        </DialogTitle>

        <DialogDescription>
        You can create a new note by clicking the button below.

        </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
            <Input placeholder="Name..." value={input} onChange={(e) => setInput(e.target.value)}/>
            <div className="h-4"></div>
            <div className="flex items-center gap-2">
                <Button type="reset" variant="secondary">Cancel</Button>
                <Button type="submit" className="bg-green-600" disabled={createNotebook.isPending}>{createNotebook.isPending ? (
        <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
        </>
    ) : (
        "Create"
    )}</Button>
            </div>
        </form>

      </DialogContent>

    </Dialog>
  );
};

export default CreateNoteDialog;
