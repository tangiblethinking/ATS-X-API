import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveApiKey, isPlausibleApiKey } from "@/lib/api-key-store";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";

const AISTUDIO = "https://aistudio.google.com/apikey";

type Step = {
  title: string;
  body: ReactNode;
  media: string | null;
  mediaType: "video" | "img" | null;
};

const STEPS: Step[] = [
  {
    title: "Open Google AI Studio",
    body: (
      <>
        Click the <strong>Get my API key</strong> button below. A new tab will open with the Google AI Studio API keys page.
      </>
    ),
    media: "/wizard/getapivid.mp4",
    mediaType: "video",
  },
  {
    title: "Create API key and project",
    body: (
      <>
        Click <strong>Create API key</strong> at the top right. A popup will appear asking for a name — call it anything you want or leave it as is — and <strong>Choose an imported project</strong>.
        <ul className="mt-2 list-disc pl-4">
          <li>
            Select <strong>Create project</strong> to make a new one.
          </li>
          <li>
            In <strong>Name your project</strong>, name it anything you want or leave it as is.
          </li>
        </ul>
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Create the project",
    body: (
      <>
        Click <strong>Create project</strong>. Let it load; it will return you to the previous prompt.
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Create the key",
    body: (
      <>
        Click <strong>Create key</strong>. Let it load; you will now see your API key.
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Copy your API key",
    body: (
      <>
        Click the <strong>copy icon</strong> on the right of the API key text to copy it to your clipboard.
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Return here",
    body: (
      <>
        Return to this tab and continue to paste your key.
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Paste your key",
    body: (
      <>
        Paste your key into the text field labeled <strong>Your API Key</strong>.
      </>
    ),
    media: null,
    mediaType: null,
  },
  {
    title: "Save your key",
    body: (
      <>
        Click <strong>Save</strong> to store your API key.
      </>
    ),
    media: "/wizard/getapivid.mp4",
    mediaType: "video",
  },
];

type Theme = "dark" | "light";

type Props = {
  open: boolean;
  onComplete: (key: string) => void;
  onClose: () => void;
  theme?: Theme;
  onToggleTheme?: () => void;
};

export function ApiKeyWizard({ open, onComplete, onClose, theme = "dark", onToggleTheme }: Props) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const showKeyField = step >= 6;

  function handleSave() {
    const key = draft.trim();
    if (!isPlausibleApiKey(key)) {
      toast.error("Gemini key does not look valid.");
      return;
    }
    saveApiKey(key);
    onComplete(key);
    toast.success("API key saved. You’re ready to use the app.");
    setStep(0);
    setDraft("");
  }

  function goToEnterKey() {
    setStep(6);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        className="flex h-[min(92vh,900px)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]"
        showCloseButton={false}
      >
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-2 pr-0">
            <DialogTitle className="text-base sm:text-xl">How to Get Your API Key</DialogTitle>
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
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-6">
          {/* Fixed media area — same size every step */}
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {current.media && current.mediaType ? (
              current.mediaType === "video" ? (
                <video
                  src={current.media}
                  className="size-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={current.media} alt="" className="size-full object-contain" />
              )
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                Enter your key below
              </div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              Step {step + 1}
            </span>
          </div>

          <div className="shrink-0">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-base font-medium sm:text-lg">{current.title}</h3>
              <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{current.body}</div>
          </div>

          {showKeyField ? (
            <div className="shrink-0 space-y-2">
              <Label htmlFor="wizard-key">Your API Key</Label>
              <Input
                id="wizard-key"
                type="password"
                autoComplete="off"
                placeholder="AIza…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
          ) : null}

          {/* Persistent CTAs */}
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              className="h-11 flex-1"
              onClick={() => window.open(AISTUDIO, "_blank", "noopener,noreferrer")}
            >
              Get my API key
            </Button>
            <Button variant="outline" className="h-11 flex-1" onClick={goToEnterKey}>
              Enter my API key
            </Button>
            {isLast ? (
              <Button className="h-11 w-full sm:w-auto sm:flex-none" onClick={handleSave}>
                Save
              </Button>
            ) : null}
          </div>

          <div className="mt-auto flex shrink-0 items-center justify-between gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-11"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <ChevronLeft className="size-4" /> Prev
            </Button>
            <div className="flex flex-wrap justify-center gap-1">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`size-2 rounded-full ${i === step ? "bg-primary" : "bg-muted-foreground/30"}`}
                  onClick={() => setStep(i)}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-11"
              disabled={isLast}
              onClick={() => setStep((s) => s + 1)}
            >
              Next <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
