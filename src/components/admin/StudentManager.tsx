
import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentProfile } from '@/types';

interface StudentManagerProps {
  onStudentCreate: (student: StudentProfile) => void;
}

export const StudentManager = ({ onStudentCreate }: StudentManagerProps) => {
  const [userId, setUserId] = useState('');
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !grade || !subjects) {
      alert('Please fill all required fields');
      return;
    }

    const student: StudentProfile = {
      id: Date.now().toString(),
      userId,
      grade,
      subjects: subjects.split(',').map(s => s.trim()),
      parentEmail: parentEmail || undefined,
      createdAt: new Date().toISOString(),
    };

    onStudentCreate(student);
    
    // Reset form
    setUserId('');
    setGrade('');
    setSubjects('');
    setParentEmail('');
    
    alert('Student profile created successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Create Student Profile</span>
        </CardTitle>
        <CardDescription>Add new students to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userId">Student ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter student ID"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="grade">Grade Level</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="K">Kindergarten</SelectItem>
                <SelectItem value="1">1st Grade</SelectItem>
                <SelectItem value="2">2nd Grade</SelectItem>
                <SelectItem value="3">3rd Grade</SelectItem>
                <SelectItem value="4">4th Grade</SelectItem>
                <SelectItem value="5">5th Grade</SelectItem>
                <SelectItem value="6">6th Grade</SelectItem>
                <SelectItem value="7">7th Grade</SelectItem>
                <SelectItem value="8">8th Grade</SelectItem>
                <SelectItem value="9">9th Grade</SelectItem>
                <SelectItem value="10">10th Grade</SelectItem>
                <SelectItem value="11">11th Grade</SelectItem>
                <SelectItem value="12">12th Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subjects">Subjects</Label>
            <Input
              id="subjects"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Math, Science, English (comma separated)"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="parentEmail">Parent Email (Optional)</Label>
            <Input
              id="parentEmail"
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder="parent@email.com"
            />
          </div>
          
          <Button type="submit" className="w-full">
            Create Student Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
