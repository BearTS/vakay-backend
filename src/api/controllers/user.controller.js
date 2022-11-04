const { join } = require('path')
const User = require(join(__dirname, '..', 'models', 'user.model'))
const City = require(join(__dirname, '..', 'models', 'city.model'))
const Package = require(join(__dirname, '..', 'models', 'package.model'))
const Hotel = require(join(__dirname, '..', 'models', 'hotel.model'))
const Place = require(join(__dirname, '..', 'models', 'place.model'))
const Review = require(join(__dirname, '..', 'models', 'review.model'))
const SendEmail = require(join(__dirname, '..', 'utils', 'sendEmail'))

exports.createPlanTrip = async (req, res) => {
    let { name, description, startDate, endDate, city, package, hotel, planning } = req.body;
    const { id } = req.user;
    try {
        const CityData = await City.findOne({ name: city });
        if (!CityData) {
            return res.status(404).json({
                message: 'City not found',
                data: null
            });
        }
        if (package) { 
            const PackageData = await Package.findOne({ name: package });
            if (PackageData) {
                package = PackageData._id;
            } else {
                return res.status(400).json({ message: 'Package not found' });
            }
        }

        let hotelarray = []
        for(let i = 0; i < hotel.length; i++){
            hotel[i].hotel = await Hotel.findOne({name: hotel[i].hotel});
            if (!hotel[i].hotel) {
                return res.status(400).json({
                    message: "Hotel not found"
                });
            }
            let hotelobj = {
                date: hotel[i].date,
                hotel: hotel[i].hotel._id
            }
            hotelarray.push(hotelobj);

        }
        let placeArray = [];
        for (let i = 0; i < planning.length; i++) {
            planning[i].place = await Place.findOne({ name: planning[i].place });
            if (!planning[i].place) {
                return res.status(400).json({
                    message: "Place not found"
                });
            }
            let placeobj = {
                start_date: planning[i].start_date,
                end_date: planning[i].end_date,
                place: planning[i].place._id
            }
            placeArray.push(placeobj);
        }
        const hash = uuidv4();
        let myObj = {
            hash: hash,
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            owner: id,
            members: [id],
            city: CityData._id,
            package: package,
            hotel: hotelarray,
            planning: placeArray
        }
        const trip = await Trip.create(myObj);
        return res.status(200).json({
            message: 'Trip created successfully',
            data: trip
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

exports.inviteUser = async (req, res) => {
    const { email, id} = req.body;
    try {
        const owner = await User.findById(req.user.id);
        const user = await User.findOne({ email: email });
        const trip = await Trip.findOne({ _id: id });
        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
                data: null
            });
        }
        if (trip.members.includes(user._id)) {
            return res.status(400).json({
                message: 'User already in trip',
                data: null
            });
        }
        const url = `http://${req.host}/trip/${trip.hash}`;
        let html = `<p>You have been invited to join a trip by ${owner.name}. Please click the link below to join the trip.</p><a href="${url}">${url}</a>`;
            await SendEmail({
                email: email,
                subject: 'Trip Invitation',
                html: html
            });

        return res.status(200).json({
            message: 'User invited successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }

}

exports.acceptInvitation = async (req,res) => {
    const { hash } = req.params;
    try {
        const trip = await Trip.findOne({ hash: hash });
        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
                data: null
            });
        }
        if (trip.members.includes(req.user.id)) {
            return res.status(400).json({
                message: 'User already in trip',
                data: null
            });
        }
        trip.members.push(req.user.id);
        await trip.save();
        return res.status(200).json({
            message: 'User added to trip successfully'
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

exports.getTrip = async (req, res) => {
    const { id } = req.params;
    try {
        const trip = await Trip.findById(id).populate('city').populate('package').populate('hotel.hotel').populate('planning.place');
        if (!trip) {
            return res.status(404).json({
                message: 'Trip not found',
                data: null
            });
        }
/**
 * myEvents is an array of objects
 * each object has a title, description, start and duration
 * start is a date object
 * duration: [number, 'days' | 'hours' | 'minutes']
 */
        //  to add calendar-link
        if (!trip.members.includes(req.user.id)) {
            return res.status(400).json({
                message: 'User not in trip',
                data: null
            });
        }
        return res.status(200).json({
            message: 'Trip found',
            data: trip
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

// to add trip modification


exports.createReview = async (req, res) => {
    const { id, rating, comment } = req.body;
    try {
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({
                message: 'Hotel not found',
                data: null
            });
        }
        const review = await Review.create({
            rating: rating,
            comment: comment,
            hotel: id,
            user: req.user.id
        });
        return res.status(200).json({
            message: 'Review created successfully',
            data: review
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}
