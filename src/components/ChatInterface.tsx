'use client';

import { useState, useRef, useEffect } from 'react';
import { VerboseSensayAPI } from '@/api-debug';
import { SAMPLE_USER_ID, SAMPLE_REPLICA_SLUG, API_VERSION } from '@/constants/auth';

// Import types for the replica payload
type LlmModel = 'gpt-4o' | 'claude-3-5-haiku-latest' | 'claude-3-7-sonnet-latest' | 'grok-2-latest' | 'grok-3-beta' | 'deepseek-chat' | 'o3-mini' | 'gpt-4o-mini' | 'huggingface-eva' | 'huggingface-dolphin-llama';
type MemoryMode = 'prompt-caching' | 'rag-search';
type ReplicaType = 'individual' | 'character' | 'brand';

// Define chat message type
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

interface ChatInterfaceProps {
  apiKey?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  apiKey
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [showConfig, setShowConfig] = useState(!apiKey);
  
  // Update localApiKey when apiKey prop changes
  useEffect(() => {
    console.log("API Key provided:", !!apiKey);
    if (apiKey) {
      setLocalApiKey(apiKey);
      setShowConfig(false);
    }
  }, [apiKey]);
  const [replicaUuid, setReplicaUuid] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
    setReplicaUuid(null); // Reset replica UUID when changing API key
  };

  // Initialize user and replica for the session
  const initializeSession = async (client: VerboseSensayAPI): Promise<string> => {
    console.log('--- INITIALIZING SESSION ---');
    if (replicaUuid) {
      console.log(`Reusing existing replica UUID: ${replicaUuid}`);
      return replicaUuid;
    }

    try {
      // Step 1: Check if the sample user exists (authenticate without X-USER-ID)
      console.log('Step 1: Checking if sample user exists...');
      const orgOnlyClient = new VerboseSensayAPI({
        HEADERS: {
          'X-ORGANIZATION-SECRET': localApiKey
        }
      });
      console.log('Created org-only client without user authentication');
      
      let userExists = false;
      
      try {
        // Try to get the user
        console.log(`Attempting to get user with ID: ${SAMPLE_USER_ID}`);
        await orgOnlyClient.users.getV1Users(SAMPLE_USER_ID);
        userExists = true;
        console.log(`✅ User ${SAMPLE_USER_ID} exists`);
      } catch (error) {
        console.log(`❌ User ${SAMPLE_USER_ID} does not exist, will create it`);
        console.log('Get user error details:', error);
      }
      
      // Step 2: Create the user if it doesn't exist
      if (!userExists) {
        console.log('Step 2: Creating new user...');
        try {
          const newUser = await orgOnlyClient.users.postV1Users(API_VERSION, {
            id: SAMPLE_USER_ID,
            name: "Sample User"
          });
          console.log(`✅ Created user ${SAMPLE_USER_ID}:`, newUser);
        } catch (createUserError) {
          console.error('❌ Failed to create user:', createUserError);
          throw createUserError;
        }
      }
      
      // Step 3: Now use the user-authenticated client for further operations
      console.log('Step 3: Creating user-authenticated client...');
      const userClient = new VerboseSensayAPI({
        HEADERS: {
          'X-ORGANIZATION-SECRET': localApiKey,
          'X-USER-ID': SAMPLE_USER_ID
        }
      });
      console.log('Created user-authenticated client');
      
      // Step 4: List all replicas for this user
      console.log('Step 4: Listing all replicas for user...');
      let replicas;
      try {
        replicas = await userClient.replicas.getV1Replicas();
        console.log('Replicas response:', replicas);
      } catch (listReplicasError) {
        console.error('❌ Failed to list replicas:', listReplicasError);
        throw listReplicasError;
      }
      
      // Check if we have a replica with our sample slug
      let uuid: string | undefined;
      if (replicas && replicas.items) {
        console.log('Looking for an existing replica');
        const sampleReplica = replicas.items[0];
        if (sampleReplica) {
          uuid = sampleReplica.uuid;
          console.log(`✅ Found existing replica: ${SAMPLE_REPLICA_SLUG} with UUID: ${uuid}`);
        } else {
          console.log('❌ No replica found');
        }
      } else {
        console.log('No replicas found or replicas.items is undefined');
      }
      
      // Step 5: Create a replica if it doesn't exist
      if (!uuid) {
        console.log('Step 5: Creating new replica...');
        try {
          // Generate a unique slug by adding a timestamp and random string
          const timestamp = Date.now();
          const randomStr = Math.random().toString(36).substring(2, 8);
          const uniqueSlug = `${SAMPLE_REPLICA_SLUG}-${timestamp}-${randomStr}`;
          
          console.log(`Generated unique slug: ${uniqueSlug}`);
          
          const replicaPayload = {
            name: "Sample Replica",
            shortDescription: "A sample replica for demonstration",
            greeting: "Hello, I'm the sample replica. How can I help you today?",
            slug: uniqueSlug, // Use the generated unique slug instead of the static one
            ownerID: SAMPLE_USER_ID,
            llm: {
              model: 'claude-3-7-sonnet-latest' as LlmModel,
              memoryMode: 'prompt-caching' as MemoryMode,
              systemMessage: "You are a helpful replica that provides clear and concise responses."
            }
          };
          console.log('Creating replica with payload:', replicaPayload);
          
          const newReplica = await userClient.replicas.postV1Replicas(API_VERSION, replicaPayload);
          uuid = newReplica.uuid;
          console.log(`✅ Created new replica with unique slug: ${uniqueSlug}, UUID: ${uuid}`);
        } catch (createReplicaError: any) {
          console.error('❌ Failed to create replica:', createReplicaError);
          
          // Handle 409 Conflict specifically
          if (createReplicaError.status === 409) {
            console.error('409 Conflict: A replica with this slug already exists');
            console.error('The replica might exist globally but is not accessible by this user');
            
            // Instead of throwing the error, we could:
            // 1. Try with a different slug 
            // 2. Try to fetch by UUID directly if we have it
            // 3. Manually return a "fallback" UUID if we know it
            
            // For now, just make the error message more informative
            const specificError = new Error(
              `A replica with slug "${SAMPLE_REPLICA_SLUG}" already exists but couldn't be accessed. ` +
              `This typically happens when a replica with the same slug exists but is owned by a different user. ` +
              `Try using a different slug by modifying SAMPLE_REPLICA_SLUG in src/constants/auth.ts.`
            );
            throw specificError;
          }
          
          throw createReplicaError;
        }
      }
      
      console.log(`Setting replica UUID: ${uuid}`);
      setReplicaUuid(uuid);
      console.log('--- SESSION INITIALIZATION COMPLETE ---');
      return uuid;
    } catch (error: any) {
      console.error('❌❌❌ Error initializing session:', error);
      console.error('Error type:', typeof error);
      
      // Check specifically for unauthorized errors which likely indicate an invalid API key
      let userFriendlyMessage = '';
      
      if (error.status === 401 || error.message?.includes('Unauthorized') || error.message?.includes('401')) {
        userFriendlyMessage = 'Invalid or expired API key. Please check your API key and try again.';
        console.error('Authentication error detected - likely invalid API key');
      } else if (error.status === 403 || error.message?.includes('Forbidden') || error.message?.includes('403')) {
        userFriendlyMessage = 'Your API key does not have permission for this operation. Please check your account permissions.';
      } else if (error.status === 429 || error.message?.includes('Too Many Requests') || error.message?.includes('429')) {
        userFriendlyMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else {
        // Generic error handling
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        userFriendlyMessage = errorMessage;
      }
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Non-Error object:', JSON.stringify(error, null, 2));
      }
      
      throw new Error(`Failed to initialize Sensay session: ${userFriendlyMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    if (!localApiKey) {
      setError('Please provide an API key');
      return;
    }

    setError(null);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    
    try {
      // Initialize API client with the API key
      const client = new VerboseSensayAPI({
        // Use custom headers instead of TOKEN
        HEADERS: {
          'X-ORGANIZATION-SECRET': localApiKey,
          'X-USER-ID': SAMPLE_USER_ID
        }
      });
      
      // Initialize the session and get a replica UUID
      const replica = await initializeSession(client);
      
      // Add assistant placeholder message while loading
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '',
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setIsLoading(true);
      
      // Use the standard non-streaming chat completions endpoint
      const response = await client.chatCompletions.postV1ReplicasChatCompletions(
        replica,
        API_VERSION,
        {
          content: userMessage.content,
          source: 'web',
          skip_chat_history: false
        }
      );
      
      // Update the placeholder message with the actual response
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: response.content
        };
        return newMessages;
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Extract the specific error message from the API response
      let errorMessage = 'Failed to send message. Please check your API key and try again.';
      
      // Create a more user-friendly error message based on error type
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Check for specific error patterns to provide better guidance
        if (errorMessage.includes('Invalid or expired API key')) {
          errorMessage = 'Invalid or expired API key. Please check your API key and try again.';
        } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
          errorMessage = 'Authentication failed. Your API key may be invalid or expired.';
        } else if (errorMessage.includes('Forbidden') || errorMessage.includes('403')) {
          errorMessage = 'You don\'t have permission to perform this action. Please check your account access level.';
        } else if (errorMessage.includes('Too Many Requests') || errorMessage.includes('429')) {
          errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
        } else if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network connection issue. Please check your internet connection and try again.';
        }
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract error message from different possible formats
        const errorObj = err as any;
        
        // Check for authentication errors first - most common issue
        if (errorObj.status === 401 || (errorObj.response && errorObj.response.status === 401)) {
          errorMessage = 'Authentication failed. Your API key may be invalid or expired.';
        } else if (errorObj.error?.message) {
          errorMessage = errorObj.error.message;
        } else if (errorObj.error) {
          errorMessage = typeof errorObj.error === 'string' ? errorObj.error : JSON.stringify(errorObj.error);
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.response?.data) {
          const respData = errorObj.response.data;
          if (respData.error?.message) {
            errorMessage = respData.error.message;
          } else if (respData.message) {
            errorMessage = respData.message;
          } else if (typeof respData === 'string') {
            errorMessage = respData;
          } else {
            errorMessage = `API Error (${errorObj.response.status}): ${JSON.stringify(respData)}`;
          }
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      // Remove the assistant message if it failed
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Config Panel */}
      <div className="mb-4">
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="text-xs underline text-gray-500 hover:text-gray-700"
        >
          {showConfig ? 'Hide API Configuration' : 'Show API Configuration'}
        </button>
        
        {showConfig && (
          <div className="p-4 bg-gray-100 rounded-lg mt-2">
            <div className="mb-4">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                Sensay API Key
              </label>
              <input
                id="apiKey"
                type="password"
                value={localApiKey}
                onChange={handleApiKeyChange}
                className="input"
                placeholder="Your Sensay API Key"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This value will be stored in your browser. 
              For development use, set it as the NEXT_PUBLIC_SENSAY_API_KEY_SECRET environment variable.
              <br />
              Note: A user and replica will be automatically created or reused when connecting.
            </p>
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Start a conversation with the Sensay AI</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-12'
                    : 'bg-gray-100 mr-12'
                }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {message.role === 'user' ? 'You' : 'Sensay AI'}
                </div>
                <div className="whitespace-pre-wrap">
                  {formatMessage(message.content)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-md font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
                
                {/* Display helpful suggestions based on error message */}
                {error.includes('API key') && (
                  <div className="mt-3 bg-white p-3 rounded border border-red-100 text-xs text-gray-700">
                    <p className="font-medium mb-1">Possible solutions:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Check if your API key is entered correctly</li>
                      <li>Make sure there are no extra spaces before or after the key</li>
                      <li>Try generating a new API key from the Sensay dashboard</li>
                      <li>Ensure your Sensay account has API access enabled</li>
                    </ul>
                  </div>
                )}
                
                {error.includes('replica') && (
                  <div className="mt-3 bg-white p-3 rounded border border-red-100 text-xs text-gray-700">
                    <p className="font-medium mb-1">Possible solutions:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Edit the SAMPLE_REPLICA_SLUG in src/constants/auth.ts to use a unique name</li>
                      <li>Check your Sensay dashboard for existing replicas</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute right-2 bottom-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
            : 'Send'
          }
        </button>
      </form>
      
      <p className="text-xs text-gray-400 mt-2 text-center">
        Powered by Sensay Wisdom AI API
      </p>
    </div>
  );
};

export default ChatInterface;