import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {CorsOptions} from "@nestjs/common/interfaces/external/cors-options.interface";

!(async function bootstrap(): Promise<void> {
   const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
   });

   // Define the CORS options
   const corsOptions: CorsOptions = {
      origin: [
         process.env.CORS_HOST_HTTP || 'http://localhost:3003',
      ],
      methods: 'POST,GET,PATCH,DELETE',
      credentials: true, // Enable cookies and authentication headers
   };

   app.enableCors(corsOptions);
   app.setGlobalPrefix('api');

   await app.listen(+(process.env.NODE_LOCAL_PORT || 3008));
})();
