
import { Clock, CheckCircle, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudentAssignment } from '@/types';

interface AssignmentListProps {
  assignments: StudentAssignment[];
  onAssignmentOpen: (assignment: StudentAssignment) => void;
  showGrades?: boolean;
}

export const AssignmentList = ({ assignments, onAssignmentOpen, showGrades }: AssignmentListProps) => {
  const mockAssignments = {
    '1': { title: 'Algebra Fundamentals', description: 'Basic algebraic equations and problem solving', dueDate: '2024-01-15', totalPoints: 100 },
    '2': { title: 'Essay Writing Basics', description: 'Introduction to structured essay writing', dueDate: '2024-01-20', totalPoints: 75 },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <FileText className="h-4 w-4" />;
      case 'submitted': return <CheckCircle className="h-4 w-4" />;
      case 'graded': return <Award className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
    <div className="space-y-4">
      {assignments.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assignments available</p>
          </CardContent>
        </Card>
      ) : (
        assignments.map((assignment) => {
          const assignmentData = mockAssignments[assignment.assignmentId as keyof typeof mockAssignments];
          if (!assignmentData) return null;

          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon(assignment.status)}
                    <span>{assignmentData.title}</span>
                  </CardTitle>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status.replace('_', ' ')}
                  </Badge>
                </div>
                <CardDescription>{assignmentData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Due: {assignmentData.dueDate}</p>
                    <p className="text-sm text-gray-600">Points: {assignmentData.totalPoints}</p>
                    {showGrades && assignment.grade !== undefined && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-green-600">
                          Grade: {assignment.grade}/{assignmentData.totalPoints} ({Math.round((assignment.grade / assignmentData.totalPoints) * 100)}%)
                        </p>
                        {assignment.feedback && (
                          <p className="text-sm text-gray-600">Feedback: {assignment.feedback}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => onAssignmentOpen(assignment)}
                    variant={assignment.status === 'graded' ? 'outline' : 'default'}
                  >
                    {assignment.status === 'graded' ? 'View' : 'Open'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
