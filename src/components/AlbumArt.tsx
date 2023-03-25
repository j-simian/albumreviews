type AlbumArtProps = {
  src: string;
  size: string;
};
const AlbumArt = ({ src, size }: AlbumArtProps) => {
  return (
    <img
      alt="album cover"
      src={src}
      width={size === "large" ? 300 : 150}
      style={{
        borderRadius: "1rem",
      }}
    />
  );
};

export default AlbumArt;
