import { Button, IconButton, Slider, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import RotateLeftRoundedIcon from "@mui/icons-material/Rotate90DegreesCcwRounded";
import RotateRightRoundedIcon from "@mui/icons-material/Rotate90DegreesCwRounded";
import OpenWithIcon from "@mui/icons-material/OpenWith";

import "./ImageCropper.scss";

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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  useEffect(() => {
    setImageProperties({ zoom, rotation, croppedAreaPixels });
  }, [croppedAreaPixels, rotation, zoom, setImageProperties]);

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
            <IconButton onClick={(e) => handleZoomClick("zoomout")} sx={{outline:"none" }}>
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
