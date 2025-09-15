import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime';

const statusEl = document.getElementById('status') as HTMLElement;
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const disconnectBtn = document.getElementById(
  'disconnectBtn',
) as HTMLButtonElement;
const errorEl = document.getElementById('error') as HTMLElement;

let session: RealtimeSession | null = null;

function showError(message: string): void {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
  setTimeout(() => {
    errorEl.style.display = 'none';
  }, 5000);
}

function updateStatus(message: string, className: string): void {
  statusEl.textContent = message;
  statusEl.className = `status ${className}`;
}

function setConnected(connected: boolean): void {
  connectBtn.disabled = connected;
  disconnectBtn.disabled = !connected;
  apiKeyInput.disabled = connected;
}

connectBtn.addEventListener('click', async () => {
  const apiKey = apiKeyInput.value.trim();

  if (!apiKey) {
    showError('Please enter an ephemeral API key');
    return;
  }

  if (!apiKey.startsWith('ek_')) {
    showError('API key should start with "ek_"');
    return;
  }

  try {
    updateStatus('Connecting...', 'connecting');
    setConnected(true);

    // Create the agent
    const agent = new RealtimeAgent({
      name: 'Assistant',
      instructions:
        'You are a helpful voice assistant. Be conversational and engaging. Keep responses concise but informative.',
    });

    // Create the session
    session = new RealtimeSession(agent, {
      model: 'gpt-realtime',
    });

    // Connect to the session
    await session.connect({ apiKey });

    updateStatus('✅ Connected! You can now start talking.', 'connected');
    console.log('Connected to OpenAI Realtime API');
  } catch (error) {
    console.error('Connection error:', error);
    showError(`Connection failed: ${(error as Error).message}`);
    updateStatus('Connection failed', 'disconnected');
    setConnected(false);
    session = null;
  }
});

disconnectBtn.addEventListener('click', async () => {
  try {
    if (session) {
      await session.disconnect();
      session = null;
    }
    updateStatus('Disconnected', 'disconnected');
    setConnected(false);
  } catch (error) {
    console.error('Disconnect error:', error);
    showError(`Disconnect failed: ${(error as Error).message}`);
  }
});

// Handle page unload
window.addEventListener('beforeunload', async () => {
  if (session) {
    try {
      await session.disconnect();
    } catch (error) {
      console.error('Error disconnecting on page unload:', error);
    }
  }
});
