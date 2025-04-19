/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Calendar,
  BarChart,
  PlusCircle,
  Bell,
  Search
} from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast'; // Optional - if you have toast notifications

import NewCourseForm from './NewCourseForm';
import CreateAssignmentForm from './CreateAssignmentForm';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teacher_name, setName] = useState();
  
  // State for form dialogs
  const [newCourseDialogOpen, setNewCourseDialogOpen] = useState(false);
  const [newAssignmentDialogOpen, setNewAssignmentDialogOpen] = useState(false);
  
  // Optional - if you have toast notifications
  // const { toast } = useToast();

  useEffect(() => {
    fetchTeacherDashboardData();
  }, []);
  
  const fetchTeacherDashboardData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found. User may not be logged in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/teacher-dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses || []);
        setAssignments(data.assignments || []);
        setName(data.name || '');
      } else {
        console.error('Failed to fetch dashboard data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleNewCourseSubmit = async (formData) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('No auth token found. User may not be logged in.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/courses/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Course created successfully:', data);
        
        // Add the new course to the state
        setCourses(prevCourses => [...prevCourses, {
          id: data.id,
          title: data.title,
          lessons: 0, // New course has no lessons/assignments yet
        }]);
        
        // Show success message if you have toast component
        // toast?.({
        //   title: "Success!",
        //   description: "Course created successfully.",
        // });
        
        // Alternatively, you can refresh all dashboard data
        // fetchTeacherDashboardData();
        
      } else {
        console.error('Failed to create course:', data.message);
        // toast?.({
        //   title: "Error!",
        //   description: data.message || "Failed to create course.",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      // toast?.({
      //   title: "Error!",
      //   description: "An unexpected error occurred.",
      //   variant: "destructive",
      // });
    }
  };

  // Update this function in your TeacherDashboard component
const handleNewAssignmentSubmit = async (formData) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No auth token found. User may not be logged in.');
    throw new Error('Authentication required. Please log in again.');
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/assignments/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Assignment created successfully:', data);
      
      // Find the course name based on courseId
      const courseName = courses.find(c => c.id === formData.courseId)?.title || 'Unknown Course';
      
      // Add the new assignment to the state
      setAssignments(prevAssignments => [...prevAssignments, {
        id: data.id,
        title: data.title,
        course: courseName,
        questions: data.questions,
        dueDate: data.dueDate
      }]);
      
      // If you have toast notifications
      // toast?.({
      //   title: "Success!",
      //   description: "Assignment created successfully.",
      // });
      
      return data;
    } else {
      console.error('Failed to create assignment:', data.message);
      throw new Error(data.message || 'Failed to create assignment');
    }
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome {teacher_name}</h1>
          <p className="text-gray-600">Welcome Professor, Manage your courses and students.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for courses, students, or assignments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics" className="hidden md:block">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">{courses.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Assignments Created</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ClipboardCheck className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">{assignments.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage your courses</CardDescription>
              </div>
              <Button 
                className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setNewCourseDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> New Course
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start mb-3 md:mb-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.lessons} lessons</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Assignments
                        </Button>
                       
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No courses found. Create your first course!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>View and grade assignments</CardDescription>
              </div>
              <Button 
                className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700"
                onClick={() => setNewAssignmentDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {assignments.length > 0 ? (
                  assignments.map(assignment => (
                    <div
                      key={assignment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start mb-3 md:mb-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-gray-500">{assignment.course}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">No assignments found. Create your first assignment!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>View insights and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Analytics content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialogs */}
      <NewCourseForm 
        isOpen={newCourseDialogOpen}
        onClose={() => setNewCourseDialogOpen(false)}
        onSubmit={handleNewCourseSubmit}
      />

      <CreateAssignmentForm 
        isOpen={newAssignmentDialogOpen}
        onClose={() => setNewAssignmentDialogOpen(false)}
        onSubmit={handleNewAssignmentSubmit}
        courses={courses}
      />
    </div>
  );
};

export default TeacherDashboard;