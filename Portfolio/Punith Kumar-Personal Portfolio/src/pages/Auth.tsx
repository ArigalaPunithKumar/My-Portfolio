import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { CarAnimation } from "@/components/CarAnimation";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setIsForgotPassword(false);
      } else if (isLogin) {
        setIsLoggingIn(true);
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Wait for car animation before navigating
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      setIsLoggingIn(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <CarAnimation isLoggingIn={isLoggingIn} />
      
      <Card className="glass-strong w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h1>
          <p className="text-muted-foreground">
            {isForgotPassword
              ? "Enter your email to receive a reset link"
              : isLogin
              ? "Sign in to view Punith Kumar's portfolio"
              : "Sign up to access the portfolio"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && !isForgotPassword && (
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="pl-10 glass border-border/30 focus:border-primary/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 glass border-border/30 focus:border-primary/50"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 glass border-border/30 focus:border-primary/50"
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 6 characters
              </p>
            )}
            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
            </div>
          )}

          <Button
            type="submit"
            className="btn-neon w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isForgotPassword
                  ? "Send Reset Link"
                  : isLogin
                  ? "Sign In"
                  : "Sign Up"}
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setIsLogin(true);
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to sign in
            </button>
          ) : (
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
