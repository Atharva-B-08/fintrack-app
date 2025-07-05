import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
 
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormControl, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast"; 
import { useNavigate } from "react-router-dom";

const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters."

  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function Signup() {
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    mode: 'onChange'
  });

  const { register, handleSubmit: formSubmit, formState: { errors }, control } = form;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: ""
  });

  // const validateForm = () => {
  //   if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
  //     setError("All fields are required");
  //     return false;
  //   }

  //   if (formData.password !== formData.confirmPassword) {
  //     setError("Passwords do not match");
  //     return false;
  //   }

  //   if (formData.password.length < 6) {
  //     setError("Password must be at least 6 characters");
  //     return false;
  //   }

  //   if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  //     setError("Please enter a valid email");
  //     return false;
  //   }

  //   return true;
  // };
  

  const handleSubmit = async (data) => {
    setIsLoading(true); 
    try {
      // Simulate API call
      // when i called the api can i get image field from backend
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("image", image);
      // formData.forEach((value, key) => {
      //   console.log(key, value);
      // });

      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }
    
      toast.success('Account created successfully! Redirecting...');
      
      // Redirect to login after success
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-white-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-white "  >
        <CardHeader className="text-center">
          
        <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">FT</span>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-2xl font-bold text-blue-600 ">FinTrak</h1>
              <p className="text-gray-600 text-sm">Financial Management System</p>
            </div>
          </div>
   
        </CardHeader>
        
        <CardContent>
          <div className="text-center mb-2">
            <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-1">
              Join FinTrak and start managing your finances
            </p>
          </div>

          {(error || success) && (
            <Alert variant={error ? "destructive" : "success"} className="mb-4">
              {error ? (
                <ExclamationTriangleIcon className="h-4 w-4" />
              ) : (
                <CheckCircledIcon className="h-4 w-4" />
              )}
              <AlertDescription>
                {error || success}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={formSubmit(handleSubmit)} className="space-y-4 ">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Full Name</Label>
                    <FormControl>
                      <Input
                        id="name"
                        {...field}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage>
                      {errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email Address</Label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        placeholder="john@example.com"
                        autoComplete="email" />
                    </FormControl>
                    <FormMessage>
                      {errors.email?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                          placeholder="••••••"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-blue-600" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage>
                      {errors.password?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          placeholder="••••••"
                          autoComplete="new-password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-blue-600" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage>
                      {errors.confirmPassword?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/*  profile image field */}

              <FormField
  control={control}
  name="image"
  render={() => (
    <FormItem>
      <Label htmlFor="image">Profile Image</Label>
      <FormControl>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            const maxSize = 5 * 1024 * 1024;

            if (file) {
              if (file.size > maxSize) {
                toast.error("Image size should be less than 5MB");
                return;
              }
              setImage(file);
            }
          }}
        />
      </FormControl>
    </FormItem>
  )}
/>

              
              
              
              

              <Button
                type="submit"
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : "Sign Up"}
              </Button>

              <div className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}