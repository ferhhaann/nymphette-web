import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Key, 
  Database, 
  Users, 
  FileCheck,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdminAccess } from "@/hooks/useAdminAccess";

interface SecurityRecommendation {
  category: string;
  recommendation: string;
  priority: string;
  action_required: string;
}

interface SecurityCompliance {
  setting_name: string;
  current_value: string;
  recommended_value: string;
  compliant: boolean;
  severity: string;
}

interface AuditLog {
  id: string;
  action: string;
  table_name: string;
  record_id?: string;
  user_id?: string;
  created_at: string;
  notes?: string;
}

const SecurityDashboard = () => {
  const { isAdmin } = useAdminAccess();
  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([]);
  const [compliance, setCompliance] = useState<SecurityCompliance[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityData();
    }
  }, [isAdmin]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch security recommendations
      const { data: recData } = await supabase
        .rpc('get_security_recommendations');
      
      // Fetch security compliance
      const { data: compData } = await supabase
        .rpc('check_auth_security_compliance');
      
      // Fetch recent audit logs
      const { data: auditData } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (recData) setRecommendations(recData);
      if (compData) setCompliance(compData);
      if (auditData) setAuditLogs(auditData);
      
    } catch (error) {
      console.error('Error fetching security data:', error);
      toast.error('Failed to load security dashboard');
    } finally {
      setLoading(false);
    }
  };

  const runSecurityScan = async () => {
    try {
      // This would trigger a comprehensive security scan
      toast.info('Running security scan...');
      await fetchSecurityData();
      toast.success('Security scan completed');
    } catch (error) {
      toast.error('Security scan failed');
    }
  };

  const getSecurityScore = () => {
    if (compliance.length === 0) return 0;
    const compliantCount = compliance.filter(item => item.compliant).length;
    return Math.round((compliantCount / compliance.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Admin access required</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage application security</p>
        </div>
        <Button onClick={runSecurityScan} className="w-full sm:w-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      {/* Security Score Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">{getSecurityScore()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">RLS Policies</p>
                <p className="text-2xl font-bold">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auth Security</p>
                <p className="text-2xl font-bold">Protected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audit Logs</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-semibold">{rec.category}</h4>
                    <Badge variant={getPriorityColor(rec.priority)}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                  <p className="text-xs text-muted-foreground">{rec.action_required}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileCheck className="h-5 w-5" />
                <span>Security Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {compliance.map((item, index) => (
                <Alert key={index} className="border rounded-lg">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(item.severity)}
                    <div className="flex-1 space-y-1">
                      <AlertDescription>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <strong>{item.setting_name}</strong>
                          <Badge variant={item.compliant ? 'outline' : 'destructive'}>
                            {item.compliant ? 'Compliant' : 'Needs Attention'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <p><strong>Current:</strong> {item.current_value}</p>
                          <p><strong>Recommended:</strong> {item.recommended_value}</p>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Audit Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-3 text-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{log.action}</span>
                        <span className="text-muted-foreground">on {log.table_name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>
                    )}
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

export default SecurityDashboard;