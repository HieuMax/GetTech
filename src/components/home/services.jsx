const services = [
  {
    iconClass: "fa-solid fa-truck",
    title: "Free Shipping",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-rotate",
    title: "Easy Returns",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-rocket",
    title: "Fast Delivery",
    description: "For invoices over $1,500",
  },
  {
    iconClass: "fa-solid fa-truck",
    title: "Free Shipping",
    description: "For invoices over $1,500",
  },
];

export const Services = () => {
  return (
    <div className="flex  justify-between py-10">
      {services.map((services, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border rounded-xl px-5 py-4 shadow-sm bg-white">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F4F7]">
            <i className={`${services.iconClass} text-gray-500 text-xl`}></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{services.title}</h4>
            <p className="text-sm text-gray-500">{services.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
