const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);



const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
  const {text} = req.body
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${text}`,
    temperature: 0.7,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  })
  //console.log(response.data)
  if (response.data.choices[0].text){
    res.json({
      message: response.data.choices[0].text
    })
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port 3000');
});
