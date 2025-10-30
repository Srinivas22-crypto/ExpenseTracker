import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface TestResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

const BackendTest = () => {
  const [result, setResult] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/test`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Backend Connection Test
          </CardTitle>
          <CardDescription>
            Test the connection between frontend and backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                <div className="space-y-2">
                  <p className="font-semibold">{result.message}</p>
                  <p className="text-sm opacity-70">Status: Success</p>
                  <p className="text-sm opacity-70">
                    Timestamp: {new Date(result.timestamp).toLocaleString()}
                  </p>
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">API Configuration:</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API URL: {import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Frontend: Running on port 5173 (Vite)
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Backend: Running on port 5000 (Express)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendTest;

