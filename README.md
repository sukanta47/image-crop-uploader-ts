# Cropping & Uploading Profile Pictures in React with TypeScript and react-easy-crop
Profile picture uploads are an essential feature in modern web applications, enabling users to personalize their accounts on **social media platforms, professional networks, and corporate dashboards.** To enhance user experience, it's crucial to provide **intuitive image cropping, zooming, and rotation** before uploading.

In this tutorial, we’ll create a **React + TypeScript** component that allows users to **effortlessly select, crop, adjust, and upload** their profile pictures using **react-easy-crop**. 🚀

## 🛠 **Tech Stack**  
- **React**  
- **TypeScript**  
- **Material-UI**  
- **react-easy-crop**  
- **FileReader API**  
- **Canvas API**  

## 🎯 **Features**  

✅ Upload an image (**drag & drop or file selection**)  
✅ Crop, zoom, and rotate before uploading  
✅ Convert cropped image to **Blob** or **Base64**  
✅ Preview & save the cropped image  

Here’s the actual UI output of our application:  


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m6k6fniuz9xnql93rm5w.jpg)  

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/khumaxwo8546b3watmz0.jpg)

Our cropper module also supports **drag and drop**:  


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7j0hxtslzyccozzss4ny.jpg) 

---

## 📌 **GitHub Repositories**  
💻 **React + TypeScript**: [GitHub - image-crop-uploader-ts](https://github.com/sukanta47/image-crop-uploader-ts)
💻 **React + JavaScript**: [GitHub - image-crop-uploader-js](https://github.com/sukanta47/image-crop-uploader-js)

---

## **1️⃣ Install Dependencies**  
To get started, install **react-easy-crop** and **Material-UI** for the slider:

```
npm install react-easy-crop @mui/material @mui/icons-material
or
yarn add react-easy-crop @mui/material @mui/icons-material
or
pnpm add react-easy-crop @mui/material @mui/icons-material
```

2️⃣ **Creating the Image Cropper Component**
We’ll create an ImageCropper.tsx component that allows users to upload, crop, zoom, and rotate images.

🔹 ImageCropper.tsx

```
import { IconButton, Slider, Tooltip } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/Rotate90DegreesCcwRounded";
import RotateRightRoundedIcon from "@mui/icons-material/Rotate90DegreesCwRounded";
import OpenWithIcon from "@mui/icons-material/OpenWith";

import "./ImageCropper.scss";
import { ImageProperties } from "../ImageUploadModal/ImageUploadModal";

interface ImageCropperProps {
  uploadedImage: string;
  setImageProperties: (props: any) => void;
}

const ImageCropper = ({
  uploadedImage,
  setImageProperties,
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setImageProperties((prevVal: ImageProperties) => {
      if (
        prevVal.zoom !== zoom ||
        prevVal.rotation !== rotation ||
        prevVal.croppedAreaPixels !== croppedAreaPixels
      ) {
        return { zoom, rotation, croppedAreaPixels };
      }
      return prevVal;
    });
  }, [croppedAreaPixels, rotation, zoom]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area): void => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleZoomChange = (value: number) => {
    setZoom(value);
  };

  const handleZoomClick = (mode: string) => {
    if (mode === "zoomin") {
      setZoom((prev) => {
        if (prev >= 3) return prev;
        return prev + 0.1;
      });
    } else {
      setZoom((prev) => {
        if (prev <= 1) return prev;
        return prev - 0.1;
      });
    }
  };

  const handleRotationChange = (direction: string) => {
    if (rotation >= 360 || rotation <= -360) setRotation(0);
    if (direction === "left") setRotation((prev) => prev - 90);
    else setRotation((prev) => prev + 90);
  };

  return (
    <>
      <div className="crop-container">
        <Cropper
          image={uploadedImage}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
        <div className="move-btn">
          <OpenWithIcon /> <label htmlFor="none">Move</label>
        </div>
      </div>
      <div className="flex gap-4 control-container">
        <div className="flex gap-2 items-center">
          <Tooltip title="Zoom Out">
            <IconButton
              onClick={(e) => handleZoomClick("zoomout")}
              sx={{ outline: "none" }}
            >
              <ZoomOutRoundedIcon className="control-icon" />
            </IconButton>
          </Tooltip>
          <label htmlFor="none" className="label-text">
            <p>Zoom</p>
          </label>
          <Tooltip title="Zoom In">
            <IconButton onClick={() => handleZoomClick("zoomin")}>
              <ZoomInRoundedIcon className="control-icon" />
            </IconButton>
          </Tooltip>
        </div>
        <div className="zoom-slider">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e, value) => handleZoomChange(value as number)}
            title="Slide to zoom in or out"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Tooltip title="Rotate Left">
            <IconButton onClick={() => handleRotationChange("left")}>
              <RotateLeftRoundedIcon className="control-icon" />
            </IconButton>
          </Tooltip>
          <label className="label-text">
            <p>Rotate</p>
          </label>
          <Tooltip title="Rotate Right">
            <IconButton onClick={() => handleRotationChange("right")}>
              <RotateRightRoundedIcon className="control-icon" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
```

3️⃣ **Crop the Image Using Canvas**
We’ll use the Canvas API to extract the cropped area and return the final image.

🔹 helper.ts

```
import { Area } from "react-easy-crop";

export const getCroppedImg = async (imageSrc:string, croppedPixels:Area, rotation:number = 0):Promise<Blob | null> => {
  try {
    const image:HTMLImageElement = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx:CanvasRenderingContext2D | null = canvas.getContext("2d");

    const radians = (rotation * Math.PI) / 180;

    // Calculate the bounding box after rotation
    const rotatedWidth =
      Math.abs(Math.cos(radians) * image.width) +
      Math.abs(Math.sin(radians) * image.height);
    const rotatedHeight =
      Math.abs(Math.sin(radians) * image.width) +
      Math.abs(Math.cos(radians) * image.height);

    // Set canvas size to accommodate rotated image
    canvas.width = rotatedWidth;
    canvas.height = rotatedHeight;
    
    // Move the origin to the center of the canvas for rotation specific transformations
    ctx?.translate(rotatedWidth / 2, rotatedHeight / 2);
    ctx?.rotate(radians);

    // Draw the image so it is centered in the canvas
    ctx?.drawImage(image, -image.width / 2, -image.height / 2);

    // Reset the transformation before final cropping
    ctx?.setTransform(1, 0, 0, 1, 0, 0);

    // Create another canvas for the final cropped image
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx:CanvasRenderingContext2D | null = croppedCanvas.getContext("2d");

    croppedCanvas.width = croppedPixels.width;
    croppedCanvas.height = croppedPixels.height;

    // Draw the final cropped area from the rotated image
    croppedCtx?.drawImage(
      canvas,
      croppedPixels.x,
      croppedPixels.y,
      croppedPixels.width,
      croppedPixels.height,
      0,
      0,
      croppedPixels.width,
      croppedPixels.height
    );

    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((blob) => {
        if (!blob) {
          console.error("Blob creation failed");
          reject(null);
          return;
        }
        resolve(blob);
      }, "image/jpeg");
    });
  } catch (error) {
    console.error("Error cropping image:", error);
    return null;
  }
};

const createImage = (url:string):Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = ()=> resolve(image);
    image.onerror = (error) => reject(error);
  });
```
4️⃣ **Profile Picture Upload Component**
This component selects, crops, and uploads the profile picture.

🔹 ImageUploadModal.tsx
```
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

import ImageCropper from "@src/ImageCropper/ImageCropper";
import { getCroppedImg, blobToBase64 } from "@src/helpers/helper.ts";

interface ImageUploadProps {
  handleClose: () => void;
  openModal:boolean;
}
const ImageUploadModal = ({ handleClose, openModal }: ImageUploadProps) => {
  const [dragEnter, setDragEnter] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const uploadProfilePicInputRef = useRef<HTMLInputElement>(null);
  const [imageProperties, setImageProperties] = useState({
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
  /* check validations before uploading the file */
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
              Upload a photo of yourself to personalize your account
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
              <Button onClick={handleClose} variant="outlined" className="btn-s">
                Cancel
              </Button>

              <Button  variant="contained" className="btn-p" onClick={() => attachButtonHandler()}>
                Attach Photo
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleChangeImage} variant="outlined" className="btn-s">
                Change Photo
              </Button>
              <Button onClick={handleSubmit} variant="contained" className="btn-p">
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
```
🎨 5️⃣ **Styling**
Basic SCSS styles for a clean UI.

```
$theme_color_primary: #8f1ca3;
$theme_bgcolor_primary: #8f1ca3;
$theme_color_primary_light: #8f1ca38b;
$theme_color_primary_border: #8f1ca35f;

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;

  &:hover {
    color: #535bf2;
  }
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

.MuiIconButton-root {
  outline: none;
  height: fit-content;
  padding: 3px;

  svg:hover {
    color: $theme_color_primary;
  }
}

.upload-pic-container.modal-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 34rem;
  height: 382px;
  position: absolute;
  top: 50%;
  left: 50%;
  outline: none;
  transform: translate(-50%, -50%);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);

  .edit-image-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #cbd0dc;
    border-radius: 20px;
    width: 30px;
    height: 30px;

    svg {
      margin-top: 2.5px;
      margin-left: 0.5px;
    }
  }

  .title-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-left: 15px;
    padding-bottom: 10px;

    .title-section-head {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      padding-left: 20px;
    }

    .title-section-para {
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      opacity: 0.4;
      padding-left: 20px;
    }
  }

  .header-container {
    display: flex;
    align-items: center;
    border-bottom: 2px solid $theme_color_primary_border;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 30px;
    background-color: #e2f8ed;
  }

  .btn-p {
    background-color: $theme_color_primary;
    color: white;
    border: none;
    font-weight: 700;
    font-family: inherit;
  }

  .btn-s {
    border: 1px solid $theme_color_primary;
    background-color: white;
    color: $theme_color_primary;
    font-weight: 700;
    font-family: inherit;
  }

  .modal-title {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
  }

  .upload-box {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    border: 2px dashed #cbd0dc;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    text-align: center;
    padding: 20px;
    transition: 0.4s ease-in-out;

    &:hover,
    &.drag-enter {
      border-color: $theme_color_primary;
      box-shadow: 0px 0px 8px 3px #ebecea;
    }
  }

  .preview-image {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid $theme_color_primary;
  }

  .upload-info {
    font-size: 12px;
    color: gray;
    margin-top: 10px;
    font-family: inherit;
  }

  .error {
    color: red;
    font-size: 12px;
  }

  .upload-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}

.reactEasyCrop_CropArea {
  width: 100% !important;
  height: 100% !important;
}

.image-cropper-modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.crop-container {
  position: relative;
  top: -26px;
  width: 242px;
  height: 242px;
  background: #f5f5f5;
  clip-path: circle(37%);
  overflow: hidden;

  .move-btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #bcbcbc;
    position: absolute;
    height: 24px;
    width: 62px;
    top: 168px;
    left: 92px;
    border-radius: 34px;
    color: $theme_color_primary;
    font-size: 10px;
    padding: 5px;
    opacity: 0.8;
    transition: 0.2s ease-in-out;

    svg {
      height: 10px;
      width: 10px;
    }
  }

  &:hover .move-btn {
    display: none;
  }
}

.control-container {
  position: absolute;
  bottom: 66px;
  width: 75%;

  .control-icon {
    cursor: pointer;
    color: $theme_color_primary;
    opacity: 0.58;

    &:hover {
      opacity: 1;
    }
  }

  .MuiIconButton-root {
    outline: none;
    height: fit-content;
    padding: 3px;
  }

  .MuiSlider-root {
    color: $theme_color_primary;
  }

  .zoom-slider {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .label-text {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;

    svg {
      height: 16px;
      width: 16px;
    }

    p {
      font-size: 10px;
      color: $theme_color_primary;
    }
  }

  .rotate-right {
    transform: scaleX(-1);
  }
}
```
## 🎯 **Conclusion**  

✅ Users can select, crop, and adjust profile pictures.  
✅ `react-easy-crop` handles zoom & rotation effortlessly.  
✅ The Canvas API extracts the cropped image.  
✅ Supports drag & drop, file selection, and real-time previews.  

This approach provides a scalable, user-friendly solution for profile picture uploads. If you found this helpful, feel free to like & share! 🚀🔥
