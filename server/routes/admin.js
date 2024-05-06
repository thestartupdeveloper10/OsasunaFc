const express = require('express');
const admin_user = require('../models/admin-user')
const Blog = require('../models/blogs');
const Matches = require('../models/matches');
const Results = require('../models/results');
const Bookings = require('../models/book');
const Contact = require('../models/contact');
const Player_stats = require('../models/player_stats');
const HomeDetails = require('../models/home-details')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const router = express.Router();
const fs = require('fs');
const path = require('path');

const adminLayout = '../views/layouts/admin';
const normalLayout = '../views/layouts/main';
const jwtSecret = process.env.JWTSECRET;


/**
 * GET /
 * Admin page
*/

router.get('/admin', async (req,res) => {
    try {
      const locals = {
          title: "Admin",
          description: "The home of legends"
        };
        const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
        const Defenders = await Player_stats.find({Position:"Defender"})
        const Midfilders = await Player_stats.find({Position:"Midfilder"})
        const Strikers= await Player_stats.find({Position:"Striker"})
      res.render('admin/index',{ 
          locals,
          GoalKeeper,
          Defenders,
          Midfilders,
          Strikers,
          layout: normalLayout
      })
    } catch (error) {
      
    }
  })


/**
 * POST /
 * Admin - Check Login
*/

router.post('/admin', async (req, res) =>{
  try {
    const { username, password } = req.body
    const user = await admin_user.findOne({ username })

    if(!user){
      return res.status(400).json({ message: 'Invalid username or password'})
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password)
    if(!isValidPassword){
      return res.status(400).json({ message: 'Invalid username or password'})
    }else{
      const token = jwt.sign({ UserId: user._id }, jwtSecret) 
      res.cookie('token', token, { httpOnly: true})
      res.redirect('/home')
    }

  } catch (error) {
    console.log(error)
  }

})


/**
 * 
 * Check Login
*/

const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    res.redirect('/admin');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

/**
 * GET /
 *home  page
*/
  router.get('/home',authMiddleware, async (req,res) => {
    try {
      const locals = {
          title: "Admin-Home",
          description: "The home of legends"
        };
        const data = await Blog.find();
        const contact_info = await Contact.find();
        const games = await Matches.find();
        const stats = await Player_stats.find();
        const results = await Results.find();
        const bookings = await Bookings.find();
        const homeDetails = await HomeDetails.find();
        const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
        const Defenders = await Player_stats.find({Position:"Defender"})
        const Midfilders = await Player_stats.find({Position:"Midfilder"})
        const Strikers= await Player_stats.find({Position:"Striker"})
        res.render('admin/home', {
          locals,
          contact_info,
          GoalKeeper,
          Defenders,
          Midfilders,
          Strikers,
          data,
          homeDetails,
          stats,
          games,
          results,
          bookings,
          layout: adminLayout
        });
    } catch (error) {
      
    }
  })


  /**
 * GET /
 *home  page
*/
router.get('/home/matches',authMiddleware,async(req,res) => {
  try {
    const locals = {
        title: "Add-Match",
        description: "The home of legends"
      };
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('admin/matches',{ 
        locals,
        GoalKeeper,
        Defenders,
        Midfilders,
        Strikers,
        layout: adminLayout
    })
  } catch (error) {
    
  }
})

 /**
 * GET /
 *blog  page
*/
router.get('/home/blogs',authMiddleware,async(req,res) => {
  try {
    const locals = {
        title: "Add-blog",
        description: "The home of legends"
      };
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('admin/blogs',{ 
        locals,
        GoalKeeper,
        Defenders,
        Midfilders,
        Strikers,
        layout: adminLayout
    })
  } catch (error) {
    
  }
})

/**
 * GET /
 *results  page
*/
router.get('/home/results',authMiddleware,async (req,res) => {
  try {
    const locals = {
        title: "Add-results",
        description: "The home of legends"
      };
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('admin/results',{ 
        locals,
        GoalKeeper,
        Defenders,
        Midfilders,
        Strikers,
        layout: adminLayout
    })
  } catch (error) {
    
  }
})


/**
 * GET /
 *results  page
*/
router.get('/home/home-details',authMiddleware,async(req,res) => {
  try {
    const locals = {
        title: "Add-details",
        description: "The home of legends"
      };
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('admin/home-details',{ 
        locals,
        GoalKeeper,
        Defenders,
        Midfilders,
        Strikers,
        layout: adminLayout
    })
  } catch (error) {
    
  }
})


// initalize multer
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/img/home_images/')
  },
  filename:(req,file,cb)=>{
    //console.log(file)
    cb(null,file.originalname)
  }
})

const upload = multer({storage:storage})

router.post('/home/home-details',upload.single('image'),authMiddleware,async (req,res)=>{

  try {
    const homeData = new HomeDetails({
     title: req.body.title,
     brief: req.body.brief,
     image: req.file.filename
    })
     
    await HomeDetails.create(homeData)
    res.redirect('/home')
 
   } catch (error) {
     console.log(error);
   }

})
// delete contact
router.delete('/home/delete-contact-details/:id',authMiddleware, async (req, res) => {

  try {
    await Contact.findByIdAndDelete( { _id: req.params.id } );
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }

});

// delete delete home details

router.delete('/home/delete-home-details/:id', authMiddleware, async (req, res) => {
  try {
    // Find the home detail by ID
    const homeDetail = await HomeDetails.findById(req.params.id);

    // If the home detail doesn't exist, return a 404 Not Found error
    if (!homeDetail) {
      return res.status(404).send('Home detail not found');
    }

    // Delete associated image
    fs.unlinkSync(`public/img/home_images/${homeDetail.image}`);

    // Delete the home detail from the database
    await HomeDetails.findByIdAndDelete(req.params.id);

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
/**
 * GET /
 *Edit home details  page
*/
router.get('/home/edit-home-details/:id', authMiddleware, async (req, res) => {
  try {
 
    const locals = {
      title: "Edit blog",
      description: "The home of legends",
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const detail = await HomeDetails.findOne({ _id: req.params.id });
 
    res.render('admin/edit_home_details', {
      locals,
      GoalKeeper,
      Defenders,
      Midfilders,
      Strikers,
      detail,
      layout: adminLayout
    })
 
  } catch (error) {
    console.log(error);
  }
 
 });

/**
 * PUT /
 * Update home details
 */
router.put('/home/update-home-details/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    // Find the home detail by ID
    const homeDetail = await HomeDetails.findById(req.params.id);

    // If the home detail doesn't exist, return a 404 Not Found error
    if (!homeDetail) {
      return res.status(404).send('Home detail not found');
    }

    // Delete the old image if a new image is uploaded
    if (req.file) {
      fs.unlinkSync(`public/img/home_images/${homeDetail.image}`);
      homeDetail.image = req.file.filename;
    }

    // Update home detail fields if provided in the request body
    if (req.body.title) {
      homeDetail.title = req.body.title;
    }
    if (req.body.brief) {
      homeDetail.brief = req.body.brief;
    }

    // Save the updated home detail
    await homeDetail.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



/**
 * GET /
 *Player stats  page
*/
router.get('/home/player-stats',authMiddleware,async (req,res) => {
  try {
    const locals = {
        title: "Player-Stats",
        description: "The home of legends"
      };
      const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
      const Defenders = await Player_stats.find({Position:"Defender"})
      const Midfilders = await Player_stats.find({Position:"Midfilder"})
      const Strikers= await Player_stats.find({Position:"Striker"})
    res.render('admin/player-stats',{ 
        locals,
        GoalKeeper,
        Defenders,
        Midfilders,
        Strikers,
        layout: adminLayout
    })
  } catch (error) {
    
  }
})

/**
 * GET /
 * signup page
*/

// router.get('/register',(req,res) => {
//   try {
//     const locals = {
//         title: "signup",
//         description: "The home of legends"
//       };

//     res.render('admin/register',{ 
//         locals,
//         layout: normalLayout
//     })
//   } catch (error) {
    
//   }
// })

/**
 * POST /
 * Admin - Register
*/

// router.post('/register', async (req, res) =>{
//     try {
//       const { username, password } = req.body
//       const hashedPassword = await bcrypt.hash(password, 10)
//         try {
         
//         const user = await  admin_user.create({
//           username,
//           password: hashedPassword
//         })
//         // res.status(201).json({message: 'User created successfully'})
//         res.redirect('/admin')
//         } catch (error) {
//           if(error.code === 11000){
//             res.status(400).json({message: 'Username already exists'})
//           }
//           res.status(500).json({ message: 'Internal server error'})
//         }
//     } catch (error) {
//         console.log(error)
//     }
    
// })

// initalize multer
const store = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/img/blog_images/')
  },
  filename:(req,file,cb)=>{
    //console.log(file)
    cb(null,file.originalname)
  }
})

const add = multer({storage:store})

// add new blog
router.post('/home/add-post', authMiddleware, add.array('images',2), async (req, res) => {
  try {
    const images = req.files.map(file => file.filename);

    const newPost = new Blog({
      title: req.body.title,
      body: req.body.body,
      images,
    });

    await Blog.create(newPost);
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// delete blog
router.delete('/home/delete-post/:id', authMiddleware, async (req, res) => {
  try {
    // Find the blog post by ID
    const post = await Blog.findById(req.params.id);

    // If the blog post doesn't exist, return a 404 Not Found error
    if (!post) {
      return res.status(404).send('Blog post not found');
    }

    // Delete associated images
    post.images.forEach(image => {
      fs.unlinkSync(`public/img/blog_images/${image}`);
    });

    // Delete the blog post from the database
    await Blog.findByIdAndDelete(req.params.id);

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// * GET /
// * Admin - Edit Post
// */
router.get('/home/edit-blog/:id', authMiddleware, async (req, res) => {
  try {
 
    const locals = {
      title: "Edit blog",
      description: "The home of legends",
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const post = await Blog.findOne({ _id: req.params.id });
 
    res.render('admin/edit-blog', {
      locals,
      GoalKeeper,
      Defenders,
      Midfilders,
      Strikers,
      post,
      layout: adminLayout
    })
 
  } catch (error) {
    console.log(error);
  }
 
 });
// update blog

 router.put('/home/edit-post/:id', authMiddleware, add.array('images', 2), async (req, res) => {
  try {
    // Find the blog post by ID
    const post = await Blog.findById(req.params.id);

    // If the blog post doesn't exist, return a 404 Not Found error
    if (!post) {
      return res.status(404).send('Blog post not found');
    }

    // Handle file uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => file.filename);
    }

    // Delete existing images associated with the blog post
post.images.forEach(image => {
  const imagePath = `public/img/blog_images/${image}`;
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  } else {
    console.warn(`File ${imagePath} does not exist.`);
  }
});


    // Update the title and body of the blog post
    post.title = req.body.title;
    post.body = req.body.body;

    // Update images of the blog post
    if (newImages.length > 0) {
      post.images = newImages;
    }

    // Save the updated blog post
    await post.save();

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// add new match

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.post('/home/add-match', authMiddleware, async (req, res) => {
  try {
      const newMatch = new Matches({
          Hometeam: capitalizeFirstLetter(req.body.hometeam),
          Awayteam: capitalizeFirstLetter(req.body.awayteam),
          Matchtype: capitalizeFirstLetter(req.body.matchtype),
          Matchdate: req.body.matchdate,
          Matchtime: req.body.matchtime,
          Matchvenue: capitalizeFirstLetter(req.body.matchvenue)
      });

      await Matches.create(newMatch);
      res.redirect('/home');

  } catch (error) {
      console.log(error);
  }
});


// * GET /
// * Admin - Edit Post
// */
router.get('/home/edit-match/:id', authMiddleware, async (req, res) => {
  try {
 
    const locals = {
      title: "Edit Match",
      description: "The home of legends",
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const games = await Matches.findOne({ _id: req.params.id });
 
    res.render('admin/edit_match', {
      locals,
      GoalKeeper,
      Defenders,
      Midfilders,
      Strikers,
      games,
      layout: adminLayout
    })
 
  } catch (error) {
    console.log(error);
  }
 
 });

/**
 * PUT /
 * Admin - Edit match
*/
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

router.put('/home/edit-match/:id', authMiddleware, async (req, res) => {
  try {
      await Matches.findByIdAndUpdate(req.params.id, {
          Hometeam: capitalizeFirstLetter(req.body.hometeam),
          Awayteam: capitalizeFirstLetter(req.body.awayteam),
          Matchtype: capitalizeFirstLetter(req.body.matchtype),
          Matchdate: req.body.matchdate,
          Matchtime: req.body.matchtime,
          Matchvenue: capitalizeFirstLetter(req.body.matchvenue)
      });

      res.redirect(`/home/edit-match/${req.params.id}`);

  } catch (error) {
      console.log(error);
  }
});


// delete match

router.delete('/home/delete-match/:id',authMiddleware, async (req, res) => {

  try {
    await Matches.findByIdAndDelete( { _id: req.params.id } );
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }

});

// delete Booking

router.delete('/home/delete-book/:id',authMiddleware, async (req, res) => {

  try {
    await Bookings.findByIdAndDelete( { _id: req.params.id } );
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }

});

// add new results

router.post('/home/add-result',authMiddleware, async(req,res) => {

  try {
   const newResult = new Results({
    Hometeam: req.body.hometeam,
    HometeamScore: req.body.hometeamscore,
    Awayteam: req.body.awayteam,
    AwayteamScore: req.body.awayteamscore
   })
    
   await Results.create(newResult)
   res.redirect('/home')

  } catch (error) {
    console.log(error);
  }
})


// * GET /
// * Admin - Edit result
// */
router.get('/home/edit-result/:id', authMiddleware, async (req, res) => {
  try {
 
    const locals = {
      title: "Edit blog",
      description: "The home of legends",
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const results = await Results.findOne({ _id: req.params.id });
 
    res.render('admin/edit_results', {
      locals,
      GoalKeeper,
      Defenders,
      Midfilders,
      Strikers,
      results,
      layout: adminLayout
    })
 
  } catch (error) {
    console.log(error);
  }
 
 });

/**
 * PUT /
 * Admin - Edit Post
*/
router.put('/home/edit-result/:id', authMiddleware, async (req, res) => {
  try {

    await Results.findByIdAndUpdate(req.params.id, {
      Hometeam: req.body.hometeam,
      HometeamScore: req.body.hometeamscore,
      Awayteam: req.body.awayteam,
      AwayteamScore: req.body.awayteamscore
    });

    res.redirect(`/home/edit-result/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});

// delete result

router.delete('/home/delete-result/:id',authMiddleware, async (req, res) => {

  try {
    await Results.findByIdAndDelete( { _id: req.params.id } );
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }

});

// add new player
// initalize multer
const data = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/img/player_images/')
  },
  filename:(req,file,cb)=>{
    //console.log(file)
    cb(null,file.originalname)
  }
})

const img_upload = multer({storage:data})
router.post('/home/player-stats',img_upload.single('image'),authMiddleware, async(req,res) => {

  try {
   const newStats = new Player_stats({
    Name: req.body.playername,
    Position: req.body.position,
    Appearance: req.body.appearance,
    Jersey: req.body.jersey,
    Goals: req.body.goals,
    Assist: req.body.assist,
    image: req.file.filename
   })
    
   await Player_stats.create(newStats)
   res.redirect('/home')

  } catch (error) {
    console.log(error);
  }
})


// * GET /
// * Admin - player starts
// */
router.get('/home/edit-stat/:id', authMiddleware, async (req, res) => {
  try {
 
    const locals = {
      title: "Edit Stat",
      description: "The home of legends",
    };
    const GoalKeeper = await Player_stats.find({Position:"GoalKeeper"})
    const Defenders = await Player_stats.find({Position:"Defender"})
    const Midfilders = await Player_stats.find({Position:"Midfilder"})
    const Strikers= await Player_stats.find({Position:"Striker"})
    const stats = await Player_stats.findOne({ _id: req.params.id });
 
    res.render('admin/edit_player_stat', {
      locals,
      GoalKeeper,
      Defenders,
      Midfilders,
      Strikers,
      stats,
      layout: adminLayout
    })
 
  } catch (error) {
    console.log(error);
  }
 
 });

/**
 * PUT /
 * Admin - player statistics
 */
router.put('/home/edit-stat/:id', authMiddleware, img_upload.single('image'), async (req, res) => {
  try {
    // Get the filename of the uploaded image, if any
    const imageFilename = req.file ? req.file.filename : undefined;

    // Construct the update object based on the provided data
    const updateObject = {
      Name: req.body.playername,
      Position: req.body.position,
      Appearance: req.body.appearance,
      Jersey: req.body.jersey,
      Goals: req.body.goals,
      Assist: req.body.assist,
    };

    // If an image was uploaded, add it to the update object
    if (imageFilename) {
      updateObject.image = imageFilename;
    }

    // Update the player statistics
    await Player_stats.findByIdAndUpdate(req.params.id, updateObject, { new: true });

    // Redirect to the edit page for the updated player
    res.redirect(`/home/edit-stat/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
});



// delete player_stats

router.delete('/home/delete-stat/:id',authMiddleware, async (req, res) => {

  try {
    await Player_stats.findByIdAndDelete( { _id: req.params.id } );
    res.redirect('/home');
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/');
});

module.exports =router;