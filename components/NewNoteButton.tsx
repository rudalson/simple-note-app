"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";

type Props = {
  user: User | null;
};

function NewNoteButton({ user }: Props) {
  return (
    <Button
      variant="secondary"
      className="w-24"
    >
        NewNoteButton
    </Button>
  );
}

export default NewNoteButton;