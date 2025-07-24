# TODOs

## Data & Types
- [x] Create `state/timerStore.ts` to share step/result/timing types across the app with zustand

## Step Navigation
- [x] Implement `StepController` or a custom `useStepMachine` hook to manage step logic, timing, and navigation
- [ ] Build out context (`ExamContext`) for global exam state (progress, results, navigation)

## UI Reusability
- [x] Make shared UI components (Audio check, Spectrum, Timer, Progress bar) highly reusable via props

## User Session
- [x] Add API for the user session to get username and verify if it has permission
- [x] Add data into `HEADER` or panel on top as FIGMA shows

## FE "Security"
- [x] Handle the browser back button to prevent exam navigation loopholes

## Section Features
### Permission
- [x] Audio
- [ ] Video

### Reading
- [x] Choices, long text, intro/complete

### Listening
- [ ] Audio player, answer choices, intro/complete

### Writing
- [ ] Word counter, AI result hook-up

### Speaking
- [ ] Microphone permission, audio visualization, practice, main questions, repeat parts

## Timer
- [ ] Handle time off, fail exam (what's the right behavior?)