const express = require('express');
const nodemailer = require('nodemailer')
const router = express.Router();

// models
const Player_stats = require('../models/player_stats');
const Results = require('../models/results');
const Blog = require('../models/blogs');
const Matches = require('../models/matches');
const Bookings = require('../models/book');
const Contact = require('../models/contact');
const HomeDetails = require('../models/home-details')



/**
 * GET /
 * Index page
*/

router.get('/', async (req, res) => {

    const locals = {
        title: "Osasuna FC",
        description: "The home of legends"
      };

      let perPage = 3;
      let page = req.query.page || 1;
  
      const results = await Results.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      // Count is deprecated - please use countDocuments
      // const count = await Post.count();
      const count = await Results.countDocuments({});
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);

      const Blogs = await Blog.find().sort({createdAt: 1}).limit(1);
      const bookings = await Bookings.find();
      const homeDetails = await HomeDetails.find();
      const games = await Matches.find().sort({createdAt: 1}).limit(1);
      const player_stats = await Player_stats.find();
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('index',{ 
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers,
    locals,
    games,
    Blogs,
    homeDetails,
    player_stats,
    bookings,
    current: page,
    nextPage: hasNextPage ? nextPage : null,
    currentRoute: '/',
    results})
})

/**
 * GET /
 * about page
*/

router.get('/about', async(req, res) => {

  const locals = {
      title: "About",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('about',{ locals,
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})

/**
 * GET /
 * about page
*/

router.get('/gallery', async (req, res) => {

  const locals = {
      title: "Gallery",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('gallery',{ locals,
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})

/**
 * GET /
 * fixtures page
*/

router.get('/fixtures', async (req, res) => {

  const locals = {
      title: "Fixtures",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const games = await Matches.find().sort({createdAt: 1}).limit(2);
  const results = await Results.find();
  res.render('fixtures',{ locals,results,games,
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})


/**
 * GET /
 * contact page
*/

router.get('/contact', async (req, res) => {

  const locals = {
      title: "Contact",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('contact',{ locals, GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})
/**
 * POST /
 * contact page
*/
router.post('/contact', async (req, res) => {
  try {
      // Check if all fields are not empty
      if (!req.body.fullname || !req.body.email || !req.body.enquire) {
          // If any field is empty, redirect back to the contact page with an error message
          return res.status(400).redirect('/contact?error=All fields are required');
      }

      // If all fields are not empty, create a new Contact document
      const contactData = new Contact({
          Fullname: req.body.fullname,
          Email: req.body.email,
          Enquire: req.body.enquire
      });

      await Contact.create(contactData);
      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});


/**
 * GET /
 * book a match page
*/

router.get('/book', async (req, res) => {

  const locals = {
      title: "Book match",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('book',{ locals, GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})

/**
 * POST /
 * book a match page
*/


router.post('/book', async (req, res) => {
  try {
    const newBooking = new Bookings({
      FirstName: req.body.firstname,
      LastName: req.body.lastname,
      FootballClub: req.body.footballclub,
      PhoneNumber: req.body.phonenumber,
      TeamDetails: req.body.teamdetails,
      Date: req.body.date,
      Time: req.body.time,
      EmailAddress: req.body.email
    });

    await Bookings.create(newBooking);

    // Redirect the user before sending the email
    res.redirect('/');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      // host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection:false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSKEY
      },
      tls:{
        rejectUnauthorized: true,
      }
    });

    const emailOptions = {
      from: {
        name: 'Cliffe Ibande',
        address: process.env.USER,
      },
      to:'thestartupdeveloper0@gmail.com',
      subject: `${req.body.footballclub} booked a match`,
      text: `Match booked on ${req.body.date} at ${req.body.time}`,
      html: `Match booked on ${req.body.date} at ${req.body.time}`
    };

    // Send the email
    await transporter.sendMail(emailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
});


/**
 * GET /
 * player-details page
*/


router.get('/player-details', async(req, res) => {

  const locals = {
      title: "player-details",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('player-details',{ locals,
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})


// player stats



// Define an array of player names
const playersName = async () => {
  try {
    const players = await Player_stats.find({}, 'Name'); // Only select the 'Name' field
    const playerNames = players.map(player => player.Name); // Extract the names from the result
    return playerNames;
  } catch (error) {

    console.error(error);
    throw new Error('Error fetching player names');
  }
};

// Retrieve player names asynchronously
const fetchPlayerNames = async () => {
  try {
    return await playersName();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Asynchronous function to create routes dynamically
const createRoutes = async () => {
  try {
    const names = await fetchPlayerNames(); // Retrieve player names

    // Iterate over the player names array to dynamically create routes
    names.forEach(playerName => {
      router.get(`/${playerName}`, async (req, res) => {
        try {
          const locals = {
            title: "player-details",
            description: "The home of legends"
          };

          const info = await Player_stats.findOne({ Name: playerName });
          const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
          const Defenders = await Player_stats.find({Position:"Defender"})
          const Midfilders = await Player_stats.find({Position:"Midfilder"})
          const Strikers= await Player_stats.find({Position:"Striker"})
          if (!info) {
            // If player with given name is not found, return a 404 error
            return res.status(404).send('Player not found');
          }

          const imgPath = `../img/${info.Name}.jpg`;

          // Render a template (e.g., player-details.ejs) with the player data
          res.render('player-details', { locals, info, imgPath,GoalKeeper,Defenders,Strikers,Midfilders });
        } catch (error) {
          // Handle errors, e.g., database errors
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// Call the function to create routes dynamically
createRoutes();


/**
 * GET /
 * squad page
*/

router.get('/squad',async (req, res) => {

  const locals = {
      title: "Squad",
      description: "The home of legends"
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
  res.render('squad',{ locals,
    GoalKeeper,
    Defenders,
    Midfilders,
    Strikers })
})

module.exports = router;