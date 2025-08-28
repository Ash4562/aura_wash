const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwelrst7z',
  api_key: '734525746611174',
  api_secret: 'vYg1kIpMgimNIfSFo1U7wOGp2p0'
});

module.exports = cloudinary;
