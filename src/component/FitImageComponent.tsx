import React from "react";
import { useImageResizeWorker } from "../hooks/useImageResize";

interface Props {
    file: File | null;
    width: number;
    height: number;
}

const FitImageComponent = ({ file, width, height }: Props) => {

  const { imageUrl, loading } = useImageResizeWorker(file, { width, height });
  
  return (
    <div className="fit-image-component">
      {loading && <p>Loading...</p>}
      {imageUrl && <img src={imageUrl} alt="Resized" />}
</div>
  );
}

export default React.memo(FitImageComponent);