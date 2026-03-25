import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, AlertCircle } from "lucide-react";
import { useOidc } from '@axa-fr/react-oidc';

const LoginPage = () => {
  const { login } = useOidc();

  return (
    <div>
      <h1>Bienvenue sur IQ Quest</h1>
      <button onClick={() => login("/")}>
        Se connecter avec mon compte entreprise
      </button>
    </div>
  );
};

export default LoginPage;
