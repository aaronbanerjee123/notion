"use client";
import { Type } from 'lucide-react'
import React from 'react'
import TypewriterComponent from 'typewriter-effect'

type Props = {}

const TypewriterTitle = (props: Props) => {
  return (
    <TypewriterComponent options={{
        loop:true
    }} onInit={(typewriter) => {
        typewriter.typeString("🚀 Supercharged Productivity").start()
        .pauseFor(1000).deleteAll()
        .typeString('AI-Powered Insights.')
        .start();
    }}></TypewriterComponent>
  )
}

export default TypewriterTitle