import * as React from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, MessageSquare, Search, BookOpen, BarChart3, Tag, Download, Sun, Moon, Monitor } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTheme } from "@/components/ThemeProvider"

export function GlobalCommandMenu() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/conversations"))}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Conversations
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/search"))}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/tags"))}>
            <Tag className="mr-2 h-4 w-4" />
            Tags
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/prompts"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            Prompts
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/export"))}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            System Default
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
