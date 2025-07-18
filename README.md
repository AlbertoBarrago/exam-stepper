# English Test App

A modern web application designed to assess English language proficiency with interactive, speech-enabled features.

## ✨ Features

- 📝 **Timed Exam**: Complete a 50-minute English proficiency test.
- 🎤 **Speech Recognition**: Answer questions using your voice with real-time audio visualization. [ON WORK]
- 📊 **Global Progress Bar**: Track your overall progress throughout the exam.
- 🔄 **Multi-Step Workflow**: Move through different types of questions seamlessly.
- ⚡ **Instant Results**: Get feedback as soon as the test is finished. [ON WORK]

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) – Powerful React framework for fast, scalable apps.
- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS framework for rapid UI development.
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) - For state management solution
- **Web Audio API** – For capturing and visualizing real-time audio input.
- **MediaRecorder API** – For recording test taker’s audio answers.


### Steps Structure

All exam sections are now in their own folders in `exam/[attemptId]/steps/`:

- Welcome/
- Reading/
- Listening/
- Writing/
- Speaking/
- Final/


## 📌 Todo / Integration steps

### Step Organization
- [x] Refactor `steps/` folder so each exam section has its own folder and sub-steps

### Data & Types
- [x] Create `state/timerSTore.ts` to share step/result/timing types across the app with zustand

### Step Navigation
- [x] Implement `StepController` or a custom `useStepMachine` hook to manage step logic, timing, and navigation
- [x] Build out context (`ExamContext`) for global exam state (progress, results, navigation)

### UI Reusability
- [ ] Make shared UI components (Audio check, Spectrum, Timer, Progress bar) highly reusable via props

### User Session
- [ ] Add api for the user session for get username and verify if it has permission
- [ ] Add data into HEADER or panel on top as FIGMA shows

### Section Features
- [ ] Reading: Choices, long text, intro/complete
- [ ] Listening: Audio player, answer choices, intro/complete
- [ ] Writing: Word counter, AI result hook-up
- [ ] Speaking: Microphone permission, audio visualization, practice, main questions, repeat parts

### Docs
- [x] Document the main "data flow" and step logic in a short `docs/architecture.md`


### Steps Flow
```mermaid
sequenceDiagram
    participant User
    participant ClientShell
    participant TimerStore
    participant SectionTimeBar
    participant StepComponent

    User->>ClientShell: Loads Exam Page
    ClientShell->>TimerStore: Initialize timer state
    ClientShell->>StepComponent: Render current step
    StepComponent-->>ClientShell: User clicks "Next"
    ClientShell->>TimerStore: If step is section intro, startSection()
    ClientShell->>TimerStore: If step is section complete, pause()
    ClientShell->>SectionTimeBar: Pass current section info
    SectionTimeBar->>TimerStore: Get section time left
    TimerStore-->>SectionTimeBar: Return time left
    SectionTimeBar-->>User: Display section progress bar
    loop Each Step
      User->>StepComponent: Interact/Complete
      StepComponent-->>ClientShell: onNextAction()
      ClientShell->>TimerStore: tick() (every second if running)
    end
    ClientShell->>FinalRecapStep: On exam end, show summary
    FinalRecapStep->>TimerStore: Pause and get elapsed times
    FinalRecapStep-->>User: Show analysis and summary
```




