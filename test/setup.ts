import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-api-key'
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
  vi.restoreAllMocks()
})
