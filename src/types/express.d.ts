// src/types/express.d.ts

import { Request } from 'express';
import { File } from 'multer';
import { Account } from './Account'; 

declare module 'express' {
  interface Request {
    file?: File; 
    files?: File[] | { [fieldname: string]: File[] }; 
    user?: Account; 
  }
}
import { Request } from 'express';
import { Account } from './Account'; 

// Request 인터페이스를 확장합니다.
declare module 'express' {
  interface Request {
    user?: Account; 
  }
}