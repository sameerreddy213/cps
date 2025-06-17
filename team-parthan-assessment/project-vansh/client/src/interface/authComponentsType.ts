import type { Dispatch,SetStateAction } from "react";

export interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}
export interface signupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export interface AuthComponentProps {
  onLogin?: (data: FormData) => void;
  onSignup?: (data: signupFormData) => void;
  onGoogleAuth?: () => void;
  setIsOpen:Dispatch<SetStateAction<boolean>>;
  isOpen:boolean;
}