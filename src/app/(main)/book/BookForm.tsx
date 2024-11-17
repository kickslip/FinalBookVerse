"use client";

import { BookValues, bookSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Book } from "@prisma/client";
import Textarea2 from "@/components/ui/textarea2";

interface BookFormProps {
  onSubmit: SubmitHandler<BookValues>;
  book?: Book;
}

export default function BookForm({ onSubmit, book }: BookFormProps) {
  const form = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      description: book?.description ?? "",
      publishYear: book?.publishYear ?? new Date().getFullYear(),
      price: book?.price ?? 0,
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea2 {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="publishYear"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Publish Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
          {book ? "Update Book" : "Create Book"}
        </LoadingButton>
      </form>
    </Form>
  );
}
