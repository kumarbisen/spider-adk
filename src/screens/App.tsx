import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { CostTracker } from '../cost-tracker';
import { QueryEngine } from '../QueryEngine';

interface AppProps {
  engine: QueryEngine;
}

export const App = ({ engine }: AppProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [currentCost, setCurrentCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (value: string) => {
    if (!value.trim() || isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);
    setMessages(prev => [
      ...prev,
      { role: 'user', content: value }
    ]);
    setInput('');

    try {
      const result = await engine.submitMessage(value);
      setMessages(prev => [
        ...prev,
        { role: 'agent', content: result.output }
      ]);
      setCurrentCost(CostTracker.calculateUSDCost(result.usage));
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unknown error while querying provider.';
      setError(message);
      setMessages(prev => [
        ...prev,
        { role: 'agent', content: `Error: ${message}` }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
      <Box flexDirection="row" justifyContent="space-between" marginBottom={1}>
        <Box flexDirection="column">
          <Text bold color="cyan"> Spider ADK (Interactive Mode)</Text>
          <Text dimColor>Type /help to see slash commands.</Text>
        </Box>
        <Box>
          <Text color="yellow">Session Cost: {CostTracker.formatCost(currentCost)}</Text>
        </Box>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        {messages.map((msg, idx) => (
          <Box key={idx} marginBottom={1}>
            <Text color={msg.role === 'user' ? 'green' : 'yellow'} bold>
              {msg.role === 'user' ? 'You: ' : 'Spider: '}
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        ))}
        {isSubmitting && (
          <Box marginBottom={1}>
            <Text color="yellow">Spider: Thinking...</Text>
          </Box>
        )}
        {error && (
          <Box marginBottom={1}>
            <Text color="red">Provider error: {error}</Text>
          </Box>
        )}
      </Box>

      <Box>
        <Text color="green" bold>{'❯ '} </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
};
