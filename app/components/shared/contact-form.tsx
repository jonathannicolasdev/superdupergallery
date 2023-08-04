import { Form } from "@remix-run/react"

import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "~/components"

export function ContactForm() {
  return (
    <Form>
      <div className="space-y-6">
        <CardHeader className="p-0">
          <CardTitle>Send Us a Message</CardTitle>
          <CardDescription>If you need help or want to showcase your artworks</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Select defaultValue="exhibition">
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="artist">Artist</SelectItem>
                  <SelectItem value="artwork">Artwork</SelectItem>
                  <SelectItem value="exhibition">Exhibition</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority-level">Priority Level</Label>
              <Select defaultValue="3">
                <SelectTrigger id="priority-level" className="line-clamp-1 w-full truncate">
                  <SelectValue placeholder="Expected priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Priority 1 (Highest)</SelectItem>
                  <SelectItem value="2">Priority 2</SelectItem>
                  <SelectItem value="3">Priority 3</SelectItem>
                  <SelectItem value="4">Priority 4 (Lowest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="I need help with..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please include all information relevant to your issue."
              className="min-h-[200px]"
              rows={10}
            />
          </div>
        </CardContent>

        <CardFooter className="p-0">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </div>
    </Form>
  )
}
