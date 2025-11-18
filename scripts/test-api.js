import { fetch } from 'undici';

async function testApi() {
  console.log('🧪 Testing API Connectivity...');
  
  const API_URL = 'http://localhost:3000/api/chat/save';
  
  try {
    console.log(`Testing POST to ${API_URL}...`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'Test Topic',
        questions: ['Question 1'],
        selectedQuestion: 'Question 1',
        messages: [
          { role: 'user', content: 'Hello', timestamp: Date.now() }
        ]
      })
    });

    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Success!');
      console.log('Response:', data);
      console.log('\n--> Your API is working correctly. The issue is likely in the frontend code or Anthropic API call.');
    } else {
      console.error('❌ API Failed');
      console.error('Status Text:', response.statusText);
      const text = await response.text();
      console.error('Response Body:', text);
      
      if (response.status === 404) {
        console.log('\n--> 404 Not Found means the API route is not being served.');
        console.log('    Make sure you are running "vercel dev" (not "vite") and accessing localhost:3000');
      }
    }
  } catch (error) {
    console.error('❌ Connection Failed');
    console.error(error.message);
    console.log('\n--> Could not connect to localhost:3000. Is the dev server running?');
    console.log('    Run "npm run dev" in another terminal first.');
  }
}

testApi();

