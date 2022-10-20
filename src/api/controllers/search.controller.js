const {join} = require('path');
const cityModel = require(join(__dirname, '..', 'models', 'city.model'));
const placeModel = require(join(__dirname, '..', 'models', 'place.model'));
const hotelModel = require(join(__dirname, '..', 'models', 'hotel.model'));


exports.getSuggestions = async (req, res) => {
    const { city } = req.query;
    try {
        const cities = await cityModel.find({ name: { $regex: city, $options: 'i' } });
        return res.status(200).json({
            success: true,
            data: cities
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

exports.getCityData = async (req, res) =>{
    const {city} = req.query;
    try {
        const cityData = await cityModel.findOne({name: city}).populate('places').populate('hotels').populate('packages');
        return res.status(200).json({
            success: true,
            data: cityData
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

exports.getPlaceData = async (req,res) => {
    const {place} = req.query;
    try {
        const placeData = await placeModel.findOne({name: place}).populate('city').populate('hotels');
        return res.status(200).json({
            success: true,
            data: placeData
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

