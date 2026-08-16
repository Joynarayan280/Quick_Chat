import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedImg) {
    await updateProfile({
      fullName: name,
      bio,
    });

    navigate("/");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);

  reader.onload = async () => {
    const base64Image = reader.result;

    await updateProfile({
      profilePic: base64Image,
      fullName: name,
      bio,
    });

    navigate("/");
  };
};
  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-xl bg-gray-900/40 text-gray-300 
                      border border-gray-600 flex items-center justify-between 
                      max-sm:flex-col-reverse rounded-lg p-4">

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg font-semibold">Profile details</h3>

          {/* Upload Image */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />

            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)}
              alt="profile"
              className={`w-12 h-12 object-cover ${selectedImg ? "rounded-full" : ""}`}
            />

            Upload profile image
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio */}
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white 
                       p-2 rounded-full text-lg cursor-pointer"
          >
            Save
          </button>
        </form>

        {/* Side Image */}
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10"
          src={assets.logo_icon}
          alt="logo"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
