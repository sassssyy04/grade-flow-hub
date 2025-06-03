
import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Assignment } from '@/types';

interface AssignmentUploadProps {
  onUpload: (assignment: Assignment) => void;
}

export const AssignmentUpload = ({ onUpload }: AssignmentUploadProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Error",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !description || !subject || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill all fields and select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      console.log('Uploading assignment file...');

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `assignments/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData.path);

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('assignments')
        .getPublicUrl(uploadData.path);

      console.log('Creating assignment record...');

      // Create assignment record in database
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('assignments')
        .insert([
          {
            title,
            description,
            subject,
            due_date: dueDate,
            teacher_id: session.user.id,
            file_path: uploadData.path
          }
        ])
        .select()
        .single();

      if (assignmentError) {
        console.error('Assignment creation error:', assignmentError);
        throw assignmentError;
      }

      console.log('Assignment created successfully:', assignmentData);

      // Create assignment object for the callback
      const assignment: Assignment = {
        id: assignmentData.id,
        title: assignmentData.title,
        description: assignmentData.description,
        pdfUrl: urlData.publicUrl,
        createdBy: session.user.id,
        createdAt: assignmentData.created_at,
        dueDate: assignmentData.due_date,
        totalPoints: 100, // Default value since it's not in the form
      };

      onUpload(assignment);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSubject('');
      setDueDate('');
      setFile(null);
      
      toast({
        title: "Success",
        description: "Assignment uploaded successfully!",
      });

    } catch (error: any) {
      console.error('Assignment upload error:', error);
      
      let errorMessage = "Failed to upload assignment";
      
      if (error.message?.includes('Admin access required')) {
        errorMessage = "You need admin privileges to upload assignments";
      } else if (error.message?.includes('Unauthorized')) {
        errorMessage = "Please log in to continue";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject (e.g., Math, English, Science)"
              required
            />
          </div>
          
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
