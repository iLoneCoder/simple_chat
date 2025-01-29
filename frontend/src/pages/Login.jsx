import { LoginForm } from "@/components/LoginForm";
import { Button } from "../components/ui/button";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Button variant="link" className="px-0">
            Sign up
          </Button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;