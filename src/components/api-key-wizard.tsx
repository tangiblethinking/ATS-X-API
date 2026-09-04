import { useState, useRef, type ReactNode, type TouchEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Moon, Sun, Search, X } from "lucide-react";

const AISTUDIO = "https://aistudio.google.com/apikey";
const SWIPE_THRESHOLD = 50;

type Step = {
  title: string;
  shortLabel: string;
  body: ReactNode;
  media: string | null;
  mediaType: "video" | "img" | null;
};

const STEPS: Step[] = [
  {
    title: "Open Google AI Studio",
    shortLabel: "Open",
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
    shortLabel: "Create",
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
    shortLabel: "Project",
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
    shortLabel: "Key",
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
    shortLabel: "Copy",
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
    shortLabel: "Return",
    body: (
      <>
        Return to this tab and continue to paste your key.
      </>
    ),
    media: "/wizard/step001.png",
    mediaType: "img",
  },
  {
    title: "Paste & save your key",
    shortLabel: "Save",
    body: (
      <>
        Paste your key into the text field labeled <strong>Your API Key</strong>, then click <strong>Save</strong>.
      </>
    ),
    media: null,
    mediaType: null,
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
  const [fullscreen, setFullscreen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const showKeyField = step === 6 || isLast;
  const progressValue = ((step + 1) / STEPS.length) * 100;

  function handleSave() {
    const k = draft.trim();
    if (!k) return;
    onComplete(k);
  }

  function goToEnterKey() {
    setStep(6);
  }

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

    e.preventDefault();
    if (dx < 0 && step < STEPS.length - 1) setStep((s) => s + 1);
    else if (dx > 0 && step > 0) setStep((s) => s - 1);
  }

  function onTouchMove(e: TouchEvent) {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      e.preventDefault();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          if (fullscreen) {
            setFullscreen(false);
          } else {
            onClose();
          }
        }
      }}
    >
      <DialogContent
        className="flex h-[min(92vh,900px)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:w-[calc(100%-2rem)]"
        showCloseButton={false}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        style={{ touchAction: "pan-y" }}
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
                disabled={fullscreen}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
            ) : null}
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-6">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {current.media && current.mediaType ? (
              current.mediaType === "video" ? (
                <video
                  src={current.media}
                  className="size-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img src={current.media} alt="" className="size-full object-cover" />
              )
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                No preview
              </div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
              {step + 1}/{STEPS.length}
            </span>
            {current.media ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={() => setFullscreen(true)}
                aria-label="View full screen"
              >
                <Search className="size-4" />
              </Button>
            ) : null}
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

          <div className="mt-auto flex shrink-0 flex-col gap-3 pt-1">
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-11"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                <ChevronLeft className="size-4" /> Prev
              </Button>
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
            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />
              <div className="flex flex-wrap justify-between gap-x-1 gap-y-1">
                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i)}
                    className={`text-[10px] sm:text-xs transition-colors ${
                      i === step
                        ? "font-bold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label={`Go to step ${i + 1}: ${s.title}`}
                    aria-current={i === step ? "step" : undefined}
                  >
                    {s.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Fullscreen media overlay — portaled so it sits above Dialog on mobile */}
      {fullscreen && current.media && current.mediaType ? (
        <DialogPortal>
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 pointer-events-auto"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                setFullscreen(false);
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                setFullscreen(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Full screen media"
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4 z-[210] h-12 w-12 p-0 text-white hover:bg-white/20 pointer-events-auto"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFullscreen(false);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setFullscreen(false);
              }}
              aria-label="Close full screen"
            >
              <X className="size-6" />
            </Button>
            <div
              className="max-h-full max-w-full pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {current.mediaType === "video" ? (
                <video
                  src={current.media}
                  className="max-h-[90vh] max-w-full object-contain"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={current.media}
                  alt=""
                  className="max-h-[90vh] max-w-full object-contain"
                />
              )}
            </div>
          </div>
        </DialogPortal>
      ) : null}
    </Dialog>
  );
}
