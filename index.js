const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { LlamaAPI } = require('llamaapi'); // Ensure you import LlamaAPI correctly

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Retrieve the API key from environment variables
const llamaKey = process.env.LLAMAKEY;

// Log the API key (for debugging only, remove this in production)
if (!llamaKey) {
  console.error('LLAMA key is not set. Please set the LLAMAKEY environment variable.');
  process.exit(1);
} else {
  console.log('Using LLAMA key:', llamaKey);
}

// Initialize the LlamaAPI with your API token
const llama = new LlamaAPI(llamaKey);

// Route for handling POST requests
app.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    // Make the API request asynchronously
    const response = await llama.run({
      model: 'llama3-70b',
      messages: [
        { role: 'system', content: "You are a llama assistant that talks like a llama, starting every word with 'll'." },
        { role: 'user', content: text },
      ],
    });

    // Parse and return the response
    if (response && response.data) {
      res.json({
        message: response.data,
      });
    } else {
      res.status(500).json({
        error: 'No valid response from the API',
      });
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);

      res.status(error.response.status).json({
        error: error.response.data,
      });
    } else if (error.request) {
      console.error('Request data:', error.request);

      res.status(500).json({
        error: 'No response received from the API',
      });
    } else {
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'An error occurred while processing your request',
      });
    }
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
