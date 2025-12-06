# TODO List - Notes RAG Application

## P0 - Critical Priority

### Security
- [x] **XSS Vulnerability in ReactMarkdown** (chat-panel.tsx:118) ✅
  - Added `allowedElements` to ReactMarkdown to sanitize content
  - Prevents arbitrary HTML/script injection

- [x] **Missing Input Validation** ✅
  - Enhanced Zod schemas with proper validation rules
  - Added validation for note titles (max 255 chars), content (max 100k chars)
  - Added tag validation (max 50 chars per tag, max 20 tags)
  - Added color validation (hex format)
  - Added validation to chat API endpoint with error handling

### Error Handling
- [x] **Add Error Boundaries** ✅
  - Created ErrorBoundary component with fallback UI
  - Wrapped main layout and both ChatPanel and NotesPanel
  - Added reset functionality for error recovery

- [x] **Missing Form Error Handling** (note-editor.tsx) ✅
  - Added try-catch blocks in handleSubmit
  - Integrated toast notifications (sonner) for success/error messages
  - Added Toaster to root layout
  - Handles validation errors, network failures, and unexpected errors

### Type Safety
- [x] **Remove Excessive `any` Types** ✅
  - rag-results-flow.tsx - Typed `changes` parameter with proper interface
  - chat-panel.tsx - Created interfaces for SearchToolInput, SearchResource, SearchNote, SearchOutput
  - app/api/chat/route.ts - Replaced `any` in message parts with proper Zod union schema

## P1 - High Priority

### Performance
- [ ] **Optimize Re-renders** (notes-panel.tsx:31-38)
  - Move `filteredNotes` calculation to useMemo
  - Add dependency array with [notes, searchQuery]

- [ ] **Debounce Search Input** (notes-panel.tsx:61)
  - Add debounce to search with 300ms delay
  - Prevents excessive filtering on every keystroke

- [ ] **Optimize RAG Flow Rendering** (rag-results-flow.tsx)
  - Memoize node and edge calculations
  - Add React.memo to QueryNode and ResultNode components

### API & Database
- [ ] **Add Rate Limiting**
  - Implement rate limiting on chat API endpoint
  - Add rate limiting to notes CRUD operations
  - Use middleware like `express-rate-limit` or Vercel's rate limiting

- [ ] **Add Database Connection Pooling**
  - Configure proper connection pool size
  - Add connection timeout handling
  - Implement retry logic for failed connections

- [ ] **Add Retry Logic** (chat endpoint)
  - Implement exponential backoff for OpenAI API calls
  - Handle rate limit errors gracefully
  - Add fallback responses when API fails

### UX Improvements
- [ ] **Add Loading States**
  - notes-panel.tsx - Show skeleton while notes load
  - note-editor.tsx - Show loading spinner during save
  - Add optimistic updates for better perceived performance

- [ ] **Add Success/Error Toasts**
  - Install sonner or react-hot-toast
  - Show confirmation when note is created/updated/deleted
  - Display error messages for failed operations

## P2 - Medium Priority

### Features
- [ ] **Add Internationalization (i18n)**
  - Install next-intl or react-i18next
  - Extract all hardcoded strings
  - Support multiple languages

- [ ] **Implement Soft Deletes** (schema/notes.ts)
  - Add `deletedAt` timestamp column
  - Filter out deleted notes in queries
  - Add "restore" functionality

- [ ] **Add Note Categories/Folders**
  - Extend schema with categories table
  - Update UI to show categorized notes
  - Add drag-and-drop to move notes between categories

### Accessibility
- [ ] **Add ARIA Labels**
  - Add aria-label to icon-only buttons
  - Add aria-describedby for form inputs
  - Ensure proper heading hierarchy

- [ ] **Improve Keyboard Navigation**
  - Add keyboard shortcuts for new note (Ctrl+N)
  - Enable arrow key navigation in notes list
  - Add focus management in modals

- [ ] **Add Focus Indicators**
  - Ensure visible focus rings on all interactive elements
  - Use outline-offset for better visibility
  - Test with keyboard-only navigation

### Code Quality
- [ ] **Add Proper Error Messages**
  - Create centralized error message constants
  - Add context to error logs
  - Implement structured logging

- [ ] **Improve Type Safety in AI SDK Usage**
  - Type the message parts properly
  - Add type guards for tool outputs
  - Create interfaces for tool input/output

## P3 - Low Priority

### Testing
- [ ] **Add Unit Tests**
  - Test utility functions (lib/utils)
  - Test React components with React Testing Library
  - Target 80% code coverage

- [ ] **Add Integration Tests**
  - Test API endpoints with Vitest or Jest
  - Test database operations
  - Test RAG search functionality

- [ ] **Add E2E Tests**
  - Use Playwright or Cypress
  - Test complete user flows
  - Test note creation, editing, deletion, and search

### Developer Experience
- [ ] **Add ESLint Rules**
  - Enable stricter TypeScript rules
  - Add rules for React hooks
  - Configure import ordering

- [ ] **Add Pre-commit Hooks**
  - Install husky and lint-staged
  - Run linter before commits
  - Run type checking before commits

- [ ] **Improve Documentation**
  - Add JSDoc comments to complex functions
  - Document environment variables
  - Create architecture documentation

### Future Enhancements
- [ ] **Add Real-time Collaboration**
  - Implement WebSocket for live updates
  - Show when others are editing notes
  - Handle conflict resolution

- [ ] **Add Note Versioning**
  - Track note history in database
  - Show version diff UI
  - Allow restoring previous versions

- [ ] **Implement Better State Management**
  - Consider Zustand or Jotai for global state
  - Remove prop drilling
  - Centralize notes state

- [ ] **Add PWA Support**
  - Add service worker for offline support
  - Enable caching for better performance
  - Add install prompt

- [ ] **Add Export/Import**
  - Export notes to Markdown/JSON
  - Import from other note apps
  - Bulk operations support

---

## Quick Wins (Can be done in <1 hour)

- [ ] Add loading spinner to chat submit button
- [ ] Add empty state icon to notes panel
- [ ] Add keyboard shortcut hints to UI
- [ ] Add proper meta tags for SEO
- [ ] Add favicon and app icons
- [ ] Improve error messages to be more user-friendly
- [ ] Add console.log cleanup (remove development logs)

## Technical Debt

- [ ] Remove unused dependencies from package.json
- [ ] Consolidate duplicate utility functions
- [ ] Extract magic numbers to constants
- [ ] Simplify complex conditional logic in chat-panel.tsx
- [ ] Break down large components into smaller ones
