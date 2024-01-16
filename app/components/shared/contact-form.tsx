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
  Textarea,
} from "~/components"

export function ContactForm() {
  return (
    <Form method="POST">
      <div className="space-y-6">
        <CardHeader className="p-0">
          <CardTitle>Send Us a Message</CardTitle>
          <CardDescription>If you need help or want to showcase your artworks</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-0">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="name@example.com" name="email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name" name="name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="I need help with..." name="subject" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Please include all information relevant to your issue."
              className="min-h-[200px]"
              name="description"
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
