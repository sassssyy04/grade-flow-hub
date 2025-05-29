
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/types';

interface AssignmentUploadProps {
  onUpload: (assignment: Assignment) => void;
}

export const AssignmentUpload = ({ onUpload }: AssignmentUploadProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description || !dueDate || !totalPoints) {
      alert('Please fill all fields and select a PDF file');
      return;
    }

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      const assignment: Assignment = {
        id: Date.now().toString(),
        title,
        description,
        pdfUrl: URL.createObjectURL(file),
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        dueDate,
        totalPoints: parseInt(totalPoints),
      };

      onUpload(assignment);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setTotalPoints('');
      setFile(null);
      setIsUploading(false);
      
      alert('Assignment uploaded successfully!');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Assignment</span>
        </CardTitle>
        <CardDescription>Create new assignments for teachers to assign</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment description"
              rows={3}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="totalPoints">Total Points</Label>
              <Input
                id="totalPoints"
                type="number"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
                placeholder="100"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="file">PDF File</Label>
            <div className="mt-2 flex items-center space-x-4">
              <input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file')?.click()}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Choose PDF</span>
              </Button>
              {file && (
                <span className="text-sm text-green-600">
                  {file.name} selected
                </span>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Assignment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
