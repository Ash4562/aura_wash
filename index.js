const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://planet-wash-site.onrender.com",
        "https://admin.planetwash.in",
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use("/shop/contactus", require("./routes/conatct/ContantusRoutes"));
app.use("/shop/pickup", require("./routes/conatct/PickupRoutes"));
// shop
app.use("/shop/auth", require("./routes/shop/shopAuthroutes"));
app.use('/shop/service', require('./routes/shop/serviceRoutes'));
app.use('/shop/product', require('./routes/shop/ProductRoutes'));
app.use('/shop/notes', require('./routes/shop/ShotNoteRoutes'));
// photo
app.use('/shop/gallery', require('./routes/shop/GalleryRoutes'));
app.use('/shop/offer', require('./routes/shop/OfferRoutes'));
// user
app.use('/user/auth', require('./routes/user/userAuthRoutes'));
app.use('/user/address', require('./routes/user/userAddressRoutes'));
app.use('/user/order', require('./routes/user/orderRoutes'));
// deliveryBoy
app.use('/delivery/auth', require('./routes/deliveryboyroutes/DeliveryBoyRoutes'));
// admin
app.use('/admin/auth', require('./routes/admin/authRoutes'));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));
