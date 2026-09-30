import { z } from 'zod';

// ============================================================
// SECURITY SCHEMAS
// ============================================================

export const SecurityLevelSchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export type SecurityLevel = z.infer<typeof SecurityLevelSchema>;

export const CertificateStatusSchema = z.enum(['valid', 'expiring', 'expired', 'revoked', 'pending']);
export type CertificateStatus = z.infer<typeof CertificateStatusSchema>;

export const ThreatLevelSchema = z.enum(['none', 'low', 'medium', 'high', 'critical']);
export type ThreatLevel = z.infer<typeof ThreatLevelSchema>;

export const SecurityHeaderSchema = z.object({
  name: z.string(),
  value: z.string(),
  description: z.string(),
  enforced: z.boolean(),
  critical: z.boolean(),
});
export type SecurityHeader = z.infer<typeof SecurityHeaderSchema>;

export const SecurityRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['network', 'application', 'data', 'access', 'encryption', 'monitoring']),
  severity: SecurityLevelSchema,
  enabled: z.boolean(),
  action: z.enum(['block', 'alert', 'log', 'rate_limit', 'quarantine']),
  conditions: z.array(z.string()),
  lastTriggered: z.string().nullable(),
  triggerCount: z.number(),
});
export type SecurityRule = z.infer<typeof SecurityRuleSchema>;

export const CertificateSchema = z.object({
  id: z.string(),
  team: z.string(),
  type: z.enum(['tls', 'ssl', 'mutual-tls', 'client-cert']),
  commonName: z.string(),
  issuer: z.string(),
  serialNumber: z.string(),
  validFrom: z.string(),
  validTo: z.string(),
  keySize: z.number(),
  signatureAlgorithm: z.string(),
  fingerprint: z.string(),
  status: CertificateStatusSchema,
  daysUntilExpiry: z.number(),
  autoRenew: z.boolean(),
  pinned: z.boolean(),
});
export type Certificate = z.infer<typeof CertificateSchema>;

export const SecurityEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(['blocked', 'alert', 'warning', 'info', 'success']),
  source: z.string(),
  target: z.string(),
  rule: z.string(),
  details: z.string(),
  ip: z.string(),
  userAgent: z.string(),
  severity: SecurityLevelSchema,
  resolved: z.boolean(),
});
export type SecurityEvent = z.infer<typeof SecurityEventSchema>;

export const AntiFingerprintConfigSchema = z.object({
  canvas: z.boolean(),
  webgl: z.boolean(),
  audio: z.boolean(),
  fonts: z.boolean(),
  screen: z.boolean(),
  timezone: z.boolean(),
  language: z.boolean(),
  plugins: z.boolean(),
  webrtc: z.boolean(),
  hardware: z.boolean(),
});
export type AntiFingerprintConfig = z.infer<typeof AntiFingerprintConfigSchema>;

export const SecurityMetricsSchema = z.object({
  totalBlocked: z.number(),
  totalAlerts: z.number(),
  activeThreats: z.number(),
  securityScore: z.number(),
  certificatesValid: z.number(),
  certificatesExpiring: z.number(),
  rulesEnabled: z.number(),
  lastSecurityScan: z.string(),
  encryptionStrength: z.string(),
  tlsVersion: z.string(),
});
export type SecurityMetrics = z.infer<typeof SecurityMetricsSchema>;

// ============================================================
// SECURITY ARCHITECTURE LAYERS
// ============================================================

export interface SecurityLayer {
  id: string;
  name: string;
  description: string;
  color: string;
  components: SecurityComponent[];
}

export interface SecurityComponent {
  id: string;
  name: string;
  technology: string;
  framework: string;
  purpose: string;
  status: 'active' | 'monitoring' | 'standby';
  metrics?: {
    blocked: number;
    alerts: number;
    success: number;
  };
}

export const securityLayers: SecurityLayer[] = [
  {
    id: 'perimeter',
    name: 'Perimeter Security',
    description: 'Network-level protection and DDoS mitigation',
    color: '#ef4444',
    components: [
      {
        id: 'firewall',
        name: 'WAF (Web Application Firewall)',
        technology: 'Custom Rules Engine',
        framework: 'ModSecurity + OWASP CRS',
        purpose: 'Block malicious requests, SQL injection, XSS',
        status: 'active',
        metrics: { blocked: 1247, alerts: 89, success: 99.7 },
      },
      {
        id: 'ddos',
        name: 'DDoS Protection',
        technology: 'Rate Limiting + Challenge',
        framework: 'Custom + CloudFlare-style',
        purpose: 'Mitigate volumetric and application-layer attacks',
        status: 'active',
        metrics: { blocked: 3421, alerts: 12, success: 100 },
      },
      {
        id: 'ip-filter',
        name: 'IP Reputation Filter',
        technology: 'GeoIP + Blacklist',
        framework: 'MaxMind + Custom DB',
        purpose: 'Block known malicious IPs and suspicious regions',
        status: 'active',
        metrics: { blocked: 567, alerts: 23, success: 98.5 },
      },
    ],
  },
  {
    id: 'transport',
    name: 'Transport Security',
    description: 'TLS/SSL encryption and certificate management',
    color: '#f59e0b',
    components: [
      {
        id: 'tls-termination',
        name: 'TLS 1.3 Termination',
        technology: 'OpenSSL 3.x',
        framework: 'Node.js TLS Module',
        purpose: 'Encrypt all traffic with TLS 1.3, perfect forward secrecy',
        status: 'active',
      },
      {
        id: 'cert-manager',
        name: 'Certificate Manager',
        technology: 'X.509 PKI',
        framework: 'Custom CA + Let\'s Encrypt',
        purpose: 'Issue, renew, and revoke certificates for 6 teams',
        status: 'active',
      },
      {
        id: 'mtls',
        name: 'Mutual TLS (mTLS)',
        technology: 'Client Certificates',
        framework: 'Custom Implementation',
        purpose: 'Two-way authentication for inter-service communication',
        status: 'active',
      },
      {
        id: 'cert-pinning',
        name: 'Certificate Pinning',
        technology: 'HPKP (HTTP Public Key Pinning)',
        framework: 'Custom Implementation',
        purpose: 'Prevent MITM attacks by pinning certificate fingerprints',
        status: 'active',
      },
    ],
  },
  {
    id: 'identity',
    name: 'Identity & Access',
    description: 'Authentication, authorization, and session management',
    color: '#8b5cf6',
    components: [
      {
        id: 'auth',
        name: 'Multi-Factor Authentication',
        technology: 'TOTP + WebAuthn',
        framework: 'Custom + FIDO2',
        purpose: 'Require MFA for all administrative access',
        status: 'active',
      },
      {
        id: 'rbac',
        name: 'Role-Based Access Control',
        technology: 'Policy Engine',
        framework: 'OPA (Open Policy Agent)',
        purpose: 'Fine-grained permissions per team and agent',
        status: 'active',
      },
      {
        id: 'session',
        name: 'Secure Session Management',
        technology: 'JWT + Refresh Tokens',
        framework: 'Custom + Redis',
        purpose: 'Short-lived sessions with secure rotation',
        status: 'active',
      },
      {
        id: 'api-keys',
        name: 'API Key Management',
        technology: 'HMAC Signatures',
        framework: 'Custom Implementation',
        purpose: 'Secure API key generation and validation',
        status: 'active',
      },
    ],
  },
  {
    id: 'application',
    name: 'Application Security',
    description: 'Input validation, output encoding, and secure coding',
    color: '#06b6d4',
    components: [
      {
        id: 'input-validation',
        name: 'Input Validation Engine',
        technology: 'Schema Validation',
        framework: 'Zod + Custom Validators',
        purpose: 'Validate all inputs with strict schemas',
        status: 'active',
        metrics: { blocked: 2341, alerts: 45, success: 99.9 },
      },
      {
        id: 'output-encoding',
        name: 'Output Encoding',
        technology: 'Context-Aware Encoding',
        framework: 'Custom Implementation',
        purpose: 'Prevent XSS with automatic output encoding',
        status: 'active',
      },
      {
        id: 'csrf',
        name: 'CSRF Protection',
        technology: 'Double Submit Cookie',
        framework: 'Custom + SameSite',
        purpose: 'Prevent cross-site request forgery',
        status: 'active',
      },
      {
        id: 'cors',
        name: 'CORS Policy',
        technology: 'Strict Origin Policy',
        framework: 'Custom Implementation',
        purpose: 'Restrict cross-origin requests to trusted domains',
        status: 'active',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data Protection',
    description: 'Encryption at rest, in transit, and key management',
    color: '#10b981',
    components: [
      {
        id: 'encryption-rest',
        name: 'Encryption at Rest',
        technology: 'AES-256-GCM',
        framework: 'Node.js Crypto',
        purpose: 'Encrypt all stored data with AES-256',
        status: 'active',
      },
      {
        id: 'encryption-transit',
        name: 'Encryption in Transit',
        technology: 'TLS 1.3 + AES-256',
        framework: 'OpenSSL',
        purpose: 'Encrypt all network communication',
        status: 'active',
      },
      {
        id: 'kms',
        name: 'Key Management System',
        technology: 'HSM-backed',
        framework: 'Custom + HashiCorp Vault',
        purpose: 'Secure key generation, storage, and rotation',
        status: 'active',
      },
      {
        id: 'secrets',
        name: 'Secrets Manager',
        technology: 'Encrypted Vault',
        framework: 'Custom Implementation',
        purpose: 'Secure storage for API keys and credentials',
        status: 'active',
      },
    ],
  },
  {
    id: 'anti-fingerprint',
    name: 'Anti-Fingerprinting',
    description: 'Prevent browser fingerprinting and tracking',
    color: '#ec4899',
    components: [
      {
        id: 'canvas-protection',
        name: 'Canvas Fingerprint Protection',
        technology: 'Noise Injection',
        framework: 'Custom Implementation',
        purpose: 'Add random noise to canvas rendering',
        status: 'active',
      },
      {
        id: 'webgl-protection',
        name: 'WebGL Fingerprint Protection',
        technology: 'Parameter Randomization',
        framework: 'Custom Implementation',
        purpose: 'Randomize WebGL parameters',
        status: 'active',
      },
      {
        id: 'audio-protection',
        name: 'Audio Context Protection',
        technology: 'Audio Noise',
        framework: 'Custom Implementation',
        purpose: 'Add noise to audio fingerprinting',
        status: 'active',
      },
      {
        id: 'font-protection',
        name: 'Font Fingerprint Protection',
        technology: 'Font Obfuscation',
        framework: 'Custom Implementation',
        purpose: 'Prevent font enumeration',
        status: 'active',
      },
      {
        id: 'webrtc-protection',
        name: 'WebRTC Leak Protection',
        technology: 'IP Masking',
        framework: 'Custom Implementation',
        purpose: 'Prevent IP address leaks via WebRTC',
        status: 'active',
      },
    ],
  },
  {
    id: 'monitoring',
    name: 'Security Monitoring',
    description: 'Real-time threat detection and incident response',
    color: '#3b82f6',
    components: [
      {
        id: 'siem',
        name: 'Security Information & Event Management',
        technology: 'Log Aggregation',
        framework: 'Custom + Elasticsearch',
        purpose: 'Centralized security event logging',
        status: 'active',
      },
      {
        id: 'ids',
        name: 'Intrusion Detection System',
        technology: 'Pattern Matching',
        framework: 'Custom + Suricata Rules',
        purpose: 'Detect and alert on suspicious activity',
        status: 'active',
        metrics: { blocked: 89, alerts: 234, success: 99.2 },
      },
      {
        id: 'anomaly',
        name: 'Anomaly Detection',
        technology: 'ML-based',
        framework: 'Custom + TensorFlow.js',
        purpose: 'Detect unusual patterns and behaviors',
        status: 'active',
      },
      {
        id: 'audit',
        name: 'Audit Logging',
        technology: 'Immutable Logs',
        framework: 'Custom + Append-only',
        purpose: 'Track all security-relevant actions',
        status: 'active',
      },
    ],
  },
  {
    id: 'compliance',
    name: 'Compliance & Governance',
    description: 'Policy enforcement and regulatory compliance',
    color: '#f97316',
    components: [
      {
        id: 'policy-engine',
        name: 'Policy Enforcement Engine',
        technology: 'Declarative Policies',
        framework: 'OPA + Custom',
        purpose: 'Enforce security policies across all components',
        status: 'active',
      },
      {
        id: 'compliance',
        name: 'Compliance Checker',
        technology: 'Automated Scanning',
        framework: 'Custom + CIS Benchmarks',
        purpose: 'Continuous compliance monitoring',
        status: 'active',
      },
      {
        id: 'reporting',
        name: 'Security Reporting',
        technology: 'Dashboard + Alerts',
        framework: 'Custom Implementation',
        purpose: 'Generate security reports and metrics',
        status: 'active',
      },
    ],
  },
];
