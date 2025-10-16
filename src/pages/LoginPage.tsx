
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import Logo from '@/components/Logo';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserCog } from 'lucide-react';
import { loginWithRefreshToken } from '@/services/auth/authService';

const LoginPage: React.FC = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'TECHNICIAN' | 'USER'>('USER');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
  const { toast: useToastHook } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect path in the state
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('LoginPage: Checking existing authentication', { token: !!token, user: !!user });
    
    // If we have authentication data, redirect to dashboard
    if (token || user) {
      console.log('LoginPage: User already has authentication data, redirecting to dashboard');
      navigate('/dashboard');
    }
    
    // Start animations after a short delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setDepartmentError('');
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setEmailError('Veuillez saisir une adresse email valide');
      toast.error("Email invalide", {
        description: "Veuillez saisir une adresse email valide."
      });
      setLoading(false);
      return;
    }
    
    if (!password || password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      toast.error("Mot de passe trop court", {
        description: "Le mot de passe doit contenir au moins 6 caractères."
      });
      setLoading(false);
      return;
    }
    
    if (isSignupMode) {
      // Additional validation for signup
      if (!name || name.length < 2) {
        setNameError('Le nom doit contenir au moins 2 caractères');
        toast.error("Nom invalide", {
          description: "Le nom doit contenir au moins 2 caractères."
        });
        setLoading(false);
        return;
      }
      
      if (!department || department.length < 2) {
        setDepartmentError('Le département doit contenir au moins 2 caractères');
        toast.error("Département invalide", {
          description: "Le département doit contenir au moins 2 caractères."
        });
        setLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        setPasswordError('Les mots de passe ne correspondent pas');
        toast.error("Erreur", {
          description: "Les mots de passe ne correspondent pas."
        });
        setLoading(false);
        return;
      }
      
      // Handle signup
      try {
        const { createUser } = await import('@/services/userApi');
        await createUser({
          name,
          email,
          password,
          role,
          department
        });
        
        toast.success("Compte créé avec succès", {
          description: "Vous pouvez maintenant vous connecter avec vos identifiants."
        });
        
        // Switch to login mode after successful signup
        setIsSignupMode(false);
        setPassword('');
        setConfirmPassword('');
        setName('');
        setDepartment('');
      } catch (error: any) {
        console.error('Signup error:', error);
        const errorMessage = error.response?.data?.message || 'Erreur lors de la création du compte';
        toast.error("Échec de la création du compte", {
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Handle login
      try {
        const response = await loginWithRefreshToken(email, password);
        
        console.log('LoginPage: Login successful', response);
        
        // Navigate to the page the user was trying to access, or dashboard as fallback
        setTimeout(() => {
          navigate(from);
        }, 100);
        
      } catch (error: any) {
        console.error('LoginPage: Login error:', error);
        
        // Error handling is now done in the authService
        if (error.message === 'Email incorrect') {
          setEmailError('Email incorrect');
        } else if (error.message === 'Mot de passe incorrect') {
          setPasswordError('Mot de passe incorrect');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 z-0">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute h-56 w-56 rounded-full bg-purple-300 filter blur-3xl animate-pulse top-1/4 -left-24"></div>
          <div className="absolute h-64 w-64 rounded-full bg-blue-300 filter blur-3xl animate-pulse bottom-1/4 -right-32"></div>
          <div className="absolute h-64 w-64 rounded-full bg-pink-300 filter blur-3xl animate-pulse top-3/4 left-1/2"></div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full opacity-20 animate-float`} 
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md z-10 transform transition-all duration-1000 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <Card className="backdrop-blur-md bg-white/80 border-none shadow-xl">
          <CardHeader className="space-y-1 flex flex-col items-center pb-6">
            <div className={`w-full flex justify-center mb-4 transition-all duration-1000 transform ${animationComplete ? 'scale-100' : 'scale-90'}`}>
              <Logo size="lg" />
            </div>
            <CardTitle className={`text-2xl sm:text-3xl font-bold text-center transition-all duration-700 delay-300 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {isSignupMode ? 'Créer un compte' : 'Bienvenue'}
            </CardTitle>
            <CardDescription className={`text-center transition-all duration-700 delay-500 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {isSignupMode ? 'Inscrivez-vous sur InvenTrack' : 'Connectez-vous à votre compte InvenTrack'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignupMode && (
                <div className={`space-y-4 transition-all duration-700 delay-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="relative group">
                    <Input 
                      type="text" 
                      placeholder="Nom complet" 
                      className={`h-12 border-muted bg-white/80 focus:bg-white transition-all ${nameError ? 'border-red-500' : ''}`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setNameError('');
                      }}
                      required
                    />
                    {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
                  </div>
                </div>
              )}
              <div className={`space-y-4 transition-all duration-700 delay-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input 
                    type="email" 
                    placeholder="Adresse Email" 
                    className={`pl-10 h-12 border-muted bg-white/80 focus:bg-white transition-all ${emailError ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    required
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
              </div>
              {isSignupMode && (
                <div className={`space-y-4 transition-all duration-700 delay-800 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="relative group">
                    <Input 
                      type="text" 
                      placeholder="Département" 
                      className={`h-12 border-muted bg-white/80 focus:bg-white transition-all ${departmentError ? 'border-red-500' : ''}`}
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        setDepartmentError('');
                      }}
                      required
                    />
                    {departmentError && <p className="text-red-500 text-sm mt-1">{departmentError}</p>}
                  </div>
                </div>
              )}
              {isSignupMode && (
                <div className={`space-y-4 transition-all duration-700 delay-850 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="relative group">
                    <UserCog className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary z-10" />
                    <Select value={role} onValueChange={(value: 'ADMIN' | 'TECHNICIAN' | 'USER') => setRole(value)}>
                      <SelectTrigger className="h-12 pl-10 border-muted bg-white/80 focus:bg-white transition-all">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">Utilisateur</SelectItem>
                        <SelectItem value="TECHNICIAN">Technicien</SelectItem>
                        <SelectItem value="ADMIN">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className={`space-y-2 transition-all duration-700 delay-900 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Mot de passe" 
                    className={`pl-10 h-12 pr-10 border-muted bg-white/80 focus:bg-white transition-all ${passwordError ? 'border-red-500' : ''}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>
              {isSignupMode && (
                <div className={`space-y-2 transition-all duration-700 delay-1000 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Confirmer le mot de passe" 
                      className="pl-10 h-12 pr-10 border-muted bg-white/80 focus:bg-white transition-all"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              <Button 
                type="submit" 
                className={`w-full h-12 text-base shadow-lg transition-all duration-700 delay-1100 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignupMode ? 'Création...' : 'Connexion...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    {isSignupMode ? "Créer mon compte" : "Se connecter"}
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className={`text-sm text-center transition-all duration-700 delay-1300 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button
                type="button"
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setEmailError('');
                  setPasswordError('');
                  setNameError('');
                  setDepartmentError('');
                }}
                className="text-primary hover:underline font-medium"
              >
                {isSignupMode ? 'Vous avez déjà un compte? Se connecter' : "Vous n'avez pas de compte? S'inscrire"}
              </button>
            </div>
            <div className={`text-center w-full border-t border-border pt-4 text-xs text-muted-foreground transition-all duration-700 delay-1500 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              InvenTrack © 2025 | Système de Gestion d'Inventaire
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
