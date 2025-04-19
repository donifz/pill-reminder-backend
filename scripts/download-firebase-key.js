import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase service account key
const serviceAccount = {
  type: 'service_account',
  project_id: 'reminder-a3e3b',
  private_key_id: '789257106c6cba6bd429699aa8954b5b7d1d9655',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmUrgzNVlINGhS\nuxVkHVDQBQy5x1yd1n4uq5WUfW5jn80tnI6z2PIWfIAqqwPz09pbfXX3Xf1D9imC\n7pSSu020FS4sV0DxLmkaTPZtBxXuPOSiEbLaej1qzx/XG1FmBT8iaJxfarsLM/Nf\nn66GXIiORP20v+th+LShGbIhuxMRdot5xAo0TYsJx1ryVaQDiqu/bq2rc7OP5wZK\ngT15So28dCVASp2wey2HvSSFG/tuZ8zM4kxgGnrBRbHzJljnqQhAvq5DfvAsKm3T\n7CrNUIGGXoow9MaSJSQtobWX9XQn75Jwx3vqbV6oi5Le58n1vhFeO38IXd4PQ7SK\n8FMlB559AgMBAAECggEAGxtWK/pg37Sy3/Dfrp5cglqgVVLZlFvV2tNaIIZEzHXJ\n4conM8aCxglqdgnDLiTz7H9JD5TA5yeiYlVx32wpYNUm3lEmI2iV9pRegSxrdZV1\nCbjqtlK/2b2CCfPI02C9hmUYPzDM5SmFW6tRrVI9azpxQtkYirIW9j6S2o57sBen\ninox7czsbVSQIsR+UgQ1Y6GP32jEseuRVTH/Vtm12U1bwpn5n0lnYkversMRPAxc\nZkOCGSr9sPquVAWytEhPG2tQDaj97gAmIZ5mFRnpyn0OkF7kdoFrUIeUoE1GhXTd\nQ6ZyMVHlZX5GKT3xy8e/+ZQLdhnaW+mVjvX7ubXj/QKBgQDakzvzeSy44OmsMKZO\n2bQtBhkVguHEwGiuM5OIFE4fvwufivHcCGPn3ovGAbx7aBrdA7/1oRcaiFbsZj8y\nASMceMkeh2klFIKwoTRFLNocEgbliznmX5wKvmcgFMaGJetgUiYubBIAjd0+tsXx\nHYjOrUqfqDAj/9i0/p2RbzOFlwKBgQDCzSHO+LR7JoRwevb+iBcso1toDkk2Sjnv\nF6PBT2PPWMS/th65nwGpOvV5Y9A+o0BXxFfBH3s9/0HcU7DxgC4qZDgb072BfMwk\nmcqG8SmCnRdcOv2O45zH/j9HKh8RORXLeiuHW4FvbHFpMCitTTrNjX34Upr2AmF+\n5mGZqtxHCwKBgQCpgVUU0/wixAlzR6cxrxNTd08sp3t+odiMf+MBvP15ESdqas51\n3OvdfXDX9bC941Yx4B6V1n+cS+9dFU4c8VTRV7pgupKH9wgDAoEOxGHBMxm2Geql\nBbB1hINlFbd/gRiwcgS6K4UqeNoDMKsA+e6GmU0t07jBsj/U3UBE8P/7sQKBgQCI\nROEynK38PAyHdq1TjrXPZxLpLp0uWiw+weWus6+Ze3petbK2nLGXxYO0gAtL1f2L\np/DPSwt2ahqTWwQ7XDRvOR468Rru+vL/Y4nWbdtg4C1YOnfnPfgNuyBe0utaq/lA\nFt1eWbeoz05ii+rYmF7bLfCCBp8aGr5C/DwoN+rR0wKBgCpeUzhAaNsYGSZm+o8I\nkDc9hKb6ADD/q2kc9N8/1cK7pRS6olTK5M/g8PPcz45EO96LGe22o+Au9Q7MJ1Ew\nrCK6IxKg/SrlTjIk5NHo4Eyz0U01+s/PLVzYymAMARN0EkyXglb1MEH30lhHLzRk\npL617BXgzECEHLO56iqCiqzw\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-fbsvc@reminder-a3e3b.iam.gserviceaccount.com',
  client_id: '118229484224465757530',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40reminder-a3e3b.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

// Write the service account key to a file
const serviceAccountPath = path.join(
  __dirname,
  '..',
  'firebase-service-account.json',
);

fs.writeFileSync(serviceAccountPath, JSON.stringify(serviceAccount, null, 2));

console.log(
  'Firebase service account key has been saved to:',
  serviceAccountPath,
);
