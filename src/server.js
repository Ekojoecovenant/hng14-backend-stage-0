import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get('/api/classify', async (req, res) => {
  try {
    let query = req.query;

    // to check if it's empty
    if (!query?.name) {
      return res.status(400).json({
        status: 'error',
        message: '"name" is missing or empty',
      });
    }

    //used a regex to check if any invalid char is in the name
    const alphabets = /[^a-zA-Z\s'-]/;
    if (alphabets.test(query.name.trim())) {
      return res.status(422).json({
        status: 'error',
        message: '"name" has an invalid character',
      });
    }

    const genderRes = await fetch(
      `https://api.genderize.io?name=${encodeURIComponent(query.name.trim())}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (!genderRes.ok) {
      return res.status(502).json({
        status: 'error',
        message: 'Upstream error',
      });
    }

    const data = await genderRes.json();

    if (data.gender == null || data.count == 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No prediction available for the provided name',
      });
    }

    res.json({
      status: 'success',
      data: {
        name: data.name,
        gender: data.gender,
        probability: data.probability,
        sample_size: data.count,
        is_confident: data.probability >= 0.7 && data.count >= 100,
        processed_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

/*
{
  "status": "success",
  "data": {
    "name": "tester",
    "gender": "male",
    "probability": 0.85,
    "sample_size": 556,
    "is_confident": true,
    "processed_at": "2026-04-13T14:08:02.909Z"
  }
}
*/
