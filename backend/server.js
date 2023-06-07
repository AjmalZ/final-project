// Import required modules
import express from "express"; // Importing the Express module
import cors from "cors"; // Importing the CORS module
import mongoose from "mongoose"; // Importing the Mongoose module
import crypto from "crypto"; // Importing the Crypto module
import bcrypt from "bcrypt"; // Importing the Bcrypt module

// Set the MongoDB URL
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-kanban"; // Set the MongoDB URL
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the port the app will run on
const port = process.env.PORT || 8080;

// Create an Express app
const app = express();

// Add middlewares to enable CORS and JSON body parsing
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Define a route for the root URL ("/")
app.get("/", (req, res) => {
  res.send("Hello User!"); // Send a response with the message "Hello User!"
});

// Define the User schema for the MongoDB collection

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex") // Generate a random access token using the Crypto module
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
});

// Create a User model based on the User schema
const User = mongoose.model("User", UserSchema);

// Define the registration route ("/register")
app.post("/register", async (req, res) => {
  const { username, password } = req.body; // Extract the username and password from the request body

  try {
    const salt = bcrypt.genSaltSync(); // Generate a salt for password hashing using the Bcrypt module
    const newUser = await new User({
      username: username,
      password: bcrypt.hashSync(password, salt) // Hash the password using the generated salt
    }).save(); // Create a new User instance and save it to the database

    res.status(201).json({
      success: true,
      response: {
        username: newUser.username,
        id: newUser._id,
        accessToken: newUser.accessToken
      }
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e
    });
  }
});

// Define the login route ("/login")
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // Extract the username and password from the request body

  try {
    const user = await User.findOne({ username: username }); // Find a user with the provided username in the database

    if (user && bcrypt.compareSync(password, user.password)) {
      // Check if the user exists and the provided password matches the hashed password in the database
      res.status(200).json({
        success: true,
        response: {
          username: user.username,
          id: user._id,
          accessToken: user.accessToken
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials do not match"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

// Define the Task schema for the MongoDB collection
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  message: {
    type: String

  },
  category: {
    type: String,
    //required: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  user: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: Number,
  },
});

const CategorySchema = new mongoose.Schema({
  title: {
    type: String
  },
  user: {
    type: String,
    required: true
  },
});
// Create a Category model based on the Category schema
const Category = mongoose.model("Category", CategorySchema);


// Create a Task model based on the Task schema
const Task = mongoose.model("Task", TaskSchema);

// Middleware function to authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find a user with the provided access token in the database

    if (user) {
      next(); // Call the next middleware or route handler if the user exists
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
};

// Define the route for fetching tasks ("/tasks")
app.get("/tasks", authenticateUser);
app.get("/tasks", async (req, res) => {
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  const tasks = await Task.find({ user: user._id }); // Find all tasks associated with the user's ID

  res.status(200).json({ success: true, response: tasks });
});

// Define the route for creating a new task ("/tasks")
app.post("/tasks", authenticateUser);
app.post("/tasks", async (req, res) => {
  const { title, message, category, dueDate, priority } = req.body; // Extract the message from the request body
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  const task = await new Task({ category: category, title: title, message: message, dueDate: dueDate, priority: priority, user: user._id }).save(); // Create a new Task instance and save it to the database

  res.status(200).json({ success: true, response: task });
});

app.patch("/tasks/:taskId", authenticateUser);
app.patch("/tasks/:taskId", async (req, res) => {
  const { title, message, category, dueDate, priority } = req.body; // Extract the updated task details from the request body
  const { taskId } = req.params; // Extract the task ID from the request parameters
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
    const task = await Task.findOne({ _id: taskId, user: user._id }); // Find the task with the provided ID and associated with the user's ID

    if (task) {
      // Update only the fields that are provided in the request body
      if (title) task.title = title;
      if (message) task.message = message;
      if (category) task.category = category;
      if (dueDate) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      const updatedTask = await task.save(); // Save the updated task

      res.status(200).json({ success: true, response: updatedTask });
    } else {
      res.status(404).json({
        success: false,
        response: "Task not found"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

// Define the route for deleting a task ("/tasks/:taskId")
app.delete("/tasks/:taskId", authenticateUser);
app.delete("/tasks/:taskId", async (req, res) => {
  const { taskId } = req.params; // Extract the task ID from the request parameters
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
    const task = await Task.findOne({ _id: taskId, user: user._id }); // Find the task with the provided ID and associated with the user's ID

    if (task) {
      await task.remove(); // Remove the task from the database

      res.status(200).json({ success: true, response: "Task deleted successfully" });
    } else {
      res.status(404).json({ success: false, response: "Task not found" });
    }
  } catch (e) {
    res.status(500).json({ success: false, response: e });
  }
});

// Define the route for fetching category ("/category")
app.get("/category", authenticateUser);
app.get("/category", async (req, res) => {
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  const category = await Category.find({ user: user._id }); // Find all category associated with the user's ID

  res.status(200).json({ success: true, response: category });
});

// Define the route for creating a new category ("/category")
app.post("/category", authenticateUser);
app.post("/category", async (req, res) => {
  const { title } = req.body; // Extract the message from the request body
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
  const category = await new Category({ title: title, user: user._id }).save(); // Create a new category instance and save it to the database

  res.status(200).json({ success: true, response: category });
});

app.patch("/category/:categoryId", authenticateUser);
app.patch("/category/:categoryId", async (req, res) => {
  const { title } = req.body; // Extract the updated category details from the request body
  const { categoryId } = req.params; // Extract the category ID from the request parameters
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
    const category = await Category.findOne({ _id: categoryId, user: user._id }); // Find the category with the provided ID and associated with the user's ID

    if (category) {
      // Update only the fields that are provided in the request body
      if (title) category.title = title;

      const updatedCategory = await category.save(); // Save the updated cate

      res.status(200).json({ success: true, response: updatedCategory });
    } else {
      res.status(404).json({
        success: false,
        response: "Category not found"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

// Define the route for deleting a task ("/category/:categoryId")
app.delete("/category/:categoryId", authenticateUser);
app.delete("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params; // Extract the task ID from the request parameters
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
    const category = await Category.findOne({ _id: categoryId, user: user._id }); // Find the category with the provided ID and associated with the user's ID
    //const task = await Task.findOne({ _id: categoryId, user: user._id }); // Find the task with the provided ID and associated with the user's ID


    if (category) {
      await category.remove(); // Remove the category from the database
      const tasks = await Task.find({ user: user._id, category: category._id });
      tasks.map(task => task.remove());
      res.status(200).json({ success: true, response: "Category deleted successfully" });
    } else {
      res.status(404).json({ success: false, response: "Category not found" });
    }
  } catch (e) {
    res.status(500).json({ success: false, response: e });
  }
});
// Define the route for fetching user ("/user")
app.get("/user", authenticateUser);
app.get("/user", async (req, res) => {
  const accessToken = req.header("Authorization"); // Extract the access token from the request header
  const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token

  res.status(200).json({ success: true, response: user });
});


app.patch("/user/:userId", authenticateUser);
app.patch("/user/:userId", async (req, res) => {
  const { firstName, lastName, email } = req.body; // Extract the updated cate details from the request body
  const accessToken = req.header("Authorization"); // Extract the access token from the request header

  try {
    const user = await User.findOne({ accessToken: accessToken }); // Find the user associated with the access token
    if (user) {
      // Update only the fields that are provided in the request body
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;

      const updatedUser = await user.save(); // Save the updated cate

      res.status(200).json({ success: true, response: updatedUser });
    } else {
      res.status(404).json({
        success: false,
        response: "user not found"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
