// Network diagnostic utilities for international users

export const checkSupabaseConnectivity = async (): Promise<{
  isReachable: boolean;
  responseTime: number;
  region?: string;
  error?: string;
}> => {
  const startTime = Date.now();
  
  try {
    // Try to reach Supabase health endpoint
    const response = await fetch('https://duouhbzwivonyssvtiqo.supabase.co/rest/v1/', {
      method: 'HEAD',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      isReachable: response.ok,
      responseTime,
      region: response.headers.get('cf-ray')?.split('-')[1] || 'unknown'
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      isReachable: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const getDNSInfo = async (): Promise<string[]> => {
  try {
    // Check if we can resolve the domain
    const resolved = await fetch('https://1.1.1.1/dns-query?name=duouhbzwivonyssvtiqo.supabase.co&type=A', {
      headers: { 'Accept': 'application/dns-json' }
    });
    
    const data = await resolved.json();
    return data.Answer?.map((a: any) => a.data) || [];
  } catch (error) {
    console.error('DNS resolution failed:', error);
    return [];
  }
};

export const getNetworkInfo = (): {
  userAgent: string;
  connection: any;
  timezone: string;
  language: string;
} => {
  return {
    userAgent: navigator.userAgent,
    connection: (navigator as any).connection || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  };
};

export const runNetworkDiagnostics = async (): Promise<void> => {
  console.log('🔍 Running network diagnostics for Supabase connectivity...');
  
  const networkInfo = getNetworkInfo();
  console.log('📱 Device Info:', networkInfo);
  
  const connectivityResult = await checkSupabaseConnectivity();
  console.log('🌐 Supabase Connectivity:', connectivityResult);
  
  const dnsInfo = await getDNSInfo();
  console.log('🔍 DNS Resolution:', dnsInfo);
  
  // Check if user is in a region with known connectivity issues
  const timezone = networkInfo.timezone;
  const regionWarnings: Record<string, string> = {
    'Asia/Dubai': 'UAE users may experience connectivity issues due to regional routing',
    'Asia/Qatar': 'Gulf region users may experience connectivity issues',
    'Asia/Kuwait': 'Gulf region users may experience connectivity issues',
    'Asia/Bahrain': 'Gulf region users may experience connectivity issues',
    'Asia/Riyadh': 'Saudi Arabia users may experience connectivity issues'
  };
  
  if (regionWarnings[timezone]) {
    console.warn('⚠️ Regional Notice:', regionWarnings[timezone]);
  }
  
  if (!connectivityResult.isReachable) {
    console.error('❌ Supabase is not reachable from your location');
    console.log('💡 Suggested solutions:');
    console.log('   1. Check your internet connection');
    console.log('   2. Try using a VPN');
    console.log('   3. Contact your ISP about Supabase.co access');
  } else if (connectivityResult.responseTime > 5000) {
    console.warn('⚠️ Slow connection detected:', `${connectivityResult.responseTime}ms`);
  } else {
    console.log('✅ Supabase connection is working fine');
  }
};