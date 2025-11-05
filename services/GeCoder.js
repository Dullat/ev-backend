const NodeGeocoder = require("node-geocoder");

const geoCoder = NodeGeocoder({
  provider: "openstreetmap",
  osmServer: "https://nominatim.openstreetmap.org",
});

const decode = async ({ lat, lon }) => {
  const result = await geoCoder.reverse({ lat, lon });
  const address = result[0].formattedAddress;
  return result[0];
};

module.exports = decode;
