import { Image } from "@nextui-org/react";

const SongImage = ({ src, alt }) => (
    <Image
      src={src}
      alt={alt}
      className="w-full h-full object-cover object-center rounded-xl transition-transform duration-300"
    />
  );
  
  export default SongImage;
  