import React, { useState, useEffect } from "react";
import { assets, cityList } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState("");

  const { pickupDate, setpickupDate, returnDate, setreturnDate, navigate } =
    useAppContext();

  // Reset return date if it's before pickup date
  useEffect(() => {
    if (
      pickupDate &&
      returnDate &&
      new Date(returnDate) <= new Date(pickupDate)
    ) {
      setreturnDate("");
    }
  }, [pickupDate, returnDate, setreturnDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="h-screen flex flex-col items-center justify-center gap-14
     bg-light text-center"
    >
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-semibold"
      >
        Luxury cars on Rent
      </motion.h1>
      <motion.form
        initial={{ scaley: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center
      justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 
      bg-blue-100 shadow-[0px_8px_20px_rgba(0,0,0,0.1)]"
      >
        <div
          className="flex flex-col md:flex-row items-start md:items-center
        gap-10 min-md:ml-8 "
        >
          <div className="flex flex-col items-start gap-2">
            <select
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            >
              <option value="">Pickup Location</option>
              {cityList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="px-1 text-sm text-gray-500">
              {pickupLocation ? pickupLocation : "Please select location"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="pickup-date">Pick-up Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setpickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              min={new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setreturnDate(e.target.value)}
              type="date"
              id="return-date"
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="text-sm text-gray-500"
              required
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-1 px-9 py-3 
          max-sm:mt-4 bg-blue-500 hover:bg-blue-dull text-white rounded-full"
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="brightness-300"
          />
          Search
        </motion.button>
      </motion.form>
      <motion.img
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        src={assets.aston}
        alt="car"
        className="max-h-110"
      />
    </motion.div>
  );
};

export default Hero;
