import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    app.listen(config.port, () => {
      console.log(`Hotel booking app is running on:${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
