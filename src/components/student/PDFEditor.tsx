
import { useState } from 'react';
import { ArrowLeft, Save, Send, Edit3, Type, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { StudentAssignment } from '@/types';

interface PDFEditorProps {
  assignment: StudentAssignment;
  onBack: () => void;
  onSubmit: (assignmentId: string) => void;
}

export const PDFEditor = ({ assignment, onBack, onSubmit }: PDFEditorProps) => {
  const [annotations, setAnnotations] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'text' | 'pen'>('text');

  const mockAssignments = {
    '1': { title: 'Algebra Fundamentals', description: 'Basic algebraic equations and problem solving' },
    '2': { title: 'Essay Writing Basics', description: 'Introduction to structured essay writing' },
  };

  const assignmentData = mockAssignments[assignment.assignmentId as keyof typeof mockAssignments];

  const handleSave = () => {
    console.log('Saving progress...', annotations);
    alert('Progress saved!');
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit this assignment? You won\'t be able to edit it after submission.')) {
      onSubmit(assignment.id);
      alert('Assignment submitted successfully!');
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Assignments</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{assignmentData?.title}</h1>
            <p className="text-gray-600">{assignmentData?.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSave} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Progress</span>
          </Button>
          {assignment.status !== 'graded' && (
            <Button onClick={handleSubmit} className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Submit</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* PDF Viewer */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Assignment Document</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedTool === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('text')}
                    className="flex items-center space-x-1"
                  >
                    <Type className="h-4 w-4" />
                    <span>Text</span>
                  </Button>
                  <Button
                    variant={selectedTool === 'pen' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('pen')}
                    className="flex items-center space-x-1"
                  >
                    <Pen className="h-4 w-4" />
                    <span>Draw</span>
                  </Button>
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-1"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>{isEditing ? 'View' : 'Edit'}</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full pb-6">
              <div className="w-full h-full bg-gray-100 border rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated PDF content */}
                <div className="w-full h-full bg-white shadow-lg max-w-2xl mx-auto p-8 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">Assignment: {assignmentData?.title}</h2>
                  <div className="space-y-4 text-sm">
                    <p>Instructions: Complete the following problems showing all your work.</p>
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <p className="font-medium">Problem 1:</p>
                        <p>Solve for x: 2x + 5 = 13</p>
                        {isEditing && (
                          <div className="mt-2 p-2 border-2 border-dashed border-blue-300 bg-blue-50">
                            <p className="text-xs text-blue-600 mb-1">Your answer:</p>
                            <input 
                              type="text" 
                              className="w-full p-1 border rounded text-sm" 
                              placeholder="Type your answer here..."
                            />
                          </div>
                        )}
                      </div>
                      <div className="border-b pb-4">
                        <p className="font-medium">Problem 2:</p>
                        <p>Simplify: 3(x + 4) - 2x</p>
                        {isEditing && (
                          <div className="mt-2 p-2 border-2 border-dashed border-blue-300 bg-blue-50">
                            <p className="text-xs text-blue-600 mb-1">Your answer:</p>
                            <input 
                              type="text" 
                              className="w-full p-1 border rounded text-sm" 
                              placeholder="Type your answer here..."
                            />
                          </div>
                        )}
                      </div>
                      <div className="border-b pb-4">
                        <p className="font-medium">Problem 3:</p>
                        <p>Graph the equation: y = 2x - 1</p>
                        {isEditing && (
                          <div className="mt-2 p-2 border-2 border-dashed border-blue-300 bg-blue-50">
                            <p className="text-xs text-blue-600 mb-1">Draw your graph:</p>
                            <div className="w-full h-24 bg-white border grid grid-cols-8 grid-rows-6">
                              {/* Grid for drawing */}
                              {Array.from({ length: 48 }).map((_, i) => (
                                <div key={i} className="border border-gray-200"></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Editing overlay */}
                {isEditing && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-blue-400 border-dashed opacity-50"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Selected Tool:</label>
                <p className="text-sm text-gray-600 capitalize">{selectedTool}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Mode:</label>
                <p className="text-sm text-gray-600">{isEditing ? 'Editing' : 'Viewing'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={annotations}
                onChange={(e) => setAnnotations(e.target.value)}
                placeholder="Add your notes here..."
                rows={8}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {assignment.status === 'graded' && assignment.grade !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{assignment.grade}/100</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {Math.round((assignment.grade / 100) * 100)}%
                  </div>
                  {assignment.feedback && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Teacher Feedback:</p>
                      <p className="text-sm text-blue-700 mt-1">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
