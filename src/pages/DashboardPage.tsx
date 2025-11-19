// src/pages/DashboardPage.tsx (or .jsx) — replace the component with this
import { useEffect, useState } from 'react';
import { Quiz } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Bookmark, TrendingUp } from 'lucide-react';
import { studentsAPI, quizAPI, bookmarksAPI } from '@/services/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch all in parallel
        const [studentsData, quizzesData, bookmarksData] = await Promise.all([
          studentsAPI.getAll(),
          quizAPI.getAll(),
          bookmarksAPI.getAll()
        ]);

        // Debugging: print raw shapes so we can see if something is a Promise or unexpected
        console.debug('dashboard fetch: studentsData', studentsData);
        console.debug('dashboard fetch: quizzesData', quizzesData);
        console.debug('dashboard fetch: bookmarksData', bookmarksData);

        // Normalize types: some endpoints may return { bookmarks: [...] } or the array directly
        const studentsArr = Array.isArray(studentsData) ? studentsData : (studentsData?.students || []);
        const quizzesArr = Array.isArray(quizzesData) ? quizzesData : (quizzesData?.quizzes || []);
        const bookmarksArr = Array.isArray(bookmarksData)
          ? bookmarksData
          : (bookmarksData?.bookmarks || bookmarksData || []);

        setStudents(studentsArr);
        setSavedQuizzes(quizzesArr);
        setBookmarkedQuestions(bookmarksArr);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // defensive: ensure savedQuizzes is an array and questions is an array for each quiz
  const totalQuestions = Array.isArray(savedQuizzes)
    ? savedQuizzes.reduce((acc, quiz) => {
        const qLen = Array.isArray(quiz?.questions) ? quiz.questions.length : 0;
        return acc + qLen;
      }, 0)
    : 0;

  const stats = [
    {
      title: 'Total Students',
      value: Array.isArray(students) ? students.length : 0,
      icon: Users,
      description: 'Uploaded student records',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Quizzes Created',
      value: Array.isArray(savedQuizzes) ? savedQuizzes.length : 0,
      icon: FileText,
      description: 'AI-generated quizzes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Bookmarked Questions',
      value: Array.isArray(bookmarkedQuestions) ? bookmarkedQuestions.length : 0,
      icon: Bookmark,
      description: 'Saved for later use',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Total Questions',
      value: totalQuestions,
      icon: TrendingUp,
      description: 'Questions generated',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your quiz management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={`${stat.title}-${index}`}
            className="shadow-card hover:shadow-elevated transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                {/* use element as component */}
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/students" className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all group">
            <Users className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Manage Students</h3>
            <p className="text-sm text-muted-foreground">Upload and view student details</p>
          </a>

          <a href="/create-quiz" className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all group">
            <FileText className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">Create Quiz</h3>
            <p className="text-sm text-muted-foreground">Generate AI-powered questions</p>
          </a>

          <a href="/bookmarks" className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all group">
            <Bookmark className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-1">View Bookmarks</h3>
            <p className="text-sm text-muted-foreground">Access saved questions</p>
          </a>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {Array.isArray(savedQuizzes) && savedQuizzes.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedQuizzes.slice(0, 5).map((quiz, idx) => {
                // use _id || id || fallback index as key
                const key = quiz?._id || quiz?.id || `quiz-${idx}`;
                const title = typeof quiz?.title === 'string' ? quiz.title : 'Untitled';
                const qCount = Array.isArray(quiz?.questions) ? quiz.questions.length : 0;
                const createdAt = quiz?.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : '';
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {qCount} questions {createdAt ? `• ${createdAt}` : ''}
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
