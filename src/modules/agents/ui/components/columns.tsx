"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AgentGetMany } from "../../types"
import { GeneratedAvatar } from "@/components/generated-avatar"
import { CornerDownRightIcon, SparklesIcon, VideoIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent name",
    cell: ({row}) => (
        <div className="flex flex-col gap-y-1">
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar variant="botttsNeutral" seed= {row.original.name} className="size-6" />
                <span className="font-semibold capitalize">{row.original.name}</span>
                </div>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                        <CornerDownRightIcon className="size-3 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
                        {row.original.instructions}
                        </span>
                    </div>
                </div>

        </div>
    )
  },
  {
    accessorKey: "model",
    header: "Engine",
    cell: ({row}) => {
      const model = (row.original as any).model || "auto";
      const isAuto = model === "auto";
      const isGemini = model.includes("gemini");
      const isLlama = model.includes("llama");

      return (
        <Badge variant="outline" className="flex items-center gap-x-1.5 border-amber-300/40 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200">
          <SparklesIcon className="size-3 text-amber-500" />
          <span className="text-xs font-medium">
            {isAuto ? "Auto (Free)" : isGemini ? "Gemini 2.0" : isLlama ? "Llama 3.3" : "GPT-4o"}
          </span>
        </Badge>
      );
    }
  },
  {
    accessorKey:"meetingCount",
    header:"Meetings",
    cell : ({row}) =>(
      <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
        <VideoIcon className="text-blue-700"/>
        {row.original.meetingCount} {row.original.meetingCount === 1? "meeting":"meetings"}
      </Badge>
    )
  }
]