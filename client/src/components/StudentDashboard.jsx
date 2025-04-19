'use client';

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
import { BookOpen, Clock, Calendar, BarChart, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const courses = [
    { id: 1, title: 'Introduction to Mathematics', progress: 65, lessons: 24, completed: 16 },
    { id: 2, title: 'Physics Fundamentals', progress: 40, lessons: 18, completed: 7 },
    { id: 3, title: 'English Literature', progress: 90, lessons: 15, completed: 14 }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Algebra Quiz', course: 'Introduction to Mathematics', due: '2 days' },
    { id: 2, title: 'Newton\'s Laws Lab Report', course: 'Physics Fundamentals', due: '5 days' },
    { id: 3, title: 'Essay: Shakespeare Analysis', course: 'English Literature', due: '1 week' }
  ];

  const recentActivities = [
    { id: 1, action: 'Completed lesson', subject: 'Quadratic Equations', time: '2 hours ago' },
    { id: 2, action: 'Submitted assignment', subject: 'Literary Devices', time: 'Yesterday' },
    { id: 3, action: 'Started course', subject: 'Physics Fundamentals', time: '3 days ago' }
  ];

  const renderProgressBar = (progress) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, Alex! Continue your learning journey.</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700">
          <BookOpen className="mr-2 h-4 w-4" /> Browse All Courses
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="schedule" className="hidden md:block">Schedule</TabsTrigger>
          <TabsTrigger value="progress" className="hidden md:block">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metrics Cards */}
            {[
              { title: 'Enrolled Courses', value: 5, icon: BookOpen },
              { title: 'Hours Studied', value: 42, icon: Clock },
              { title: 'Completed Assignments', value: 24, icon: CheckCircle },
              { title: 'Average Score', value: '92%', icon: BarChart }
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{item.value}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Progress + Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Courses Progress</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{course.title}</h3>
                      <span className="text-sm text-gray-500">
                        {course.completed}/{course.lessons} lessons
                      </span>
                    </div>
                    {renderProgressBar(course.progress)}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Courses</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Tasks due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAssignments.map(assignment => (
                    <div key={assignment.id} className="flex items-start">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-gray-500">{assignment.course} • Due in {assignment.due}</p>
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{activity.action}</h4>
                      <p className="text-sm text-gray-500">{activity.subject}</p>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
