const { Router } = require('express');
const RoomModel = require('../Models/room.model');
const roomRouter = Router();

// Route to create a new room
roomRouter.post('/add-room', async (req, res) => {
    const { floorNumber, roomType, image, title } = req.body;

    try {
        const newRoom = new RoomModel({
            floorNumber,
            roomType,
            image,
            title,
            children: [] // Initialize with an empty array of children
        });
        await newRoom.save();
        res.status(201).json({ msg: `Room Successfully Created in ${floorNumber}th floor`, newRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = { roomRouter };