const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Retrieve the API key and organization ID from environment variables
const apiKey = process.env.APIKEY;
const organizationId = process.env.ORGANIZATION_ID;

// Log the API key and organization ID (for debugging only, remove this in production)
if (!apiKey) {
  console.error('API key is not set. Please set the APIKEY environment variable.');
  process.exit(1);
} else {
  console.log('Using API key:', apiKey);
}

if (!organizationId) {
  console.error('Organization ID is not set. Please set the ORGANIZATION_ID environment variable.');
  process.exit(1);
} else {
  console.log('Using Organization ID:', organizationId);
}

// Configure the OpenAI API with the key and organization ID
const configuration = new Configuration({
  apiKey: apiKey,
  organization: organizationId,
});
const openai = new OpenAIApi(configuration);

app.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "davinci-001",
      prompt: text,
      temperature: 0.7,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text) {
      res.json({
        message: response.data.choices[0].text.trim()
      });
    } else {
      res.status(500).json({
        error: 'No valid response from the API'
      });
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);

      res.status(error.response.status).json({
        error: error.response.data
      });
    } else if (error.request) {
      console.error('Request data:', error.request);

      res.status(500).json({
        error: 'No response received from the API'
      });
    } else {
      console.error('Error message:', error.message);

      res.status(500).json({
        error: 'An error occurred while processing your request'
      });
    }
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
