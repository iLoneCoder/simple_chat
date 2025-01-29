import { useEffect } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector, useDispatch } from "react-redux" 
import { useNavigate } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice"

const formSchema = z.object({
  username: z.string().min(1,{ message: "Username is required" }),
  password: z.string().min(1, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const { user, isSuccess, isError, isLoading, message } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(values) {
    console.log(values);
    const userData = {
      username: values.username,
      password: values.password
    }

    dispatch(login(userData))
    // Add your login logic here
  }

  function onError(errors) {
    console.log('Form errors:', errors);
  }

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (user || isSuccess) {
        navigate("/")
    }

    dispatch(reset())
  }, [isSuccess, isError, message, user])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Remember me</FormLabel>
              </FormItem>
            )}
          />
          <Button variant="link" className="px-0 text-sm" type="button">
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </Form>
  );
}

