# Setup flow

```text
App load
  └─ key in localStorage?
       ├─ yes → main ATS Align screen
       └─ no  → Welcome modal
                 ├─ Continue        → 8-step wizard
                 │                     last step Save → localStorage → main screen
                 ├─ Enter API Key   → API keys dialog (verify/save/delete)
                 ├─ Create Account  → Google signup (new tab)
                 └─ Create one      → same signup URL
```

Google signup URL is the Gmail create-account flow specified in the product brief.
