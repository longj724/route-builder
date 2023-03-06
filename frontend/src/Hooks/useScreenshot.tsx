// External Dependencies
import { useState } from 'react';
import html2canvas from 'html2canvas';

// Relative Dependencies

const useScreenshot = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState(null);

  const takeScreenShot = (node: HTMLElement) => {
    return html2canvas(node)
      .then((canvas) => {
        const croppedCanvas = document.createElement('canvas');
        const croppedCanvasContext = croppedCanvas.getContext('2d');
        // init data
        const cropPositionTop = 0;
        const cropPositionLeft = 0;
        const cropWidth = canvas.width;
        const cropHeight = canvas.height;

        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        if (croppedCanvasContext) {
          croppedCanvasContext.drawImage(
            canvas,
            cropPositionLeft,
            cropPositionTop
          );
        }

        const base64Image = croppedCanvas.toDataURL('image/png');

        setImage(base64Image);
        return base64Image;
      })
      .catch(setError);
  };

  return [
    image,
    takeScreenShot,
    {
      error,
    },
  ];
};

export { useScreenshot };
