// Img.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue } from "@importHooks";

// -------------------------------------------------------------------------------------------------
declare type ImgProps = React.HTMLAttributes<HTMLImageElement> & {
  group?: string;
  src?: any;
  hover?: boolean;
  shadow?: boolean;
  radius?: boolean;
  max?: number;
  loading?: "eager" | "lazy";
};

// -------------------------------------------------------------------------------------------------
export const Img = (
  { group, src, hover, shadow, radius, max, loading, ...props }: ImgProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { GCLOUD_URL } = useCommonValue();

  // 2-1. useState ---------------------------------------------------------------------------------
  const [fileName, setFileName] = useState<string>("");
  const [imgSrc, setImgSrc] = useState<string>("");
  const [imageClass, setImageClass] = useState<string>("");

  // 2-2. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (src && typeof src === "string") {
      setFileName(src.split("/").pop()?.split(".")[0] || "empty");
      setImgSrc(group === "new" ? src : `${GCLOUD_URL}/${group || "main"}/${src}.webp`);
    }
    else {
      setFileName("empty");
      setImgSrc(`${GCLOUD_URL}/main/empty.webp`);
    }

    let newClass = "object-contain";

    if (props?.className) {
      newClass += ` ${props.className}`;
    }
    if (hover) {
      newClass += " hover";
    }
    if (shadow) {
      newClass += " shadow-3";
    }
    if (radius) {
      newClass += " radius-1";
    }

    if (max) {
      newClass += ` w-max${max} h-max${max}`;
    }
    else {
      newClass += " w-100p h-100p";
    }

    setImageClass(newClass);

  }, [group, src, props.className, hover, shadow, radius, max]);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <img
      {...props}
      alt={fileName}
      key={fileName}
      src={imgSrc}
      loading={loading || "lazy"}
      className={imageClass}
      onError={(e) => {
        e.currentTarget.src = `${GCLOUD_URL}/main/empty.webp`;
        e.currentTarget.alt = "empty";
        e.currentTarget.className = "w-20 h-20";
      }}
    />
  );
};