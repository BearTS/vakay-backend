require('dotenv').config();
const mongoose = require("mongoose");
const {join} = require('path');
const cityModel = require(join(__dirname, "..", 'api', "models", "city.model"));
const hotelModel = require(join(__dirname, "..", 'api', "models", "hotel.model"));

const packageModel = require(join(__dirname, "..", 'api', "models", "package.model"));
const placeModel = require(join(__dirname, "..", 'api', "models", "place.model"));


(async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
}})();

const cities = [
    {
        name: "Mumbai",
        tag: "mumbai",
        state: "Maharashtra",
        country: "India",
        places: [],
        packages: [],
        image: "https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        hotels: []
    },
    {
        name: "Delhi",
        tag: "delhi",
        state: "Delhi",
        country: "India",
        places: [],
        packages: [],
        image: "https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        hotels: []
    },
    {
        name: "Bangalore",
        tag: "bangalore",
        state: "Karnataka",
        country: "India",
        places: [],
        packages: [],
        image: "https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        hotels: []
    }];

const hotels = [
    {
        name: "Hotel 1",
        description: "Hotel 1 description",
        location: "Hotel 1 location",
        city: null,
        contact: {
            phone: "1234567890",
            email: "hotel1@mail.com"
        },
        image: "https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        availableRooms:[
            {
                date: new Date(),
                price: 1000,
                available: 10
            },
            {
                date: new Date(2021, 10, 10),
                price: 1000,
                available: 13
            }
        ],
        bookedRooms: []
    },
    {
        name: "Hotel 2",
        description: "Hotel 2 description",
        location: "Hotel 2 location",
        city: null,
        contact: {
            phone: "1234567890",
            email: "hotel1@mail.com"
        },
        image: "https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
        availableRooms:[
            {
                date: new Date(),
                price: 1000,
                available: 10
            },
            {
                date: new Date(2021, 10, 10),
                price: 1000,
                available: 13
            }
        ],
        bookedRooms: []
    }
];


const places = [
    {
        name: "Place 1",
        description: "Place 1 description",
        location: "Place 1 location",
        city: null,
    },
    {
        name: "Place 2",
        description: "Place 2 description",
        location: "Place 2 location",
        city: null,
    }
]

const packages = [
    {
        name: "Package 1",
        description: "Package 1 description",
        price: 1000,
        city: null,
        hotels: [],
        places: [],
        image: 'https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80'
    },
    {
        name: "Package 2",
        description: "Package 2 description",
        price: 1000,
        city: null,
        hotels: [],
        places: [],
        image: 'https://images.unsplash.com/photo-1542732270-4a7a7b0b2d7d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVtYmlyYSUyMGJhY2tncm91bmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80'
    }
]



async function populate() {
    try {
        await cityModel.deleteMany({});
        await hotelModel.deleteMany({});
        await placeModel.deleteMany({});
        await packageModel.deleteMany({});
        const city1 = await cityModel.create(cities[0]);
        const city2 = await cityModel.create(cities[1]);
        const city3 = await cityModel.create(cities[2]);

        hotels[0].city = city1._id;
        hotels[1].city = city1._id;

        places[0].city = city1._id;
        places[1].city = city1._id;
        packages[0].city = city1._id;
        packages[1].city = city1._id;
        
        const hotel1 = await hotelModel.create(hotels[0]);
        const hotel2 = await hotelModel.create(hotels[1]);
        
        packages[0].hotels.push(hotel1._id);
        packages[0].hotels.push(hotel2._id);

        packages[1].hotels.push(hotel1._id);
        packages[1].hotels.push(hotel2._id);

        const place1 = await placeModel.create(places[0]);
        const place2 = await placeModel.create(places[1]);
        let myObj = {
            days: 2,
            palces: place1._id
        }
        packages[0].places.push(myObj);
        myObj = {
            days: 3,
            palces: place2._id
        }
        packages[0].places.push(myObj);
        const package1 = await packageModel.create(packages[0]);
        const package2 = await packageModel.create(packages[1]);

        city1.hotels.push(hotel1._id);
        city1.hotels.push(hotel2._id);
        city1.places.push(place1._id);
        city1.places.push(place2._id);
        city1.packages.push(package1._id);
        city1.packages.push(package2._id);
        console.log(city1)
        await city1.save();
        await city2.save();
        await city3.save();

        console.log("Data populated successfully");
    } catch (error) {
        console.log(error);
    }
}

populate();