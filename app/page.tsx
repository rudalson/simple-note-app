"use client"

import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const isBodyEmpty = body.trim().length === 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-8 px-6 py-12">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">새 노트 작성</h1>
          <p className="text-sm text-muted-foreground">
            타이틀과 본문을 입력하고 확인 버튼을 눌러주세요.
          </p>
        </header>
        <form className="flex flex-1 flex-col gap-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">
              타이틀
            </label>
            <Input
              id="title"
              placeholder="노트의 제목을 입력하세요"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="flex flex-1 flex-col space-y-2">
            <label className="text-sm font-medium" htmlFor="body">
              본문
            </label>
            <Textarea
              id="body"
              placeholder="본문 내용을 입력하세요"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end border-t border-border pt-6">
            <Button type="submit" disabled={isBodyEmpty}>
              확인
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
