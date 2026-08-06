const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb, getDb } = require('./database');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const tableRoutes = require('./routes/tables');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDb();

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tables', tableRoutes);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
