
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Facebook, Youtube, MessageSquare } from 'lucide-react';
import { TiktokIcon } from '@/components/icons/TiktokIcon';
import Footer from '@/components/Footer';
import { useAuthState } from '@/hooks/auth';

const Affiliate = () => {
  const navigate = useNavigate();
  const { user } = useAuthState();

  const handleApplyClick = () => {
    if (user) {
      // User is logged in, redirect to dashboard's unlock tab
      navigate('/dashboard?tab=unlock');
    } else {
      // User is not logged in, redirect to auth
      navigate('/auth', { state: { redirectTo: '/dashboard?tab=unlock' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md">
              <Link to="/" className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </Link>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              <Link to="/">shortit</Link>
            </h1>
          </div>
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              {user ? (
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/auth" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Affiliate Program</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock free links by completing simple tasks. Share our service and increase your monthly link limit!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Task</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    Share post to Facebook
                  </div>
                </TableCell>
                <TableCell>eMoney related group, at least 5,000+ members</TableCell>
                <TableCell>25 links</TableCell>
                <TableCell>1 month</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-600" />
                    Make a video on YouTube
                  </div>
                </TableCell>
                <TableCell>eMoney related channel, at least 2,000+ followers</TableCell>
                <TableCell>100 links</TableCell>
                <TableCell>1 month</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <TiktokIcon className="h-5 w-5" />
                    Make a video on TikTok
                  </div>
                </TableCell>
                <TableCell>eMoney related channel, at least 5,000+ followers</TableCell>
                <TableCell>50 links</TableCell>
                <TableCell>1 month</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Make a thread on forum
                  </div>
                </TableCell>
                <TableCell>Any Forum, must be USA or Europe based forum</TableCell>
                <TableCell>25 links</TableCell>
                <TableCell>1 month</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleApplyClick} 
            size="lg" 
            className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 text-lg px-12 py-6 h-auto"
          >
            Apply Now
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Affiliate;
