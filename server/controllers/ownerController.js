import imagekit from "../config/imageKit.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from "fs";

export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you car list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // optimization through imagekit URL transformation
    var optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({owner: _id})
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const toggleCarAvailability = async (req, res) =>{
    try {
        const { _id } = req.user;
        const {carId} = req.body
        const car = await Car.findById({carId})

        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"unauthorized"})
        }

        car.isAvaliable = !car.isAvaliable
        await car.save()
        
        res.json({ success: true, message:"Availability Toggled" });
      } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
      }
}

export const deleteCar = async (req, res) =>{
    try {
        const { _id } = req.user;
        const {carId} = req.body
        const car = await Car.findById({carId})

        if(car.owner.toString() !== _id.toString()){
            return res.json({success:false, message:"unauthorized"})
        }

        car.owner = null
        car.isAvaliable = false
        await car.save()
        
        res.json({ success: true, message:" Car Removed" });
      } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
      }
}

export const getDashboardData = async (req, res) =>{
    try {
        const {_id, role} = req.user
        if(role !== 'owner'){
            res.json({success:false, message:"Unauthorized"})
        }

        const cars = await Car.json({owner:_id})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

