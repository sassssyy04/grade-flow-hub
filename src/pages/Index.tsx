
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { TeacherDashboard } from '@/components/teacher/TeacherDashboard';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { User } from '@/types';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    console.log('User logged in:', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    console.log('User logged out');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div className="p-6">Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} onLogout={handleLogout} />
      {renderDashboard()}
    </div>
  );
};

export default Index;
