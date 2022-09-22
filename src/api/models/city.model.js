const mongoose = require('mongoose')

const CitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    tag: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    packages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
    image: { type: String, required: true },
    hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
}, { timestamps: true })

module.exports = mongoose.model('City', CitySchema)