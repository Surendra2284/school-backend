const express = require('express');
const multer = require('multer');
const Photo = require('../models/Photo');

const router = express.Router();
const upload = multer(); // Multer middleware to handle file uploads

// Add a new photo
const sharp = require('sharp');

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;

    // Resize and compress image using sharp
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) // Resize width to 800px (adjust as needed)
      .jpeg({ quality: 70 })  // Compress JPEG quality to 70%
      .toBuffer();

    const photo = new Photo({
      name,
      image: resizedImageBuffer,
      contentType: 'image/jpeg'
    });

    await photo.save();
    res.status(201).json({ message: 'Photo added successfully!', photo });
  } catch (error) {
    res.status(500).json({ message: 'Error adding photo', error });
  }
});


// Update a photo
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      image: req.file ? req.file.buffer : undefined,
      contentType: req.file ? req.file.mimetype : undefined
    };

    // Filter out undefined fields
    const updatedData = Object.keys(updates)
      .filter(key => updates[key] !== undefined)
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const updatedPhoto = await Photo.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedPhoto) {
      return res.status(404).json({ message: 'Photo not found!' });
    }

    res.status(200).json({ message: 'Photo updated successfully!', updatedPhoto });
  } catch (error) {
    res.status(500).json({ message: 'Error updating photo', error });
  }
});

// Delete a photo
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPhoto = await Photo.findByIdAndDelete(id);

    if (!deletedPhoto) {
      return res.status(404).json({ message: 'Photo not found!' });
    }

    res.status(200).json({ message: 'Photo deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error });
  }
});

// Get all photos
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find();

    const formattedPhotos = photos
      .filter(photo => photo.image && photo.image.length > 0)
      .map(photo => {
        const base64Image = Buffer.from(photo.image).toString('base64');
        const mimeType = photo.contentType || 'image/jpeg';

        return {
          _id: photo._id,
          name: photo.name,
          image: `data:${mimeType};base64,${base64Image}`
        };
      });

    res.json(formattedPhotos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching photos' });
  }
});

module.exports = router;
