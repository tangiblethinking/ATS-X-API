import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const GOOGLE_SIGNUP =
  "https://accounts.google.com/lifecycle/steps/signup/name?continue=https://mail.google.com/mail/&dsh=S-163851725:1788464400734734&ec=asw-gmail-%5Bmodule%5D-create&flowEntry=SignUp&flowName=GlifWebSignIn&hl=en&service=mail&source=gafb-gmail_asw-hero-en&theme=glif&TL=ACv9tzESYKEKW7fhcOFZBLSrFGnCA7XfVdzruxJYQVZGCgiyY2Z3jwc5K8NxGH4n";

type Theme = "dark" | "light";

type Props = {
  open: boolean;
  onContinue: () => void;
  onEnterKey: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
};

export function WelcomeModal({ open, onContinue, onEnterKey, theme = "dark", onToggleTheme }: Props) {
  function openSignup() {
    window.open(GOOGLE_SIGNUP, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <DialogTitle>Welcome, let’s get this machine set up!</DialogTitle>
            {onToggleTheme ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 shrink-0 p-0"
                onClick={onToggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            ) : null}
          </div>
          <DialogDescription>
            This machine uses Gemini. Choose continue if you’re already signed in to your gmail account. Or create account if you need one. Or if your a Pro, select “enter api key”.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button className="h-11 w-full" onClick={onContinue}>
            Continue
          </Button>
          <Button variant="outline" className="h-11 w-full" onClick={onEnterKey}>
            Enter API Key
          </Button>
          <Button variant="secondary" className="h-11 w-full" onClick={openSignup}>
            Create Account
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          This app utilizes your Gemini AI Studio. So having a gmail account is necessary to complete set up. Don’t have one?{" "}
          <button type="button" className="underline underline-offset-2 hover:text-foreground" onClick={openSignup}>
            Create one
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
