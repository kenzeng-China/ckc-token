/**
 * Example: Using ckc-token Responses API with raw fetch API
 *
 * This example demonstrates how to make direct HTTP requests to the ckc-token
 * Responses API endpoint using the native fetch API without any additional libraries.
 */

export {};

// ckc-token Responses API endpoint
const CKC_TOKEN_API_URL = 'https://t.ckcloudai.com/v1/responses';

// Request payload following OpenAI-compatible responses format
const requestBody = {
  model: 'gpt-5.2',
  input: 'Hello, what can you do?',
};

console.log('=== ckc-token Responses API Fetch Example ===\n');
console.log('Request:');
console.log(`URL: ${CKC_TOKEN_API_URL}`);
console.log('Model:', requestBody.model);
console.log('Input:', requestBody.input);
console.log();

try {
  // Ensure API key is available
  if (!process.env.CKC_TOKEN_API_KEY) {
    throw new Error(
      'CKC_TOKEN_API_KEY environment variable is not set.\n' +
        'Please set it with: export CKC_TOKEN_API_KEY=your-api-key',
    );
  }

  // Make the HTTP POST request to ckc-token
  const response = await fetch(CKC_TOKEN_API_URL, {
    method: 'POST',
    headers: {
      // Required: Authorization header with your API key
      Authorization: `Bearer ${process.env.CKC_TOKEN_API_KEY}`,
      // Required: Content type for JSON payload
      'Content-Type': 'application/json',
      // Optional but recommended: Identify your app
      'X-Title': 'ckc-token Responses Fetch Example',
    },
    body: JSON.stringify(requestBody),
  });

  // Check if the request was successful
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, body: ${errorText}`,
    );
  }

  // Parse the JSON response
  const data = (await response.json()) as {
    id: string;
    model: string;
    output: Array<{
      type: string;
      role: string;
      content: Array<{
        type: string;
        text: string;
      }>;
    }>;
    usage: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
    };
  };

  // Display the response
  console.log('Response:');
  console.log('Status:', response.status, response.statusText);
  console.log('Model used:', data.model);
  console.log('\nGenerated content:');
  console.log(data.output[0]?.content?.[0]?.text);
  console.log('\nUsage stats:');
  console.log('- Input tokens:', data.usage.input_tokens);
  console.log('- Output tokens:', data.usage.output_tokens);
  console.log('- Total tokens:', data.usage.total_tokens);

  // Optional: Show raw response structure
  if (process.env.DEBUG) {
    console.log('\nFull response object:');
    console.log(JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error('Error making request to ckc-token:');

  if (error instanceof Error) {
    console.error('Error message:', error.message);
  } else {
    console.error('Unknown error:', error);
  }

  process.exit(1);
}