import { Area } from "react-easy-crop";

export const blobToBase64 = (blob:Blob):Promise<string> => {
  return new Promise((resolve, _) => {
    const reader:FileReader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

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
