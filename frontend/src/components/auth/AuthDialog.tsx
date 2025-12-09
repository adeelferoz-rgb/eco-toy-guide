import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  authService,
  LoginSchema,
  SignupSchema,
  type LoginInput,
  type SignupInput,
} from "@/services/auth";

interface AuthDialogProps {
  trigger?: React.ReactNode;
  defaultTab?: "login" | "signup";
  onSuccess?: () => void;
}

export function AuthDialog({ trigger, defaultTab = "login", onSuccess }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupInput>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginInput) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem("token", response.access_token);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      setOpen(false);
      onSuccess?.();
      window.location.reload(); // Simple way to refresh auth state
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const onSignupSubmit = async (data: SignupInput) => {
    try {
      await authService.signup(data);
      // Auto login after signup
      const response = await authService.login(data);
      localStorage.setItem("token", response.access_token);
      
      toast({
        title: "Account Created",
        description: "Welcome to Eco Toy Guide!",
      });
      setOpen(false);
      onSuccess?.();
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Login</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Access</DialogTitle>
          <DialogDescription>
            Login or create an account to save your favorite toys.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="signup">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}