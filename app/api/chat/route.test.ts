import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from './route'

vi.mock('@/lib/actions/resources', () => ({
  createResource: vi.fn(() => Promise.resolve('Resource created')),
}))

vi.mock('@/lib/ai/embedding', () => ({
  findAllRelevantContent: vi.fn(() => Promise.resolve({
    resources: [{ content: 'test resource', similarity: 0.9 }],
    notes: [{ content: 'test note', similarity: 0.8, noteTitle: 'My Note' }],
  })),
}))

vi.mock('ai', async () => {
  const actual = await vi.importActual('ai')
  return {
    ...actual,
    streamText: vi.fn(() => ({
      toUIMessageStreamResponse: vi.fn(() =>
        new Response('OK', { status: 200 })
      ),
    })),
    convertToModelMessages: vi.fn((msgs) => msgs),
    stepCountIs: vi.fn((count) => count),
    tool: vi.fn((config) => config),
  }
})

vi.mock('@/lib/ai/provider', () => ({
  openai: vi.fn(() => 'mocked-model'),
}))

describe('Chat API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/chat', () => {
    it('should handle valid chat request', async () => {
      const mockRequest = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'Hello' }
          ],
        }),
      })

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
    })

    it('should handle invalid JSON', async () => {
      const mockRequest = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
      })

      const response = await POST(mockRequest)

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('should handle empty messages array', async () => {
      const mockRequest = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      })

      const response = await POST(mockRequest)

      expect(response.status).toBe(200)
    })
  })
})
