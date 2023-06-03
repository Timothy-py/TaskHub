import { SetMetadata } from '@nestjs/common';

// decorator to assign isPublic=true to api
export const Public = () => SetMetadata('isPublic', true);
