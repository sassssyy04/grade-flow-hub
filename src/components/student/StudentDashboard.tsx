
import { useState } from 'react';
import { BookOpen, Clock, CheckCircle, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentList } from './AssignmentList';
import { PDFEditor } from './PDFEditor';
import { StudentAssignment } from '@/types';

export const StudentDashboard = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
  
  // Mock student assignments
  const studentAssignments: StudentAssignment[] = [
    {
      id: '1',
      assignmentId: '1',
      studentId: 'student1',
      teacherId: 'teacher1',
      status: 'assigned',
    },
    {
      id: '2',
      assignmentId: '2',
      studentId: 'student1',
      teacherId: 'teacher1',
      status: 'graded',
      grade: 85,
      feedback: 'Good work! Pay attention to grammar in future assignments.',
      submittedAt: '2024-01-10T10:00:00Z',
    },
  ];

  const handleAssignmentOpen = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
  };

  const handleAssignmentSubmit = (assignmentId: string) => {
    console.log('Assignment submitted:', assignmentId);
    // Update assignment status to submitted
  };

  const stats = {
    total: studentAssignments.length,
    pending: studentAssignments.filter(a => a.status === 'assigned' || a.status === 'in_progress').length,
    submitted: studentAssignments.filter(a => a.status === 'submitted').length,
    graded: studentAssignments.filter(a => a.status === 'graded').length,
  };

  const averageGrade = studentAssignments
    .filter(a => a.grade !== undefined)
    .reduce((sum, a) => sum + (a.grade || 0), 0) / studentAssignments.filter(a => a.grade !== undefined).length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-800">{stats.total}</div>
            <div className="text-xs text-blue-600">Total</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-yellow-800">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-800">{stats.submitted}</div>
            <div className="text-xs text-green-600">Submitted</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-purple-800">{Math.round(averageGrade)}%</div>
            <div className="text-xs text-purple-600">Average</div>
          </div>
        </div>
      </div>

      {selectedAssignment ? (
        <PDFEditor 
          assignment={selectedAssignment}
          onBack={() => setSelectedAssignment(null)}
          onSubmit={handleAssignmentSubmit}
        />
      ) : (
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">Current Assignments</TabsTrigger>
            <TabsTrigger value="completed">Completed Work</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <AssignmentList 
              assignments={studentAssignments.filter(a => a.status !== 'graded')}
              onAssignmentOpen={handleAssignmentOpen}
            />
          </TabsContent>

          <TabsContent value="completed">
            <AssignmentList 
              assignments={studentAssignments.filter(a => a.status === 'graded')}
              onAssignmentOpen={handleAssignmentOpen}
              showGrades={true}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
