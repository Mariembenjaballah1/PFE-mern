
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, UserPlus } from 'lucide-react';
import { Asset } from '@/types/asset';

interface TeamOverviewCardsProps {
  teamSize: number;
  activeMembers: number;
  totalAssets: number;
}

export const TeamOverviewCards: React.FC<TeamOverviewCardsProps> = ({
  teamSize,
  activeMembers,
  totalAssets
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Team Size</p>
              <p className="text-2xl font-bold">{teamSize}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Active Members</p>
              <p className="text-2xl font-bold">{activeMembers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Workload</p>
              <p className="text-2xl font-bold">{totalAssets}</p>
              <p className="text-xs text-muted-foreground">Total Assets</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
