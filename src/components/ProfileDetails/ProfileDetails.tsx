import React, { useEffect, useState } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Link } from "@mui/material";
import ImageUploadModal from "../ImageUploader/ImageUploadModal/ImageUploadModal";
import { profile } from "./ProfileData";

const ProfileDetails: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>();
  const [openImageUploadModal, setOpenImageUploadModal] = useState<boolean>(false);
  const [profileImageUpdated, setProfileImageUpdated] = useState<boolean>(false);

  useEffect(() => {
    const _userProfilePic = localStorage.getItem("userProfilePic");
    if (_userProfilePic) setProfileImage(_userProfilePic);
    else setProfileImage(profile.image);
  }, [profileImageUpdated]);

  const onEditClick = () => {
    setProfileImageUpdated(false);
    setOpenImageUploadModal(true);
  };
  const handleClose = () => {
    setProfileImageUpdated(true);
    setOpenImageUploadModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-5 min-h-screen gap-5 w-full">
      {/* ---------------Left Section---------------- */}
      <div className="md:w-1/2 bg-white p-5 shadow-lg rounded-lg flex flex-col items-center text-center">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 shadow-md"
        />
        <Link
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 cursor-pointer relative"
          style={{ bottom: "45px", left: "35px", color: "#8f1ca3" }}
          onClick={onEditClick}
        >
          <EditRoundedIcon
            fontSize="medium"
            sx={{ height: "25px", width: "26px" }}
          />
        </Link>
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p className="text-gray-500">{profile.proficiency}</p>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <ul className="flex flex-wrap justify-center gap-2 mt-2">
            {profile.skills.map((skill) => (
              <li
                key={skill}
                className="px-3 py-1 bg-purple-100 text-purple-600 rounded-md text-sm"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------------Right Section--------------- */}
      <div className="md:w-1/2 bg-white p-6 shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold">Education</h3>
        <ul className="mt-3 space-y-2">
          {profile.education.map((edu) => (
            <li key={edu.degree} className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm text-gray-600">
                {edu.institution} ({edu.year})
              </p>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6">Work Experience</h3>
        <ul className="mt-3 space-y-2">
          {profile.workExperience.map((work) => (
            <li key={work.role} className="border-l-4 border-violet-500 pl-4">
              <p className="font-medium">{work.role}</p>
              <p className="text-sm text-gray-600">
                {work.company} ({work.duration})
              </p>
            </li>
          ))}
        </ul>
      </div>
      {openImageUploadModal && (
        <ImageUploadModal
          openModal={openImageUploadModal}
          handleClose={() => handleClose()}
        />
      )}
    </div>
  );
};

export default ProfileDetails;
