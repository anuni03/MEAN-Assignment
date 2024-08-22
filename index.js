const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 8080;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://meanassign:Mean%40123@cluster0.av0wp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => { console.log("Connected successfully to MongoDB"); })
  .catch((e) => { console.log(e); });

const dataSchema = new mongoose.Schema({
  Name: String,
  Age: Number,
  Gender: String,
  Mobile_number: Number
});
const UserModel = mongoose.model('users', dataSchema);

// Endpoint to add a new user
app.post('/', async (req, res) => {
  const { Name, Age, Gender, Mobile_number } = req.body;
  const newUser = new UserModel({ Name, Age, Gender, Mobile_number });
  await newUser.save();
  const allData = await UserModel.find({});
  res.send(allData);
});

// Endpoint to fetch all users
app.get('/users', async (req, res) => {
  try {
    const allUsers = await UserModel.find({});
    res.json(allUsers);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params; 
  const updatedData = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser); 
  } catch (error) {
    res.status(500).send('Error updating user');
  }
});

app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).send('User not found');
      }
  
      res.send('User deleted successfully');
    } catch (error) {
      res.status(500).send('Error deleting user');
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
