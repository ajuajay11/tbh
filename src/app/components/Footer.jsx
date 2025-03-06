export default function Footer() {
  const bg = {
    borderTopLeftRadius: "40px",
    borderTopRightRadius: "40px",
    backgroundColor:'#000'
  };
  return (
    <div className="p-4 text-white shadow" style={bg}>
      <div className="mb-4 mb-md-0 text-center py-5">
        <h5 className="text-uppercase">Footer text</h5>
        <p> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis molestias. Fugiat pariatur maxime quis culpa corporis vitae
          repudiandae aliquam voluptatem veniam, est atque cumque eum delectus sint! </p>
      </div>
    </div>
  );
}
