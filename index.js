const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

require('./Database/connection');
const User = require('./Modelformate/user');

app.post("/adduser", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    // If email does not exist, create the user
    let user = new User(req.body);
    let result = await user.save();
    res.send(result);
  } catch (error) {
    console.error('Error saving user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password, birthDate } = req.body;

    // Assuming User model has fields: email, password, birthDate
    const user = await User.findOne({ email, password, birthDate });

    if (user) {
      // User found, send success response
      res.send({ message: 'Login successful', user });
    } else {
      // User not found, send failure response
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/getusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Update user route
app.put("/updateuser/:id", async (req, res) => {
  const userId = req.params.id;
  const updatedFields = req.body; // Use the entire req.body for the update

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, { new: true });
    if (!updatedUser) {
      return res.status(404).send('User not found');
    }
    res.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});



app.delete("/deleteuser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send('User not found');
    }
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

