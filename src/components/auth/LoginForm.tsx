
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock users for demo
  const mockUsers: User[] = [
    { id: '1', name: 'John Admin', email: 'admin@edu.com', role: 'admin', createdAt: '2024-01-01' },
    { id: '2', name: 'Sarah Teacher', email: 'teacher@edu.com', role: 'teacher', createdAt: '2024-01-01' },
    { id: '3', name: 'Mike Student', email: 'student@edu.com', role: 'student', createdAt: '2024-01-01' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        onLogin(user);
      } else {
        alert('Invalid credentials. Try: admin@edu.com, teacher@edu.com, or student@edu.com');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">EduConnect</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-xs text-gray-500 space-y-1">
            <p>Demo accounts:</p>
            <p>Admin: admin@edu.com</p>
            <p>Teacher: teacher@edu.com</p>
            <p>Student: student@edu.com</p>
            <p>Password: any</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
