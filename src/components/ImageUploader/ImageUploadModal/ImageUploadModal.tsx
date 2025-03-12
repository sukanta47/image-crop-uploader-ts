import { useRef, useState } from "react";
import "./ImageUploadModal.scss";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import ImageCropper from "../ImageCropper/ImageCropper";
import { getCroppedImg, blobToBase64 } from "../../../helpers/helper.ts";
import { Area } from "react-easy-crop";

interface ImageUploadProps {
  handleClose: () => void;
  openModal: boolean;
}
export interface ImageProperties {
  zoom: number;
  rotation: number;
  croppedAreaPixels: Area;
}

const ImageUploadModal = ({ handleClose, openModal }: ImageUploadProps) => {
  const [dragEnter, setDragEnter] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const uploadProfilePicInputRef = useRef<HTMLInputElement>(null);
  const [imageProperties, setImageProperties] = useState<ImageProperties>({
    zoom: 1,
    rotation: 0,
    croppedAreaPixels: {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    },
  });

  /* on dragging over the valid dropzone area */
  const handleDragOver = (event: React.MouseEvent) => {
    setDragEnter(true);
    event.preventDefault();
    event.stopPropagation();
  };

  /* on dragging out the valid dropzone area */
  const handleDragLeave = (event: React.DragEvent) => {
    setDragEnter(false);
    event.preventDefault();
    event.stopPropagation();
  };

  /* on drop of image onto the valid dropzone */
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    setDragEnter(false);
    validateAndUploadFile(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event?.target?.files[0];
    validateAndUploadFile(file);
  };
  const attachButtonHandler = () => {
    if (uploadProfilePicInputRef.current)
      uploadProfilePicInputRef.current.click();
    else console.error("uploadProfilePicInputRef is null");
  };

  const cancelUpload = () => {
    setError("");
    setSelectedImage(null);
  };

  const validateAndUploadFile = (file: File) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setError("Please upload a .jpeg/.jpg or .png file type");
        return;
      }
      if (file.size > maxSize) {
        setError("Image file size should be less than 5MB");
        return;
      }
      setError("");
      const reader: FileReader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { rotation, croppedAreaPixels } = imageProperties;
    if (!selectedImage) {
      setError("No image selected. Please upload an image.");
      return;
    }
    const croppedImage: Blob | null = await getCroppedImg(
      selectedImage,
      croppedAreaPixels,
      rotation
    );
    if (!croppedImage) {
      setError("Failed to crop the image. Please try again.");
      return;
    }
    const base64Image: string = await blobToBase64(croppedImage);
    localStorage.setItem("userProfilePic", base64Image);
    handleClose();
  };

  const handleChangeImage = () => {
    cancelUpload();
    if (uploadProfilePicInputRef.current)
      uploadProfilePicInputRef.current.click();
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="image-upload-modal"
    >
      <Box className="upload-pic-container modal-box">
        <div className="header-container">
          <div className="title-section">
            <h3 className="title-section-head">Upload Photo</h3>
            <p className="title-section-para">
              Upload a photo of yourself to personalize your account loki
            </p>
          </div>
          <Tooltip title="Close">
            <IconButton className="close-btn" onClick={handleClose}>
              <CancelRoundedIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="upload-section">
          {selectedImage ? (
            <ImageCropper
              uploadedImage={selectedImage}
              setImageProperties={setImageProperties}
            />
          ) : (
            <>
              <label
                htmlFor="fileInput"
                className={`upload-box ${dragEnter ? "drag-enter" : ""}`}
                onDragEnter={handleDragOver}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                  ref={uploadProfilePicInputRef}
                />
                {dragEnter
                  ? `Drop the file here`
                  : `Attach or Drag & Drop your photo here`}
              </label>
              <Typography variant="body2" className="upload-info">
                200 x 200 min / 5MB max
              </Typography>
            </>
          )}
          {error && <Typography className="error">{error}</Typography>}
        </div>

        <div className="upload-footer">
          {selectedImage === null ? (
            <>
              <Button
                onClick={handleClose}
                variant="outlined"
                className="btn-s"
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                className="btn-p"
                onClick={() => attachButtonHandler()}
              >
                Attach Photo
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleChangeImage}
                variant="outlined"
                className="btn-s"
              >
                Change Photo
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                className="btn-p"
              >
                Upload Photo
              </Button>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
};

ImageUploadModal.propTypes = {
  handleClose: PropTypes.func,
};

export default ImageUploadModal;
