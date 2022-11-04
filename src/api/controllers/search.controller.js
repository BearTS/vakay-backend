const {join} = require('path');
const cityModel = require(join(__dirname, '..', 'models', 'city.model'));
const placeModel = require(join(__dirname, '..', 'models', 'place.model'));
const packageModel = require(join(__dirname, '..', 'models', 'package.model'));
const hotelModel = require(join(__dirname, '..', 'models', 'hotel.model'));


exports.getSuggestions = async (req, res) => {
    const { city } = req.query;
    try {
        const cities = await cityModel.find({ name: { $regex: city, $options: 'i' } });
        let array = [];
        for (let i = 0; i < cities.length; i++) {
            const city = cities[i];
            array.push(city.name);
        }
        return res.status(200).json({
            success: true,
            data: array
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


exports.getCityData = async (req, res) =>{
    const {city, place} = req.query;

    try {
        if (city) {
        let cityData = await cityModel.findOne({name: city}).populate({
            path: 'places',
            select: 'name location description image'
        }).populate({
            path: 'hotels',
            select: 'name location description image'
        })
        let array = []
        if (cityData.packages) {
            for (let i = 0; i < cityData.packages.length; i++) {
                const package = cityData.packages[i];
                const packageData = await packageModel.findById(package)
                let obj = {
                    name: packageData.name,
                    description: packageData.description,
                    price: packageData.price,
                    image: packageData.image
                }
                array.push(obj);
            }   
            cityData.packages = array;
        } 
        let data = {
            id: cityData._id,
            name: cityData.name,
            tag: cityData.tag,
            state: cityData.state,
            country: cityData.country,
            places: cityData.places,
            packages: array,
            image: cityData.image,
            hotels: cityData.hotels
        }
        return res.status(200).json({
            success: true,
            data: data
        });
        }
        if (place) {
            let placeData = await placeModel.findOne({name: place}).populate({
                path: 'city',
                select: 'name location description image'
            })
            return res.status(200).json({
                success: true,
                data: placeData
            });
        }
        return res.status(400).json({
            success: false,
            message: 'No city or place found'
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


async function getReviews(hotelID) {
    const { id } = hotelID;
    const reviews = await Review.find({ hotel: id });
    if (reviews) {
        return reviews;
    }

}
