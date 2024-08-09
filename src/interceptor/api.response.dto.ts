
export class ApiResponseServ<T> {
   success: boolean;

   errors_message: null | string;

   data: T | null;
}
