import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CreateAssignmentForm = ({ isOpen, onClose, onSubmit, courses }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    questions: '',
    language: '',
    objectives: '',
    dueDate: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous error when user makes changes
    if (error) setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous error when user makes changes
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.courseId || !formData.questions || !formData.dueDate) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        title: '',
        courseId: '',
        questions: '',
        language: '',
        objectives: '',
        dueDate: '',
      });
      
      setError('');
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Failed to create assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Assignment</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="title">Assignment Name*</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter assignment name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Dropdown */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="courseId">Course*</Label>
              <Select
                name="courseId"
                value={formData.courseId}
                onValueChange={(value) => handleSelectChange("courseId", value)}
                required
              >
                <SelectTrigger className="bg-white dark:bg-neutral-900 text-black dark:text-white border border-gray-300 dark:border-neutral-700">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                  {courses?.map(course => (
                    <SelectItem
                      key={course.id}
                      value={course.id}
                      className="bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800"
                    >
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of Questions Input */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="questions">Number of Questions*</Label>
              <Input
                id="questions"
                name="questions"
                type="number"
                value={formData.questions}
                onChange={handleChange}
                placeholder="Enter number of questions"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Enter assignment language (default: English)"
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="objectives">Assignment Objectives</Label>
            <Textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              placeholder="Enter assignment objectives (comma separated)"
              rows={2}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="dueDate">Due Date*</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose} 
              className="mr-2"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentForm;