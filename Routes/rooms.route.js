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

// Route to add a child to a room
roomRouter.post('/:roomId/children', async (req, res) => {
    const { title, subTitle, price, link, longitude, latitude } = req.body;
    const roomId = req.params.roomId;

    try {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if the child already exists in any other room
        const childExists = await RoomModel.exists({
            'children.title': title
        });

        if (childExists) {
            return res.status(400).json({ error: `Child already exists in a parent room which id is ${childExists._id}` });
        }

        // Create new child
        const newChild = { title, subTitle, price, link, latitude, longitude };
        room.children.push(newChild);
        await room.save();
        res.status(201).json({ msg: `Child added in ${room.roomType} room at ${room.floorNumber}th floor`, room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = { roomRouter };