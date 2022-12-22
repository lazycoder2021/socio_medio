const User = require('../model/User'); 
const Post = require('../model/Post'); 

// TASKS REMAINING -- UNFOLLOW, LIKE AND DISLIKE API CALLS FROM FRONT-END

// auth routes

const register = async (req, res) => {
    try {
        const user = new User(req.body); 

        if (!req.body.name || !req.body.password) {
            return res.status(200).json({ "msg": "name/password cannot be left empty" })
        }
        await user.save(); 
        res.status(200).json({"msg": "user created successfully", user})
    } catch (e) {
        console.log(e)
    }
}

const login = async (req, res) => {
    try {

        if (!req.body.name || !req.body.password) {
            return res.status(200).json({ "msg": "name/password cannot be left empty" })
        }

        const user = await User.findOne({ name: req.body.name });
        console.log(user)
        if (user) {
            if (user.password == req.body.password) {
                req.session.userId = user._id.toString();
                console.log(req.session.id)
                console.log(req.session.userId)

                res.status(200).json({ "msg": "login successful", user})
            } else {
                return res.status(403).json({ "msg": "login failed, passwords don't match" })
            }
        } else {
            return res.status(404).json({ "msg": "user does not exist"})
        }
        
    } catch (e) {
        console.log(e)
    }
}

const logout = async (req, res) => {
    try {
        await req.session.destroy(); 
        res.status(200).json({ "msg": "logout successful" }); 
    } catch (e) {
        console.log(e)
    }
}


// following and followers route





const following = async (req, res) => {
    try {
        console.log(req.body.followId)
        console.log(req.params.id)
        //const followId = req.body.followId;
        const userExists = await User.findOne({ _id: req.body.followId });
        console.log(userExists); 
        userExists.followers.push(req.params.id);
        await userExists.save();
        await userExists.following.map((m) => {
            console.log(m)
        }); 
        const selfRecordUpdate = await User.findOne({ _id: req.params.id });
        selfRecordUpdate.following.push(req.body.followId);
        await selfRecordUpdate.save()
        res.status(200).json({ "msg": "follow successful" })
    } catch (e) {
        console.log(e)
    }
}

const unfollows = async (req, res) => {
    try {
        console.log(req.params.id)
        //console.log(req.params.id)
        const unfollowId = req.body.unfollowId;
        console.log(unfollowId)
        const userExists = await User.findOne({ _id: req.params.id });
        console.log(userExists);
        const results = userExists.followers.filter((f) => {
            //console.log(f)
            return f!==unfollowId

        });
        console.log(results)
        userExists.followers = results;
        await userExists.save(); 

        

        const selfRecordUpdate = await User.findOne({ _id: req.params.id });
        selfRecordUpdate.following.filter((f) => {
            return f !== unfollowId; 
        });
        await selfRecordUpdate.save()

        


        res.status(200).json({ "msg": "unfollow successful" })
    } catch (e) {
        console.log(e)
    }
}

const like = async (req, res) => {
    try {
        console.log(req.body.postId)
        console.log(req.params.id)
        
        const postExists = await Post.findOne({ _id: req.body.postId });
        console.log(typeof (postExists.likes));
        console.log(postExists.likes + 1);
        const newLikes = postExists.likes + 1;
        postExists.likes = newLikes;
        await postExists.save();
       
        res.status(200).json({ "msg": "like successful" })
    } catch (e) {
        console.log(e)
    }
}

const dislike = async (req, res) => {
    try {
        console.log(req.body.postId)
        console.log(req.params.id)

        const postExists = await Post.findOne({ _id: req.body.postId });
        console.log(typeof (postExists.likes));
        console.log(postExists.likes - 1);
        const newLikes = postExists.likes - 1;
        postExists.likes = newLikes;
        await postExists.save();

        res.status(200).json({ "msg": "dislike successful" })
    } catch (e) {
        console.log(e)
    }
}




// posts CRUD routes 

const create = async (req, res) => {
    try {
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)

        

        
        const post = new Post(req.body);
        
        await post.save();
        res.status(200).json({"msg": "post created successfully", post})
    } catch (e) {
        console.log(e)
    }
}


const add = async (req, res) => {
    try {
        console.log(req.params.postId);
        console.log(req.body.comment)
        const updatePost = await Post.findById({ _id: req.params.postId });
        console.log(updatePost);
        updatePost.comments.push(req.body.comment);
        //console.log(updatepost.comments; 
        await updatePost.save();
        res.status(200).json({ "msg": "comment added successfully"})
    } catch (e) {
        console.log(e)
    }
}


const allposts = async (req, res) => {
    try {
        
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        const posts = await Post.find({  });
        res.status(200).json({ "msg": "posts fetched successfully", posts })
    } catch (e) {
        console.log(e)
    }
}

const readposts = async (req, res) => {
    try {
        console.log(req.params.userId)
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        const posts = await Post.find({ userId: req.params.userId }); 
        res.status(200).json({ "msg": "posts fetched successfully", posts })
    } catch (e) {
        console.log(e)
    }
}

const viewprofile = async (req, res) => {
    try {   
        const user = await User.find({_id: req.params.userId})
        res.status(200).json({ "msg": "profile fetched successfully", user})
    } catch (e) {
        console.log(e)
    }
}


const viewuserprofile = async (req, res) => {
    try {
        console.log(req.params.profileId)
        const user = await User.find({ _id: req.params.profileId })
        res.status(200).json({ "msg": "user profile fetched successfully", user})
    } catch (e) {
        console.log(e)
    }
}

const updateprofile = async (req, res) => {
    try {
        const updatedProfile = await User.findByIdAndUpdate({ _id: req.params.userId }, (req.body), { new: true });
        res.status(200).json({ "msg": "profile updated successfully", updatedProfile }); 
    } catch (e) {
        console.log(e)
    }
}

const readpost = async (req, res) => {
    try {
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        const posts = await Post.find({ userId: req.params.userId, _id: req.params.postId});
        res.status(200).json({ "msg": "posts fetched successfully", posts })
    } catch (e) {
        console.log(e)
    }
}

const findpost = async (req, res) => {
    try {
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        
        const posttobefound = await Post.findOne({ _id: req.params.id })
        console.log(posttobefound.title)
        res.status(200).json({ "msg": "post fetched successfully", posttobefound })
    } catch (e) {
        console.log(e)
    }
}

const updatepost = async (req, res) => {
    try {
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        const post = await Post.findByIdAndUpdate({ userId: req.params.userId, _id: req.params.postId }, (req.body), { new: true });
        res.status(200).json({ "msg": "post updated successfully", post })
    } catch (e) {
        console.log(e)
    }
}


const delpost = async (req, res) => {
    try {
        // should check whether user is logged in and then proceed >> front-end related code (to begin with, local storage can be used)
        const post = await Post.findByIdAndDelete({ userId: req.params.userId, _id: req.params.postId });
        res.status(200).json({ "msg": "post deleted successfully", post })
    } catch (e) {
        console.log(e)
    }
}

const fetchusers = async (req, res) => {
    try {
        const users = await User.find({}); 
        return res.status(200).json({ "msg": "users fetched successfully", users })
    } catch (e) {
        console.log(e)
    }
}



const feed = async (req, res) => {
    try {
        var following; 
        var followingPosts = []; 
        var newdocs;
         
        //console.log(req.params.userId)
        const user = await User.findOne({ _id: req.params.userId }); 
        //console.log(user.following);
        following = user.following.map((f) => {
            return (f)
        })
        //console.log((following))
        
        

         following.map(async (ff) => {
            newdocs = await Post.find({ userId: ff }).then(doc => {
                
                // PERFECTLY FETCHES THE USER FEED -- THAT IS POSTS BELONGING TO THE USERS THE USER IS FOLLOWING
                console.log(doc) // SHOULD FIGURE OUT HOW TO SAVE THE POST DETAILS AND SEND IT OVER TO THE FRONTEND AS A VARIABLE
                return doc;
                
                //res.status(200).json({ "msg": "followers list" })
            })
                .catch(err => {
                    console.log(err);
                    //return res.status(500).send("something went wrong");
                });
                        
        })

        //console.log(typeof(newdocs))

        
        
        
        //res.status(200).json({"msg": "feed"})


        
        //const users = await User.find({});

        return res.status(200).json({ "msg": "feed list", following, followingPosts })
    } catch (e) {
        console.log(e)
    }
}

const getcomments = async (req, res) => {
    try {
        
        const comments = await Post.findById({ _id: req.params.postId }); 
        const listofcomments = comments.comments; 
        res.status(200).json({ "msg": "comments fetched", listofcomments }); 
    } catch (e) {
        console.log(e)
    }
}





module.exports = {
    register, 
    login,
    logout, 
    following, 
    feed,
    unfollows,
    like,
    dislike,
    create, 
    readposts, 
    allposts,
    viewprofile,
    viewuserprofile,
    updateprofile,
    readpost, 
    findpost,
    updatepost,
    delpost, 
    fetchusers, 
    add, 
    getcomments
}