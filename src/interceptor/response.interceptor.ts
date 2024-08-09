import {CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor} from '@nestjs/common';
import {map, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ApiResponseServ} from './api.response.dto';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ApiResponseServ<T>> {
   intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponseServ<T>> {
      return next.handle().pipe(
          catchError((error) => {
             // Обработка ошибок
             const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
             let errorMessage = 'Internal Server Error'; // Default error message

             // Extract error messages from BadRequestException
             if (error instanceof HttpException && error.getResponse())
                errorMessage = error.getResponse()['message'] ? error.getResponse()['message'] : error.getResponse();
             errorMessage = error.meta ? error.meta?.cause : errorMessage;

             /*console.log('Intercept error-', error);*/
             return throwError(() => {
                throw new HttpException(
                    {
                       success: false,
                       errors_message: errorMessage,
                       data: null,
                    },
                    status,
                );
             });
          }),

          map((data) => ({
             success: true,
             errors_message: null,
             data: /*data.id ? data.id :*/ data,
          })),
      );
   }
}
