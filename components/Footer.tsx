import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-montserrat font-bold tracking-tight flex items-center">
              <span className="text-white">ALEX</span>
              <span className="text-accent">CHEN</span>
            </Link>
          </div>
          
          <div>
            <p className="font-opensans text-gray-400 text-center md:text-right">
              &copy; {currentYear} Alexander Chen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
