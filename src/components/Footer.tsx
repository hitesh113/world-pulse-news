import { Link } from "react-router-dom";

const footerLinks = [
  { name: "World", path: "/category/world" },
  { name: "Tech", path: "/category/tech" },
  { name: "Sports", path: "/category/sports" },
  { name: "Business", path: "/category/business" },
  { name: "Politics", path: "/category/politics" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 mt-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-lg font-bold text-foreground">
            WorldPulse
          </Link>
          <div className="flex items-center gap-5">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WorldPulse
          </p>
        </div>
      </div>
    </footer>
  );
}
