import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ onClear }) => {
  return (
    <nav>
      <div className="flex items-center justify-center py-5 md:flex-row gap-10">
        <h2 className="font-semibold text-3xl">Korea Lens</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Setting</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button>
                <Link to="/">
                  <p>Back to main</p>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button onClick={onClear}>
                <p>Clear History</p>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
