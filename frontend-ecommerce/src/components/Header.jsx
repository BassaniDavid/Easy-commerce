import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import DarkModeToggle from "../components/DarkModeToggle";
import logo from "../assets/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogoClick = () => {
    navigate("/", { state: { resetCategory: true } });
  };
  return (
    <header className="text-2xl lg:text-4xl shadow-lg p-2 lg:px-20 flex justify-between items-center sticky top-0 z-10 bg-white dark:bg-neutral-800 dark:text-white">
      <button onClick={handleLogoClick}>
        <img
          src={logo}
          alt="Logo"
          className="w-25 lg:w-35 rounded-2xl hover:shadow-md transition hover:shadow-lime-500/50 dark:hover:hover:shadow-lime-900"
        />
      </button>
      <div className="flex gap-5">
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "text-lime-600 font-semibold" : " hover:text-lime-600"
          }
        >
          <div className="flex items-center gap-2">
            <h2 className="hidden lg:block">Cart</h2>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-12 relative z-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/4 text-base font-bold px-2 rounded-full z-0">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </NavLink>

        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
