import React from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";
import UserStats from './UserStats';
import type { CustomContent, Topic, UserProfile } from '../interface/types';
import UserProfileD from './UserProfileDropdown';

interface MobileNavProps {
  userProfile: UserProfile;
  onUploadClick: () => void;
  activeTab: 'topics' | 'custom';
  onTabChange: (tab: 'topics' | 'custom') => void;
  topics: Topic[]
  customContents: CustomContent[]
}

const MobileNav: React.FC<MobileNavProps> = ({
  userProfile,
  topics,
  customContents
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-100">
        <div className="mt-6 space-y-6">
          {/* User Profile Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <UserProfileD />
          </div>
          <div>
            <UserStats customContents={customContents} userProfile={userProfile} topics={topics} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;