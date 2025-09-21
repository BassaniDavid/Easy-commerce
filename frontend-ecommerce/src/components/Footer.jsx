const Footer = () => {
  return (
    <footer className=" p-5 bg-gray-700 dark:bg-black text-white">
      <div className=" mx-auto px-5 md:px-[10%] grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo e descrizione */}
        <div>
          <h2 className="text-2xl font-bold mb-3">easy-commerce</h2>
          <p className="text-gray-400">
            Your favorite place to discover, browse, and purchase products
            easily and securely.
          </p>
        </div>

        {/* Link utili */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-lime-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-lime-500 transition">
                Cart
              </a>
            </li>
          </ul>
        </div>

        {/* Contatti */}
        <div>
          <h3 className="font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              Email:{" "}
              <a
                href="mailto:support@easy-commerce.com"
                className="hover:text-lime-500 transition"
              >
                support@easy-commerce.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="hover:text-lime-500 transition"
              >
                +1 234 567 890
              </a>
            </li>
            <li>Address: 123 Commerce St, Shop City</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-gray-500 text-sm">
        &copy; 2025 easy-commerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
