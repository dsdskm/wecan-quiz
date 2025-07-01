// src/types/express.d.ts

import { Request } from 'express';
import { File } from 'multer';
import { Account } from './Account'; // Assuming Account type is in ./Account.ts

declare module 'express' {
  interface Request {
    file?: File; // For single file uploads
    files?: File[] | { [fieldname: string]: File[] }; // For multiple file uploads
    user?: Account; // Account 타입을 사용하거나, 또는 사용자 정보의 실제 타입으로 교체하세요.
  }
}
import { Request } from 'express';
import { Account } from './Account'; // Assuming Account type is in ./Account.ts

// Request 인터페이스를 확장합니다.
declare module 'express' {
  interface Request {
    user?: Account; // Account 타입을 사용하거나, 또는 사용자 정보의 실제 타입으로 교체하세요.
  }
}