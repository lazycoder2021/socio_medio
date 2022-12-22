const express = require('express'); 
const router = express.Router(); 

const { register, login, logout, following, unfollows, feed, like, dislike, add, create, readposts, getcomments, findpost, allposts, viewprofile, viewuserprofile, updateprofile, readpost, updatepost, delpost, fetchusers } = require('../controllers/controllers'); 

router.post('/register', register); 
router.post('/login', login); 
router.get('/logout', logout); 

 
router.put('/following/:id', following); 
router.put('/unfollows/:id', unfollows);
router.get('/feed/:userId', feed);
router.put('/like/:id', like);
router.put('/dislike/:id', dislike);
router.put('/comment/:postId', add); 
router.get('/comment/:postId', getcomments);

router.get('/profile/:userId', viewprofile)
router.get('/userprofile/:profileId', viewuserprofile)
router.put('/profile/:userId', updateprofile)


router.post('/create', create); // modify path to include user id -- to be consistent
router.get('/read/:userId', readposts); 
router.get('/read', allposts); 
router.get('/findpost/:id', findpost)

router.get('/read/:userId/:postId', readpost)
router.put('/update/:userId/:postId', updatepost)
router.delete('/delete/:userId/:postId', delpost)


router.get('/fetch', fetchusers)


module.exports = router; 