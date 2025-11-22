'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubscriptionTierBadge, SubscriptionStatusBadge } from './subscription-badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: string;
  lastLogin?: string | null;
  isActive: boolean;
  mrr: number;
  propertiesCount: number;
  bookingsCount: number;
  tenantsCount: number;
}

interface UserTableProps {
  users: User[];
  onAction?: (userId: string, action: string) => void;
}

export function UserTable({ users, onAction }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Sub. Status</TableHead>
            <TableHead>Account Status</TableHead>
            <TableHead>Properties</TableHead>
            <TableHead>MRR</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-muted-foreground text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <SubscriptionTierBadge tier={user.subscriptionTier as any} />
                </TableCell>
                <TableCell>
                  <SubscriptionStatusBadge status={user.subscriptionStatus as any} />
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Badge
                      variant="outline"
                      className="border-green-300 bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-300 bg-red-100 text-red-800">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{user.propertiesCount} properties</div>
                    <div className="text-muted-foreground">{user.tenantsCount} tenants</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{user.mrr > 0 ? `R${user.mrr}` : '-'}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.lastLogin
                    ? formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}?action=edit`}>Edit Subscription</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onAction?.(user.id, user.isActive ? 'deactivate' : 'activate')
                        }
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
