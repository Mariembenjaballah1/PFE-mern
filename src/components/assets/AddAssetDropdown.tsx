
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Server, Printer, Camera, PcCase } from 'lucide-react';

interface AddAssetDropdownProps {
  onOpenDialog: (type: 'general' | 'server' | 'simple') => void;
}

const AddAssetDropdown: React.FC<AddAssetDropdownProps> = ({ onOpenDialog }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          More Options
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg z-50">
        <DropdownMenuItem 
          onClick={() => onOpenDialog('server')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
        >
          <Server className="h-4 w-4" />
          <div>
            <div className="font-medium">Add Server</div>
            <div className="text-xs text-gray-500">Complete server form with specs</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onOpenDialog('simple')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
        >
          <Printer className="h-4 w-4" />
          <div>
            <div className="font-medium">Add Simple Asset</div>
            <div className="text-xs text-gray-500">Printer, Camera, PC, etc.</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddAssetDropdown;
