
import { useState } from 'react';
import { BookOpen, Users, CheckSquare, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentAssigner } from './AssignmentAssigner';
import { GradeViewer } from './GradeViewer';
import { Assignment, StudentAssignment } from '@/types';

export const TeacherDashboard = () => {
  const [assignedWork, setAssignedWork] = useState<StudentAssignment[]>([]);
  
  // Mock assignments created by admin
  const availableAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Algebra Fundamentals',
      description: 'Basic algebraic equations and problem solving',
      pdfUrl: '/mock-assignment.pdf',
      createdBy: 'admin',
      createdAt: '2024-01-01',
      dueDate: '2024-01-15',
      totalPoints: 100
    },
    {
      id: '2',
      title: 'Essay Writing Basics',
      description: 'Introduction to structured essay writing',
      pdfUrl: '/mock-assignment2.pdf',
      createdBy: 'admin',
      createdAt: '2024-01-02',
      dueDate: '2024-01-20',
      totalPoints: 75
    }
  ];

  const handleAssignWork = (studentAssignment: StudentAssignment) => {
    setAssignedWork(prev => [...prev, studentAssignment]);
  };

  const handleGradeUpdate = (updatedAssignment: StudentAssignment) => {
    setAssignedWork(prev => 
      prev.map(assignment => 
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      )
    );
  };

  const stats = {
    totalAssigned: assignedWork.length,
    submitted: assignedWork.filter(a => a.status === 'submitted').length,
    graded: assignedWork.filter(a => a.status === 'graded').length,
    inProgress: assignedWork.filter(a => a.status === 'in_progress').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-800">{stats.totalAssigned}</div>
            <div className="text-xs text-blue-600">Assigned</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <Users className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-800">{stats.inProgress}</div>
            <div className="text-xs text-yellow-600">In Progress</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <CheckSquare className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-800">{stats.submitted}</div>
            <div className="text-xs text-green-600">Submitted</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-800">{stats.graded}</div>
            <div className="text-xs text-purple-600">Graded</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assign" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assign">Assign Work</TabsTrigger>
          <TabsTrigger value="grades">View Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="assign">
          <AssignmentAssigner 
            availableAssignments={availableAssignments}
            onAssign={handleAssignWork}
          />
        </TabsContent>

        <TabsContent value="grades">
          <GradeViewer 
            assignments={assignedWork}
            onGradeUpdate={handleGradeUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
