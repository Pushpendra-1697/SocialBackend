const { Router } = require('express');
const RoomModel = require('../Models/room.model');
const roomRouter = Router();


// Route for retrieving the all rooms with its type and floor filters
roomRouter.get('/get-rooms', async (req, res) => {
    const { floor, type } = req.query;

    try {
        if (floor && type) {
            const rooms = await RoomModel.find({ floorNumber: floor, roomType: { $regex: type, $options: "six" } });
            res.status(200).json(rooms);
        } else if (floor) {
            const rooms = await RoomModel.find({ floorNumber: floor });
            res.status(200).json(rooms);
        } else if (type) {
            const rooms = await RoomModel.find({ roomType: { $regex: type, $options: "six" } });
            res.status(200).json(rooms);
        } else {
            const rooms = await RoomModel.find();
            res.status(200).json(rooms);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for retrieving any particular room by id --> Used in dynamic routing when nevigate to single room
roomRouter.get('/:roomId', async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await RoomModel.findOne({ _id: roomId });
        res.status(200).json({ msg: `Successfully get Room which id is ${roomId}`, room });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

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
        res.status(201).json({ status: true, msg: `Room Successfully Created in ${floorNumber}th floor`, newRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to add a child to a room
roomRouter.post('/:roomId/children', async (req, res) => {
    const { title, subTitle, price, link, longitude, latitude } = req.body;
    const { roomId } = req.params;

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

// ************ Route for update the information of particular room ************
roomRouter.patch("/update/:roomId", async (req, res) => {
    const { roomId } = req.params;
    const payload = req.body;

    try {
        await RoomModel.findByIdAndUpdate({ _id: roomId }, payload);
        const updatedRoom = await RoomModel.findById(roomId);
        res.status(200).json({ msg: `Successfully Updated Room Details which id is ${roomId}`, room: updatedRoom });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// ************ Remove the room from list ****************
roomRouter.delete("/delete/:roomId", async (req, res) => {
    const { roomId } = req.params;

    try {
        const room = await RoomModel.findByIdAndDelete({ _id: roomId });
        return res.status(200).json({ msg: `Successfully Deleted the Room which id is ${roomId}`, room });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

module.exports = { roomRouter };