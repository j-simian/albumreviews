interface CarouselProps {
  label: string;
}
const Carousel = ({
  label,
  children,
}: React.PropsWithChildren<CarouselProps>) => {
  return (
			<div style={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
      <h2>{label}</h2>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Carousel;
