import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Edit, Trash2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Todo List</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay organized and boost your productivity with our beautiful, intuitive todo list application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Create Tasks</CardTitle>
              <CardDescription>
                Easily add new tasks with titles and descriptions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Edit className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Edit & Update</CardTitle>
              <CardDescription>
                Modify your tasks and mark them as complete
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle>Delete Tasks</CardTitle>
              <CardDescription>
                Remove completed or unwanted tasks with confirmation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Ready to get started?</CardTitle>
            <CardDescription>
              Sign in to create and manage your todo lists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = '/api/login'}
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
