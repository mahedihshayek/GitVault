import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ReturnDocument } from "mongodb";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();
const uri = process.env.MONGODB_URI;
let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
    };
};

async function signup(req, res) {
    try {
        const { username, password, email } = req.body;
        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: [],
        };
        const result = await userCollection.insertOne(newUser);
        const token = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2h" }
        );
        res.json({ token,userId: result.insertedId });

    } catch (err) {
        console.error("Signup error : ", err.message);
        res.status(500).send("Server Error");
    }
};
async function login(req, res) {

    try {
        const { email, password } = req.body;
        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "2hr" }
        );
        res.json({ token, userId: user._id });

    } catch (err) {
        console.error("Error during login: ", err.message);
        res.status(500).send("Server error!");
    }
};

async function getAllUsers(req, res) {
    try {
        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        const users = await userCollection.find({}).toArray();
        res.json(users);

    } catch (err) {
        console.error("Error during fetching: ", err.message);
        res.status(500).send("Server error!");
    }
};

async function getUserProfile(req, res) {

    try {
        const currentID = req.params.id;
        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({
            _id: new ObjectId(currentID)
        });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.send(user);
    } catch (err) {
        console.error("Error during fetching: ", err.message);
        res.status(500).send("Server error!");
    }
};
async function updateUserProfile(req, res) {
    try {
        const currentID = req.params.id;
        const { email, password } = req.body;

        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        let updateFields = { email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await userCollection.findOneAndUpdate({
            _id: new ObjectId(currentID),
        },
            { $set: updateFields },
            { returnDocument: "after" }
        );
        if (!result) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.send(result);

    } catch (err) {
        console.error("Error during updating : ", err.message);
        res.status(500).send("Server error!");
    }
};
async function deleteUserProfile(req, res) {
    try {
        const currentID = req.params.id;
        await connectClient();
        const db = client.db("gitvault");
        const userCollection = db.collection("users");

        const result = await userCollection.deleteOne({
            _id: new ObjectId(currentID),
        });

        if (result.deleteCount == 0) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.json({ message: "User profile deleted!" });

    } catch (err) {
        console.error("Error during updating : ", err.message);
        res.status(500).send("Server error!");
    }
};

const userController = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};

export default userController;