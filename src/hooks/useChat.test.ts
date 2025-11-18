import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from './useChat';

// Mock fetch
global.fetch = vi.fn();

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = {
        create: vi.fn().mockResolvedValue({
          content: [{ type: 'text', text: 'Response from Claude' }]
        })
      }
    }
  };
});

describe('useChat Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API save
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'test-session-id' }),
    });
  });

  it('should send a message and save session', async () => {
    const onSessionCreated = vi.fn();
    
    const { result } = renderHook(() => useChat({
      topic: 'Test Topic',
      questions: ['Q1'],
      selectedQuestion: 'Q1',
      onSessionCreated
    }));

    // Initial state
    expect(result.current.messages).toHaveLength(0);

    // Send message
    await act(async () => {
      await result.current.sendMessage('Hello', 'Q1');
    });

    // Check if messages updated (User + Assistant)
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].content).toBe('Q1');
    expect(result.current.messages[1].content).toBe('Response from Claude');

    // Check if save API was called
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/save', expect.objectContaining({
      method: 'POST'
    }));

    // Check if onSessionCreated was called
    expect(onSessionCreated).toHaveBeenCalledWith('test-session-id');
  });

  it('should handle API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock API failure
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    const { result } = renderHook(() => useChat({
      topic: 'Test',
      questions: ['Q1'],
      selectedQuestion: 'Q1'
    }));

    await act(async () => {
      await result.current.sendMessage('Hello', 'Q1');
    });

    // Messages should still update even if save fails
    expect(result.current.messages).toHaveLength(2);
    
    // Error should be logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

