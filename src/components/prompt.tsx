"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Wand2 } from "lucide-react";

export default function Prompt() {
  const [prompt, setPrompt] = useState("");

  return (
    <Card className="w-full max-w-2xl backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-6 w-6" />
          Describe Your 3D Model
        </CardTitle>
        <CardDescription>
          Be as detailed as possible for better results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Textarea
            placeholder="A sleek modern lamp with a curved base and warm LED lighting..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">
              {prompt.length} / 500 characters
            </span>
            <Button type="submit">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
