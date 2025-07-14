const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const multer = require('multer');
const xlsx = require('xlsx');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const mongoose = require('mongoose');

// Mongoose connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'excel-files',
    format: async (req, file) => 'xlsx',
    public_id: (req, file) => file.originalname,
  },
});

const app = express();
app.use(cors());

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error parsing Excel file' });
  }
});

app.post('/generate-tweets', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate 5 different versions of the following tweet: "${message}"`,
      max_tokens: 2048,
      n: 5,
      stop: null,
      temperature: 0.7,
    });

    res.json(response.data.choices);
  } catch (error) {
    res.status(500).json({ error: 'Error generating tweets' });
  }
});

const { TwitterApi } = require('twitter-api-v2');

app.post('/post-tweet', async (req, res) => {
  const { tweet, credentials } = req.body;

  try {
    const client = new TwitterApi({
      appKey: credentials.appKey,
      appSecret: credentials.appSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    });

    await client.v2.tweet(tweet);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error posting tweet' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
