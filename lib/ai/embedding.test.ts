import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as ai from 'ai'

vi.mock('ai', () => ({
  embed: vi.fn(),
  embedMany: vi.fn(),
}))

vi.mock('@/lib/ai/provider', () => ({
  openai: {
    textEmbeddingModel: vi.fn(() => 'mock-model'),
  },
}))

// Mock del database
vi.mock('../db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        leftJoin: vi.fn(() => ({
          where: vi.fn(() => ({
            orderBy: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve([])),
            })),
          })),
        })),
      })),
    })),
  },
}))

describe('Embedding Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateEmbeddings', () => {
    it('should split text into chunks and generate embeddings', async () => {
      const { generateEmbeddings } = await import('./embedding')
      const mockEmbeddings = [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]]
      const mockValues = ['First sentence', 'Second sentence']
      vi.mocked(ai.embedMany).mockResolvedValue({
        embeddings: mockEmbeddings,
        values: mockValues,
        usage: { tokens: 10 },
      })

      const input = 'First sentence. Second sentence.'
      const result = await generateEmbeddings(input)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        content: 'First sentence',
        embedding: [0.1, 0.2, 0.3],
      })
      expect(result[1]).toEqual({
        content: 'Second sentence',
        embedding: [0.4, 0.5, 0.6],
      })
    })

    it('should handle empty input', async () => {
      const { generateEmbeddings } = await import('./embedding')
      vi.mocked(ai.embedMany).mockResolvedValue({
        embeddings: [],
        values: [],
        usage: { tokens: 0 },
      })

      const result = await generateEmbeddings('   ')
      expect(result).toEqual([])
    })

    it('should handle input without periods', async () => {
      const { generateEmbeddings } = await import('./embedding')
      const mockEmbedding = [0.1, 0.2, 0.3]
      vi.mocked(ai.embedMany).mockResolvedValue({
        embeddings: [mockEmbedding],
        values: ['Single chunk without period'],
        usage: { tokens: 5 },
      })

      const input = 'Single chunk without period'
      const result = await generateEmbeddings(input)

      expect(result).toHaveLength(1)
      expect(result[0].content).toBe('Single chunk without period')
    })
  })

  describe('generateEmbedding', () => {
    it('should generate single embedding for query', async () => {
      const { generateEmbedding } = await import('./embedding')
      const mockEmbedding = [0.1, 0.2, 0.3, 0.4]
      vi.mocked(ai.embed).mockResolvedValue({
        embedding: mockEmbedding,
        value: 'test query',
        usage: { tokens: 5 },
      })

      const result = await generateEmbedding('test query')

      expect(result).toEqual(mockEmbedding)
      expect(ai.embed).toHaveBeenCalledWith({
        model: expect.anything(),
        value: 'test query',
      })
    })

    it('should replace newlines with spaces', async () => {
      const { generateEmbedding } = await import('./embedding')
      const mockEmbedding = [0.1, 0.2]
      vi.mocked(ai.embed).mockResolvedValue({
        embedding: mockEmbedding,
        value: 'test query',
        usage: { tokens: 5 },
      })

      await generateEmbedding('test\\nquery')

      expect(ai.embed).toHaveBeenCalledWith({
        model: expect.anything(),
        value: 'test query',
      })
    })
  })

  describe('findAllRelevantContent', () => {
    it('should return empty arrays when no results found', async () => {
      const { findAllRelevantContent } = await import('./embedding')
      const mockEmbedding = [0.1, 0.2, 0.3]
      vi.mocked(ai.embed).mockResolvedValue({
        embedding: mockEmbedding,
        value: 'test query',
        usage: { tokens: 5 },
      })

      const result = await findAllRelevantContent('test query')

      expect(result).toEqual({
        resources: [],
        notes: [],
      })
    })
  })
})
