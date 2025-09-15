import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';

const agent = new RealtimeAgent({
  name: 'Assistant',
  instructions:
    'You are a helpful voice assistant. Be conversational and engaging. Keep responses concise but informative.',
});

console.log('if you see this you are ok!')