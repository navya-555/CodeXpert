// TeacherDashboard.jsx
import { useState } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const TeacherDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('overview');

  const courses = [
    { id: 1, title: 'Advanced Mathematics', students: 32, lessons: 24, avgScore: 88 },
    { id: 2, title: 'Physics 101', students: 28, lessons: 18, avgScore: 76 },
    { id: 3, title: 'English Composition', students: 35, lessons: 15, avgScore: 92 }
  ];

  const pendingAssignments = [
    { id: 1, title: 'Calculus Final Exam', course: 'Advanced Mathematics', submissions: 28, totalStudents: 32 },
    { id: 2, title: 'Physics Lab Report', course: 'Physics 101', submissions: 20, totalStudents: 28 },
    { id: 3, title: 'Essay Analysis', course: 'English Composition', submissions: 33, totalStudents: 35 }
  ];

  const recentActivities = [
    { id: 1, action: 'New submission', student: 'Emma Johnson', course: 'Advanced Mathematics', time: '1 hour ago' },
    { id: 2, action: 'Question asked', student: 'Michael Chen', course: 'Physics 101', time: '3 hours ago' },
    { id: 3, action: 'Grade published', course: 'English Composition', time: 'Yesterday' }
  ];

  const renderProgressBar = (value, max) => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600">Welcome, Professor Smith! Manage your courses and students.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" /> 
            Notifications
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Course
          </Button>
        </div>
      </div>

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

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students" className="hidden md:block">Students</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics" className="hidden md:block">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">8</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">185</span>
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
                  <span className="text-2xl font-bold">42</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-2xl font-bold">84%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Overview of your active courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className="text-sm text-gray-500">{course.students} students enrolled</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Average Score: {course.avgScore}%</span>
                      <span>{course.lessons} lessons</span>
                    </div>
                    {renderProgressBar(course.avgScore, 100)}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Courses</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Assignments to Grade</CardTitle>
                <CardDescription>Recently submitted work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAssignments.map(assignment => (
                    <div key={assignment.id} className="flex items-start">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                        <p className="text-sm text-gray-500">{assignment.submissions}/{assignment.totalStudents} submissions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Assignments</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 mr-3">
                      <Bell className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">
                        {activity.action} 
                        {activity.student && <span className="text-indigo-600"> by {activity.student}</span>}
                        {activity.course && <span> in {activity.course}</span>}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    {activity.action === 'New submission' && (
                      <Button size="sm" className="ml-2 bg-indigo-600 hover:bg-indigo-700">
                        Grade
                      </Button>
                    )}
                    {activity.action === 'Question asked' && (
                      <Button size="sm" className="ml-2 bg-indigo-600 hover:bg-indigo-700">
                        Reply
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>View and manage your courses</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" /> New Course
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map(course => (
                  <div key={course.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start mb-3 md:mb-0">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-500">{course.students} students • {course.lessons} lessons • Avg. score {course.avgScore}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Assignments
                      </Button>
                      <Button variant="outline" size="sm">
                        Students
                      </Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">Student management content will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>View and grade assignments</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pendingAssignments.map(assignment => (
                  <div key={assignment.id} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start mb-3 md:mb-0">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mr-3">
                        <ClipboardCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course} • {assignment.submissions}/{assignment.totalStudents} submissions</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        Grade
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
    </div>
  );
};

export default TeacherDashboard;