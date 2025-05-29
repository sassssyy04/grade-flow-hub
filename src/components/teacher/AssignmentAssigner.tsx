
import { useState } from 'react';
import { Send, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment, StudentAssignment } from '@/types';

interface AssignmentAssignerProps {
  availableAssignments: Assignment[];
  onAssign: (studentAssignment: StudentAssignment) => void;
}

export const AssignmentAssigner = ({ availableAssignments, onAssign }: AssignmentAssignerProps) => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [studentId, setStudentId] = useState('');

  // Mock students
  const mockStudents = [
    { id: 'student1', name: 'Alice Johnson', grade: '10' },
    { id: 'student2', name: 'Bob Smith', grade: '10' },
    { id: 'student3', name: 'Charlie Brown', grade: '9' },
    { id: 'student4', name: 'Diana Lee', grade: '11' },
  ];

  const handleAssign = () => {
    if (!selectedAssignment || !studentId) {
      alert('Please select both an assignment and a student');
      return;
    }

    const assignment = availableAssignments.find(a => a.id === selectedAssignment);
    if (!assignment) return;

    const studentAssignment: StudentAssignment = {
      id: Date.now().toString(),
      assignmentId: selectedAssignment,
      studentId,
      teacherId: 'teacher1',
      status: 'assigned',
    };

    onAssign(studentAssignment);
    setSelectedAssignment('');
    setStudentId('');
    alert('Assignment assigned successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Assign Work</span>
          </CardTitle>
          <CardDescription>Assign assignments to your students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="assignment">Select Assignment</Label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an assignment" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableAssignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.title} ({assignment.totalPoints} pts)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="student">Select Student</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} (Grade {student.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleAssign} className="w-full">
            Assign to Student
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Assignments</CardTitle>
          <CardDescription>Assignments created by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          {availableAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No assignments available</p>
          ) : (
            <div className="space-y-3">
              {availableAssignments.map((assignment) => (
                <div key={assignment.id} className="p-3 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">{assignment.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Due: {assignment.dueDate}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {assignment.totalPoints} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
