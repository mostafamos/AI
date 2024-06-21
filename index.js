const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { LlamaAPI } = require('llamaapi');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const llamaKey = process.env.LLAMAKEY;

if (!llamaKey) {
  console.error('LLAMA key is not set. Please set the LLAMAKEY environment variable.');
  process.exit(1);
} else {
  console.log('Using LLAMA key:', llamaKey);
}

const llama = new LlamaAPI(llamaKey);

app.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await llama.run({
      model: 'llama3-70b',
      messages: [
        { role: 'system', content: "You are a llama assistant that talks like a llama, starting every word with 'll'." },
        { role: 'user', content: text },
      ],
    });

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
