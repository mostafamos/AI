const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});
const openai = new OpenAIApi(configuration);

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
  const { text } = req.body;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${text}`,
      temperature: 0.7,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    console.log(response.data);

    if (response.data.choices[0].text) {
      res.json({
        message: response.data.choices[0].text.trim()
      });
    } else {
      res.status(500).json({
        error: 'No text found in the response'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
