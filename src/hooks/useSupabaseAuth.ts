
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';
import { useAppDispatch } from './redux';
import { login, setError } from '../features/auth/authSlice';

export const useSupabaseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const registerDriver = async ({
    email,
    password,
    fullName,
    driverId,
    phone,
    profilePicture
  }: {
    email: string;
    password: string;
    fullName: string;
    driverId: string;
    phone: string;
    profilePicture: File;
  }) => {
    try {
      setIsLoading(true);

      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        }
      });

      if (authError || !authData.user) throw authError || new Error('Registration failed');

      // 2. Upload profile picture - using userId in the path for RLS
      const fileExt = profilePicture.name.split('.').pop();
      const filePath = `${authData.user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('driver-profiles')
        .upload(filePath, profilePicture);

      if (uploadError) throw uploadError;

      // 3. Create driver profile
      const { error: profileError } = await supabase
        .from('driver_profiles')
        .insert({
          id: authData.user.id,
          full_name: fullName,
          driver_license_number: driverId,
          phone_number: phone,
          profile_picture_url: uploadData.path,
          status: 'pending_verification'
        });

      if (profileError) throw profileError;

      // 4. Success notification and redirect
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });

      navigate('/auth/verify');

    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = (error as Error).message || 'Registration failed';
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const loginDriver = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // 1. Sign in with Supabase Auth
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Parse the error body to get the actual error code
        try {
          const errorBody = JSON.parse((signInError as any).body);
          if (errorBody?.code === 'email_not_confirmed') {
            toast({
              title: "Email Not Verified",
              description: "Please check your email and click the verification link before logging in.",
              variant: "destructive",
            });
            navigate('/auth/verify');
            return;
          }
        } catch {
          // If parsing fails, fallback to the default error handling
        }
        throw signInError;
      }

      if (!user) throw new Error('Login failed');

      // 2. Fetch driver profile
      const { data: profile, error: profileError } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Update Redux store
      dispatch(login({
        id: user.id,
        email: user.email!,
        name: profile.full_name,
        role: 'driver'
      }));

      // 4. Success notification and redirect
      toast({
        title: "Login Successful",
        description: `Welcome back, ${profile.full_name}!`,
      });

      navigate('/driver/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = (error as Error).message || 'Login failed';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      dispatch(setError(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerDriver,
    loginDriver,
    isLoading,
  };
};
