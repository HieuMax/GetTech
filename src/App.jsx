import { useEffect, useState } from "react";
import { phones } from "./Phones";
import { Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import "./global.css";
import Form from 'react-bootstrap/Form';

const data = phones

////////////////////////////////////////////////////////////////
//  NAVBAR  ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Navbar = () => {
  return(
    <div className='my-5 flex flex-col gap-5'>
      <div className="flex items-center justify-between font-semibold">
          <div className=" flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
              <img src="/logo.png" alt="Logo" />
              <h1 className='text-3xl'>GetTech</h1>
          </div>
          <div className="flex items-center gap-3">

           {["List", "Create", "Edit" ,"Delete"].map((text) => (
                <Link
                  to={`/${text.toLowerCase()}`}
                  key={text}
                  >
                  <button className="p-2 rounded cursor-pointer text-black">
                    {text}                  
                  </button>
                </Link>
              ))}
        </div>
      </div>
    </div>
  )
}

////////////////////////////////////////////////////////////////
//  Product Item  //////////////////////////////////////////////
////////////////////////////////////////////////////////////////

export const ProductItem = ({ product }) => {
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex text-orange-400 text-sm">
        {Array(fullStars).fill(<i className="fa-solid fa-star">♥</i>)}{" "}
        {halfStar && <i className="fa-solid fa-star-half-alt">♥</i>}{" "}
        {Array(emptyStars).fill(
          <i className="fa-regular fa-star text-gray-300"></i>
        )}{" "}
      </div>
    );
  };
  return (
    <Link
      to={`/list/${product.id}`}
      className="cursor-pointer rounded-lg shadow-md outline outline-neutral-300"
      >
      <div className="w-full p-5 max-lg:w-[240px] max-md:w-[220px] max-mb_L:w-[280px] px-[13px] h-full max-lg:h-[450px] rounded-md flex flex-row cursor-pointer bg-neutral-100">
          {/* HINH ANH  */}
        <div className="relative w-[300px] h-full max-lg:h-[200px] p-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl"
          />
          {/* SPECIAL */}
          {product.isSpecialOffer && (
            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded-lg">
              Special offers
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className=" relative flex-1 flex flex-col justify-between my-3 px-3">

          <div className="min-h-[120px]">
            <div className="flex  justify-between gap-1 flex-row">
              <h3 className="text-2xl font-semibold break-words">
                {product.name}
              </h3>
              <i class="fa-regular pt-2 fa-heart text-gray-500 text-lg cursor-pointer hover:text-red-500"></i>
            </div>
            <p className="text-gray-500 text-sm break-words">
              {product.description}
            </p>

            {/* RATE */}
            <div className="flex items-center mt-1 gap-1">
              {renderStars(product.rating)}
              <span className="text-[#1B4B66] font-medium text-[13px]">
                {product.reviews} Ratings
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="mt-2 font-semibold">
            {product.discountPrice != 0 
              ? (
                <>
                  <span className="text-[15px] font-bold text-black">
                    ${product.discountPrice}
                  </span>
                  <span className="text-gray-400 text-[13px] line-through ml-2">
                    ${product.price}
                  </span>
                  <span className="text-[#E21D1D] text-sm ml-2">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )
              : (
                <span className="text-[15px] font-bold text-black">
                  ${product.price}
                </span>
              )}
          </div>

          {/* BUTTON */}
          <button className="mt-3 w-fit float-end text-[15px] outline border font-medium text-[#334154] py-3 rounded-lg flex items-center justify-center gap-2">
            Add to bag
          </button>
        </div>
      </div>
    </Link>
  );
};

////////////////////////////////////////////////////////////////
//  Product List  //////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function PhoneList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [visibileItems, setVisibleItems] = useState(10)
  const itemsPerPage = 10;

  let brands = []
  data.forEach((item) => {
    const existedBrand = brands.filter((brand) => item.brand == brand)
    if (existedBrand.length < 1) {
      brands.push(item.brand)
    }
  })

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = data.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesSearch && matchesBrand;
  });

  const displayed = filteredProducts.slice(0,visibileItems)

  const handleScroll = () => {
    // Check if user is near the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 // Trigger 100px before bottom
    ) {
      // Increase visible items, but don’t exceed total length
      setVisibleItems((prev) => Math.min(prev + itemsPerPage, filteredProducts.length));
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])

  return (
    <div className="p-5">
      <h1 className="p-5">Tìm kiếm sản phẩm theo tên</h1>

      {/* Search bar */}
      <div className="flex-grow mx-5 flex items-center gap-0 border border-gray-300 rounded max-md:hidden">
          <input 
              type="text" 
              placeholder="Search..." 
              className="w-full p-2 rounded-r"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="p-2" 
            onClick={() => setSearchQuery(searchTerm)}
          >
              Search
          </button>
      </div>


      <div className="m-5">
        <h2 className="text-xl">Tìm theo danh mục</h2>
        <div className="flex gap-4">
          {brands && brands.map((brand) => (
            <div key={brand} className="mb-3 py-3">
              <Form.Check
                inline
                label={brand}
                name="group1"
                aria-label={brand}
                type='checkbox'
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                id={`checkbox-${brand}`}
                className="flex gap-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto py-10 max-xl:p-10 max-md:p-3 flex flex-1 flex-col">
        <h2 className="text-2xl font-semibold mb-6 ">Best of Accessories</h2>
        <div className="gap-5 grid grid-cols-2  max-mb_L:flex max-mb_L:flex-col max-mb_L:justify-center max-mb_L:items-center">
          {displayed.map((product, index) => (
            <ProductItem key={index} product={product} />
          ))}
        </div>
      </div>

      <div id="trigger h-2 w-full bg-red-300"></div>
    </div>
  );
}



////////////////////////////////////////////////////////////////
//  CREATE COMPONENT  //////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Create = () => {
  const { id } = useParams();
  const product = data.find((product) => product.id === parseInt(id));

  const initialProduct = {
    image: product? product.image : "",
    name: product? product.name : "",
    description: product? product.description : "",
    discountPrice: product? product.discountPrice: "",
    brand: product? product.brand : "",
    price: product? product.price : "",
    isSpecialOffer: product? product.isSpecialOffer : false,
  } 

  const [formData, setFormData] = useState(initialProduct);

  const [modalState, setModalState] = useState({
    isModalOpen: false,
    textModal: "",
    buttonColor: "var(--color-blue-500)"
  })

  const closeModal = () => {
    setModalState({
      ...modalState,
      isModalOpen: false
    })
  };

  const clearForm = () => {
    setFormData({
      image: "",
      name: "",
      description: "",
      brand: "",
      price: "",
      discountPrice: "",
      isSpecialOffer: false,
    })
  }


  
  useEffect(() => {
    setFormData(initialProduct)
  }, [product])


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existedProduct = data.filter((item) => item.name == formData.name && item.brand == formData.brand)

    if (formData.price < 0 || formData.discountPrice < 0) {
      setModalState({
        isModalOpen: true,
        textModal: "Invalid Price or Discount Price",
        buttonColor: "var(--color-red-500)"
      })
      return
    }

    if (formData.discountPrice > formData.price) {
      setModalState({
        isModalOpen: true,
        textModal: "Invalid Discount Price",
        buttonColor: "var(--color-red-500)"
      })
      return
    }

    if (product || existedProduct.length > 0) {
      if (product) {
        if (JSON.stringify(formData) == JSON.stringify(initialProduct)) {
          setModalState({
            isModalOpen: true,
            textModal: "No thing change",
            buttonColor: "var(--color-red-500)"
          }) 
          return
        }

        const changeProduct = {
          ...product,
          name: formData.name,
          image: formData.image,
          description: formData.description,
          brand: formData.brand,
          price: formData.price,
          isSpecialOffer: formData.isSpecialOffer,
          discountPrice: formData.discountPrice,
          discountPercent: 100 - Math.round((formData.discountPrice / formData.price)*100),
        }
        const index = data.findIndex(item => item.id == product.id)
        data.splice(index, 1, changeProduct)

        setModalState({
          isModalOpen: true,
          textModal: "Change successfully",
          buttonColor: "var(--color-blue-500)"
        }) 

      } else {
        setModalState({
          isModalOpen: true,
          textModal: "Existed product! Fail to create",
          buttonColor: "var(--color-red-500)"
        })
      }
      return
    }

    const newProduct = {
      id: data.length + 1,
      name: formData.name,
      image: formData.image,
      description: formData.description,
      brand: formData.brand,
      price: formData.price,
      discountPrice: formData.discountPrice,
      rating: 0,
      reviews: 0,
      discountPercent: 100 - Math.round((formData.discountPrice / formData.price)*100),
      isSpecialOffer: formData.isSpecialOffer,
    }
    data.push(newProduct)
    clearForm();
    setModalState({
      isModalOpen: true,
      textModal: "Product created successfully",
      buttonColor: "var(--color-blue-500)"
    })
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "blue" }}>{product? "Edit" : "Create"} Phone</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            background: "white",
            color: "black",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            background: "white",
            color: "black",

            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            color: "black",
            background: "white",

            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            color: "black",
            background: "white",

            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          style={{
            padding: "10px",
            color: "black",
            background: "white",

            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          name="discountPrice"
          placeholder="Discount Price (optional)"
          value={formData.discountPrice}
          onChange={handleChange}    
          defaultValue={0}
          required
          style={{
            padding: "10px",
            color: "black",
            background: "white",

            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "black",
          }}>
          <input
            type="checkbox"
            name="isSpecialOffer"
            checked={formData.isSpecialOffer}
            onChange={handleChange}
          />
          Special Offer
        </label>
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007BFF",
            color: "#fff",
            cursor: "pointer",
          }}>
          {product? "Edit" : "Create"} 
        </button>
      </form>
      <Modal
        isOpen={modalState.isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create successful"
        className='flex flex-col absolute'
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#000",
          },
        }}>
        <h2>{modalState && modalState.textModal}</h2>
        <button
          onClick={closeModal}
          className="m-auto w-1/2 mt-3"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: `${modalState.buttonColor}`,
            color: "#fff",
            cursor: "pointer",
          }}>
          OK
        </button>
      </Modal>
    </div>
  );
};




////////////////////////////////////////////////////////////////
//  DELETE COMPONENT  //////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Delete = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    const idx = data.findIndex(item => item.id == selectedProduct.id)
    data.splice(idx, 1)
    // alert(`Product with ID ${selectedProduct.id} will be deleted.`);
    closeModal();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "red" }}>Delete Phone</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}>
        {data.map((product) => (
          <div
            key={product.id}
            style={{
              width: "280px",
              maxWidth: "240px",
              padding: "13px",
              height: "350px",
              maxHeight: "450px",
              borderRadius: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              border: "1px solid #ccc",
              position: "relative",
              backgroundColor: "#fff",
              color: "#000",
            }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "0.375rem",
              }}
            />
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
              {product.name}
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                wordBreak: "break-word",
              }}>
              {product.description}
            </p>
            <button
              onClick={() => openModal(product)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                padding: "5px 10px",
                backgroundColor: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#000",
          },
        }}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {selectedProduct?.name}?</p>
        <button
          onClick={handleDelete}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FF0000",
            color: "#fff",
            cursor: "pointer",
            marginRight: "10px",
          }}>
          Yes, Delete
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ccc",
            color: "#000",
            cursor: "pointer",
          }}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};


////////////////////////////////////////////////////////////////
//  EDIT COMPONENT  //////////////////////////////////////////
////////////////////////////////////////////////////////////////

const Edit = () => {

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edit Phone</h1>
      <div 
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}>
        {data.map((product) => (
          <div
            key={product.id}
            style={{
              width: "280px",
              maxWidth: "240px",
              padding: "13px",
              height: "350px",
              maxHeight: "450px",
              borderRadius: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              border: "1px solid #ccc",
              position: "relative",
              backgroundColor: "#fff",
              color: "#000",
            }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "0.375rem",
              }}
            />
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>
              {product.name}
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                wordBreak: "break-word",
              }}>
              {product.description}
            </p>
            <Link to={`/edit/${product.id}`}>
              <button
                // onClick={() => openModal(product)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  padding: "5px 10px",
                  backgroundColor: "var(--color-blue-500)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}>
                Edit
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm Delete"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#000",
          },
        }}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {selectedProduct?.name}?</p>
        <button
          onClick={handleDelete}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FF0000",
            color: "#fff",
            cursor: "pointer",
            marginRight: "10px",
          }}>
          Yes, Delete
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ccc",
            color: "#000",
            cursor: "pointer",
          }}>
          Cancel
        </button>
      </Modal> */}
    </div>
  );
};





////////////////////////////////////////////////////////////////
//  PRODUCT DETAIL COMPONENT  //////////////////////////////////
////////////////////////////////////////////////////////////////

const ProductDetail = (props) => {
  const { id } = useParams();
  const product = data.find((product) => product.id === parseInt(id));

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "90vw",
        padding: "80px 20px 20px 20px",
      }}>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "0.375rem",
            }}
          />
        </div>
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
          <h1 style={{ color: "#000" }}>{product.name}</h1>
          <p style={{ color: "#333" }}>{product.description}</p>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span
              style={{
                color: "#1B4B66",
                fontWeight: "500",
                fontSize: "0.8125rem",
              }}>
              {product.reviews} Ratings
            </span>
          </div>
          <div style={{ fontWeight: "600" }}>
            <span
              style={{ fontSize: "1.5rem", fontWeight: "700", color: "#000" }}>
              ${product.discountPrice}
            </span>
            <span
              style={{
                color: "#9ca3af",
                fontSize: "1rem",
                textDecoration: "line-through",
                marginLeft: "0.5rem",
              }}>
              ${product.originalPrice}
            </span>
            <span
              style={{
                color: "#E21D1D",
                fontSize: "1rem",
                marginLeft: "0.5rem",
              }}>
              {product.discountPercent}% OFF
            </span>
          </div>
          <button
            style={{
              width: "100%",
              maxWidth: "300px",
              fontSize: "1rem",
              backgroundColor: "#007BFF",
              border: "none",
              fontWeight: "500",
              color: "#fff",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
            <i className="fa-solid fa-bag-shopping"></i> Add to bag
          </button>
        </div>
      </div>
    </div>
  );
};


////////////////////////////////////////////////////////////////
//  SEARCH BAR COMPONENT  //////////////////////////////////////
////////////////////////////////////////////////////////////////

export const SearchBar = ({ onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a product..."
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "8px",
        marginBottom: "16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "1rem",
      }}
    />
  );
};


////////////////////////////////////////////////////////////////
//  APP  ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function App() {
  return (
    <div className="relative m-auto">
      <div className="xl:px-20 px-5 max-w-[1600px] m-auto relative">
        <div className="sticky top-0 bg-white z-50">
          <Navbar />
        </div>
        <Routes>
          <Route path="/list" element={<PhoneList />} />
          <Route path="/" element={<PhoneList />} />
          <Route path="/create" element={<Create />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/edit/:id" element={<Create />} />
          <Route path="/list/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
