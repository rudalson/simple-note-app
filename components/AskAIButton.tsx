"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

import { ArrowUpIcon } from "lucide-react";

type Props = {
  user: User | null;
};

function AskAIButton({ user }: Props) {
  return (
    <Button className="ml-auto size-8 rounded-full">
            <ArrowUpIcon className="text-background" />
    </Button>
)
}

export default AskAIButton;