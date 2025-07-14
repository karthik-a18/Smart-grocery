// seed.js
const mongoose = require('mongoose');
const Item = require('./models/Item');

mongoose.connect('mongodb://localhost:27017/smartgrocery').then(async () => {
  await Item.deleteMany();

  await Item.insertMany([
    {
      name: 'Rice',
      weight: '1kg',
      avgPrice: 55,
      storePrices: { Dmart: 50, BigBasket: 60, Reliance: 55 }
    },
    {
      name: 'Wheat Flour',
      weight: '1kg',
      avgPrice: 40,
      storePrices: { Dmart: 38, BigBasket: 42, Reliance: 41 }
    },
    {
      name: 'Sugar',
      weight: '1kg',
      avgPrice: 45,
      storePrices: { Dmart: 44, BigBasket: 47, Reliance: 46 }
    },
    {
      name: 'Salt',
      weight: '1kg',
      avgPrice: 20,
      storePrices: { Dmart: 18, BigBasket: 22, Reliance: 20 }
    },
    {
      name: 'Cooking Oil',
      weight: '1L',
      avgPrice: 150,
      storePrices: { Dmart: 145, BigBasket: 155, Reliance: 150 }
    },
    {
      name: 'Urad Dal',
      weight: '1kg',
      avgPrice: 120,
      storePrices: { Dmart: 115, BigBasket: 125, Reliance: 120 }
    },
    {
      name: 'Moong Dal',
      weight: '1kg',
      avgPrice: 100,
      storePrices: { Dmart: 95, BigBasket: 105, Reliance: 100 }
    },
    {
      name: 'Chana Dal',
      weight: '1kg',
      avgPrice: 90,
      storePrices: { Dmart: 85, BigBasket: 95, Reliance: 90 }
    },
    {
      name: 'Red Lentils',
      weight: '1kg',
      avgPrice: 110,
      storePrices: { Dmart: 105, BigBasket: 115, Reliance: 110 }
    },
    {
      name: 'Black Pepper',
      weight: '100g',
      avgPrice: 30,
      storePrices: { Dmart: 28, BigBasket: 32, Reliance: 30 }
    },
    {
      name: 'Turmeric Powder',
      weight: '100g',
      avgPrice: 20,
      storePrices: { Dmart: 18, BigBasket: 22, Reliance: 20 }
    },
    {
      name: 'Coriander Powder',
      weight: '100g',
      avgPrice: 25,
      storePrices: { Dmart: 23, BigBasket: 27, Reliance: 25 }
    },
    {
      name: 'Cumin Seeds',
      weight: '100g',
      avgPrice: 15,
      storePrices: { Dmart: 14, BigBasket: 16, Reliance: 15 }
    },
    {
      name: 'Mustard Seeds',
      weight: '100g',
      avgPrice: 12,
      storePrices: { Dmart: 11, BigBasket: 13, Reliance: 12 }
    },
    {
      name: 'Ginger Garlic Paste',
      weight: '200g',
      avgPrice: 35,
      storePrices: { Dmart: 33, BigBasket: 37, Reliance: 35 }
    },
    {
      name: 'Green Chilies',
      weight: '100g',
      avgPrice: 10,
      storePrices: { Dmart: 9, BigBasket: 11, Reliance: 10 }
    },
    {
      name: 'Onions',
      weight: '1kg',
      avgPrice: 30,
      storePrices: { Dmart: 28, BigBasket: 32, Reliance: 30 }
    },
    {
      name: 'Tomatoes',
      weight: '1kg',
      avgPrice: 25,
      storePrices: { Dmart: 23, BigBasket: 27, Reliance: 25 }
    },
    {
      name:'Potatoes',
      weight:'1kg',
      avgPrice: 20,
      storePrices: { Dmart: 18, BigBasket: 22, Reliance: 20 }
    }
  ]);

  console.log('Sample items inserted');
  process.exit();
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});