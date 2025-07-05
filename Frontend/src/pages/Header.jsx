import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { LayoutDashboard, User, Wallet, LogOut, LogIn } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';  
const Header = () => {
  const {user, logout} = useAuth() ;
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 text-black border-b border-gray-200 ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className=" text-black font-bold text-lg flex items-center ">
            FinTrak
          </Link>
          <nav className="flex items-center gap-4 ">
            {user ? (
              <>
                <Link to="/dashboard" className="text-black hover:text-black">
                  <Button variant=" variant" className="border  hover:bg-black hover:text-white transition-all duration-200">
                    <LayoutDashboard/>
                    <span className='md:inline hidden'>Dashboard</span>
                  </Button> 
                </Link>
                {/* <Link to="/profile" className="text-black hover:text-black">
                  <Button variant="variant" className="border hover:bg-black hover:text-white transition-all duration-200">
                    <User/>
                    <span className='md:inline hidden'>Profile</span>
                  </Button>
                </Link> */}
                <Link to="/transaction/create" className="text-black hover:text-black">
                  <Button variant="default" className="border bg-black text-white  transition-all duration-200">
                    <Wallet/>
                          <span className='md:inline hidden'>Add Transactions</span>
                  </Button>
                </Link>
                 {/* user avatar image with dropdown include logout option  */}
                 <div className="relative">
                 
                 <DropdownMenu>
                   <DropdownMenuTrigger asChild >
                     {/* image with login user name */}
                     <div className="flex items-center gap-2">
                       <div>
                          <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover cursor-pointer border border-black" />
                       </div>
                       {/* <span className='md:inline hidden'>{user.name}</span> */}
                     </div>
                   </DropdownMenuTrigger >
                   <DropdownMenuContent className="w-56 bg-white">
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>  
                     <DropdownMenuSeparator />
                     <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuLabel className='hover:text-red-600 cursor-pointer'>
                      <Link onClick={logout} className='flex items-center gap-2'>
                      <LogOut/>
                      <span>Logout</span>
                      </Link>
                      </DropdownMenuLabel>
                   </DropdownMenuContent>
                 </DropdownMenu>
               </div>

              </>
            ) : (
              <>
                <Link to="/login" className=" text-black hover:text-black">
                  <Button variant="variant" className="border hover:bg-black hover:text-white transition-all duration-200">
                    <LogIn/>
                    <span className='md:inline hidden'>Login</span>
                  </Button>
                </Link>
                <Link to="/signup" className=" text-black hover:text-black">
                  <Button variant="variant" className="border hover:bg-black hover:text-white transition-all duration-200">
                    <User/>
                    <span className='md:inline hidden'>Signup</span>
                  </Button>
                </Link> 
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
