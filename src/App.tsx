import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { OidcProvider, OidcSecure } from "@axa-fr/react-oidc";
import { UserProvider } from "./contexts/UserContext";
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();
const Authenticating = () => null;
const oidcConfig = {
  client_id: "43b65083-3b3d-4876-b1a1-d83581c8d06f",
  redirect_uri: "https://10.104.0.35:8085/authentication/callback",
  //silent_redirect_uri: window.location.origin + "/authentication/silent-callback",
  client_secret: "EUwrzAJXJ_Y0cxnq8fmtVKXLc3x3v_kyLHMtffYH",
  scope: "openid email profile allatclaims groups",
  authority: "https://adfs.cipeliagroup.com/adfs",
  service_worker_only: false,
  /*onSigninCallback: (_user) => {
    //window.history.replaceState({}, document.title, window.location.pathname);
    // Redirigez vers la page d'accueil ou la page précédente
    window.history.replaceState({}, document.title, "/");
    window.location.replace("https://atl-svap21.cipeliagroup.com:8085/");
      
  },*/
  metadata: {
    issuer: "https://adfs.cipeliagroup.com/adfs",
    authorization_endpoint: "https://adfs.cipeliagroup.com/adfs/oauth2/authorize",
    //token_endpoint: "https://adfs.cipeliagroup.com/adfs/oauth2/token",
    jwks_uri: "https://adfs.cipeliagroup.com/adfs/discovery/keys",
    userinfo_endpoint: "https://adfs.cipeliagroup.com/adfs/userinfo",
    end_session_endpoint: "https://adfs.cipeliagroup.com/adfs/oauth2/logout",
  }
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <OidcProvider
          configuration={oidcConfig}
          authenticating={Authenticating}>
          <UserProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<OidcSecure><Index /></OidcSecure>} />
              <Route path="/quiz/:slug" element={<OidcSecure><QuizPage /></OidcSecure>} />
              <Route path="/admin" element={<OidcSecure><AdminPage /></OidcSecure>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UserProvider>
        </OidcProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
