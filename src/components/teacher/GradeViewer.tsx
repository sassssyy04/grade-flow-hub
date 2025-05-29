
import { useState } from 'react';
import { Award, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudentAssignment } from '@/types';

interface GradeViewerProps {
  assignments: StudentAssignment[];
  onGradeUpdate: (assignment: StudentAssignment) => void;
}

export const GradeViewer = ({ assignments, onGradeUpdate }: GradeViewerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  const mockStudents = {
    'student1': 'Alice Johnson',
    'student2': 'Bob Smith',
    'student3': 'Charlie Brown',
    'student4': 'Diana Lee',
  };

  const mockAssignments = {
    '1': 'Algebra Fundamentals',
    '2': 'Essay Writing Basics',
  };

  const handleEditStart = (assignment: StudentAssignment) => {
    setEditingId(assignment.id);
    setGradeInput(assignment.grade?.toString() || '');
    setFeedbackInput(assignment.feedback || '');
  };

  const handleSaveGrade = (assignment: StudentAssignment) => {
    const grade = parseInt(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    const updatedAssignment: StudentAssignment = {
      ...assignment,
      grade,
      feedback: feedbackInput,
      status: 'graded',
    };

    onGradeUpdate(updatedAssignment);
    setEditingId(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Student Grades</span>
        </CardTitle>
        <CardDescription>View and grade student submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {assignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assignments assigned yet</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">
                        {mockAssignments[assignment.assignmentId as keyof typeof mockAssignments] || 'Unknown Assignment'}
                      </h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Student: {mockStudents[assignment.studentId as keyof typeof mockStudents] || 'Unknown Student'}
                    </p>
                    
                    {editingId === assignment.id ? (
                      <div className="space-y-3 mt-3">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Grade (0-100)"
                            value={gradeInput}
                            onChange={(e) => setGradeInput(e.target.value)}
                            min="0"
                            max="100"
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                        <Textarea
                          placeholder="Feedback for student..."
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleSaveGrade(assignment)}
                            className="flex items-center space-x-1"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleCancel}
                            className="flex items-center space-x-1"
                          >
                            <X className="h-4 w-4" />
                            <span>Cancel</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          {assignment.grade !== undefined ? (
                            <div>
                              <span className="text-lg font-bold text-green-600">
                                {assignment.grade}/100
                              </span>
                              {assignment.feedback && (
                                <p className="text-sm text-gray-600 mt-1">{assignment.feedback}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">Not graded yet</span>
                          )}
                        </div>
                        {assignment.status === 'submitted' || assignment.status === 'graded' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditStart(assignment)}
                            className="flex items-center space-x-1"
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>{assignment.grade !== undefined ? 'Edit Grade' : 'Grade'}</span>
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
