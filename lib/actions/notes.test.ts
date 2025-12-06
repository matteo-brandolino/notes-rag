import { describe, it, expect, vi } from 'vitest'

vi.mock('../db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{
          id: '1',
          title: 'Test Note',
          content: 'Test content',
          tags: [],
          isPinned: false,
          color: '#ffffff',
          createdAt: new Date(),
          updatedAt: new Date(),
        }]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{
          id: '1',
          title: 'Test',
          content: 'Test',
          tags: [],
          isPinned: false,
          color: '#ffffff',
          createdAt: new Date(),
          updatedAt: new Date(),
        }]),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: '1',
            title: 'Updated',
            content: 'Updated',
            tags: [],
            isPinned: true,
            color: '#ffffff',
            createdAt: new Date(),
            updatedAt: new Date(),
          }]),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: '1' }]),
      }),
    }),
  },
}))

vi.mock('../ai/embedding', () => ({
  generateEmbeddings: vi.fn(() => Promise.resolve([
    { content: 'test', embedding: [0.1, 0.2] }
  ])),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Notes Actions', () => {
  it('should create a note successfully', async () => {
    const { createNote } = await import('./notes')

    const result = await createNote({
      title: 'Test Note',
      content: 'Test content',
    })

    expect(result.success).toBe(true)
    expect(result.note).toBeDefined()
    expect(result.note?.title).toBe('Test Note')
  })

  it('should handle invalid input', async () => {
    const { createNote } = await import('./notes')

    const result = await createNote({
      title: '',
      content: 'Test',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})
