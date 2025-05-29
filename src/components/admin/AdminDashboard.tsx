
import { useState } from 'react';
import { Upload, Users, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssignmentUpload } from './AssignmentUpload';
import { StudentManager } from './StudentManager';
import { Assignment, StudentProfile } from '@/types';

export const AdminDashboard = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  const handleAssignmentUpload = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
  };

  const handleStudentCreate = (student: StudentProfile) => {
    setStudents(prev => [...prev, student]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">{assignments.length} Assignments</span>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{students.length} Students</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Assignment Management</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssignmentUpload onUpload={handleAssignmentUpload} />
            <Card>
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Assignments uploaded to the system</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No assignments uploaded yet</p>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-3 border rounded-lg">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {assignment.totalPoints} pts
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StudentManager onStudentCreate={handleStudentCreate} />
            <Card>
              <CardHeader>
                <CardTitle>Student Profiles</CardTitle>
                <CardDescription>All registered students</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No students registered yet</p>
                ) : (
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div key={student.id} className="p-3 border rounded-lg">
                        <h3 className="font-medium">Student ID: {student.userId}</h3>
                        <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                        <p className="text-sm text-gray-600">Subjects: {student.subjects.join(', ')}</p>
                        {student.parentEmail && (
                          <p className="text-xs text-gray-500">Parent: {student.parentEmail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
