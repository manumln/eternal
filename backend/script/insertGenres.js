const mongoose = require('mongoose');
const Genre = require('../models/genre'); // Asegúrate de que el modelo esté correctamente definido

mongoose
  .connect('mongodb+srv://mmolina:mmolina@eternal-music.6cd1c.mongodb.net/?retryWrites=true&w=majority&appName=eternal-music', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');

    const genres = [
      { name: 'Pop' },
      { name: 'Rock' },
      { name: 'Hip-Hop' },
      { name: 'Jazz' },
      { name: 'Classical' },
      { name: 'Electronic' },
      { name: 'Blues' },
      { name: 'Country' },
      { name: 'Reggae' },
      { name: 'Metal' },
      { name: 'R&B' },
      { name: 'Soul' },
      { name: 'Funk' },
      { name: 'Punk' },
      { name: 'Alternative' },
      { name: 'Indie' },
      { name: 'Gospel' },
      { name: 'Disco' },
      { name: 'House' },
      { name: 'Techno' },
      { name: 'Trance' },
      { name: 'Ambient' },
      { name: 'Folk' },
      { name: 'Latin' },
      { name: 'Salsa' },
      { name: 'Cumbia' },
      { name: 'Tango' },
      { name: 'K-Pop' },
      { name: 'J-Pop' },
      { name: 'Afrobeats' },
      { name: 'Reggaeton' },
      { name: 'Dancehall' },
      { name: 'Dubstep' },
      { name: 'Trap' },
      { name: 'Drum and Bass' },
      { name: 'Lo-fi' },
      { name: 'New Age' },
      { name: 'Chillwave' },
      { name: 'Grunge' },
      { name: 'Hardcore' },
      { name: 'Ska' },
      { name: 'Swing' },
      { name: 'Opera' },
      { name: 'Soundtrack' },
      { name: 'World Music' },
      { name: 'Traditional' },
      { name: 'Experimental' },
      { name: 'Avant-Garde' },
      { name: 'Post-Rock' },
      { name: 'Shoegaze' },
      { name: 'Chiptune' },
      { name: 'Video Game Music' },
      { name: 'Acoustic' },
      { name: 'Krautrock' },
      { name: 'Bossa Nova' },
      { name: 'Flamenco' },
      { name: 'Mariachi' },
      { name: 'Bolero' },
      { name: 'Doo-Wop' },
      { name: 'Baroque' },
      { name: 'Gregorian Chant' },
      { name: 'Minimalism' },
      { name: 'Electro' },
      { name: 'Industrial' },
      { name: 'Noise' },
      { name: 'Garage Rock' },
      { name: 'Dream Pop' },
      { name: 'Synthwave' },
      { name: 'Future Bass' },
      { name: 'Cloud Rap' },
    ];

    // Insertar los géneros en la base de datos
    Genre.insertMany(genres)
      .then(() => {
        console.log('Genres inserted successfully!');
        mongoose.disconnect(); // Desconectar cuando termine
      })
      .catch((error) => {
        console.error('Error inserting genres:', error);
        mongoose.disconnect();
      });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
