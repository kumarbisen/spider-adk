import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

export const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  const handleSubmit = (value: string) => {
    // In a real loop, you would pass `value` to QueryEngine.submitMessage() here.
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: value },
      { role: 'agent', content: `Received: ${value}` }
    ]);
    setInput('');
  };

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="blue">
      <Box flexDirection="column" marginBottom={1}>
        <Text bold color="cyan">🤖 Spider ADK (Interactive Mode)</Text>
        <Text dimColor>Type /help to see slash commands.</Text>
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
